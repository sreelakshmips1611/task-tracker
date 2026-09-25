const TOKEN_KEY = "task_tracker_token";
const USER_KEY = "task_tracker_user";

export const setSession = (token, user) => {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getToken = () => sessionStorage.getItem(TOKEN_KEY);

export const getUser = () => {
  try {
    const value = sessionStorage.getItem(USER_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

export const clearSession = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => Boolean(getToken());

export const decodeTokenPayload = (token) => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
};
