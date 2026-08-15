import request from "./client";

export function registerUser({ username, email, password, displayName }) {
  return request("/Auth/register", {
    method: "POST",
    body: { username, email, password, displayName },
  });
}

export function loginUser({ username, password }) {
  return request("/Auth/login", {
    method: "POST",
    body: { username, password },
  });
}

export function refreshAccessToken(refreshToken) {
  return request("/Auth/refresh-token", {
    method: "POST",
    body: { refreshToken },
  });
}

export function logoutUser(refreshToken) {
  return request("/Auth/logout", {
    method: "POST",
    body: { refreshToken },
  });
}
