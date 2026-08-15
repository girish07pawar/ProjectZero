import { getAuth, setAuth } from "./tokenStore";

// Defaults to a relative path so the Vite dev proxy (see vite.config.js) can
// forward to the .NET backend — no CORS, no dev-cert trust prompt. Set
// VITE_API_BASE_URL to an absolute URL for deployed builds.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// A 401 on an /Auth/* call is a real failure (bad credentials, dead refresh
// token), not something a refresh can fix.
const isAuthPath = (path) => path.startsWith("/Auth/");

let refreshPromise = null;

/**
 * Exchanges the refresh token for a new access token. Concurrent 401s share one
 * in-flight call so a burst of requests doesn't fire a burst of refreshes.
 * Resolves to the new access token, or null if the session is unrecoverable.
 */
function refreshTokens() {
  if (refreshPromise) return refreshPromise;

  const refreshToken = getAuth()?.refreshToken;
  if (!refreshToken) return Promise.resolve(null);

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/Auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return null;

      const data = await res.json();
      if (!data?.accessToken) return null;

      // refresh-token returns tokens only, so carry the existing user through.
      setAuth({
        ...getAuth(),
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      return data.accessToken;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Thin fetch wrapper. Every auth response follows the shape:
 * { success, message, accessToken?, refreshToken?, expiresIn?, user? }
 */
async function request(path, { method = "GET", body, token, retry = true } = {}) {
  const accessToken = token ?? getAuth()?.accessToken;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && retry && !isAuthPath(path)) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      return request(path, { method, body, token: refreshed, retry: false });
    }
    // Refresh failed — drop the session so the UI falls back to /login
    // instead of sitting in a logged-in state that can't load anything.
    setAuth(null);
  }

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    // Handles both the { success:false, message } shape and the
    // ASP.NET Core validation-error shape ({ errors: { Field: [...] } })
    const message =
      data?.message ||
      (data?.errors && Object.values(data.errors).flat().join(" ")) ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export default request;
export { BASE_URL };
