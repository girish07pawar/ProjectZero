/**
 * Single source of truth for the stored session.
 *
 * Both the fetch layer (which needs to read the access token on every request
 * and rewrite it after a silent refresh) and React state need this, so it lives
 * outside both and notifies subscribers on change.
 */

const STORAGE_KEY = "pz_auth";

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

let current = readStored();
const listeners = new Set();

export function getAuth() {
  return current;
}

export function setAuth(auth) {
  current = auth;
  if (auth) localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  else localStorage.removeItem(STORAGE_KEY);
  listeners.forEach((fn) => fn(current));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
