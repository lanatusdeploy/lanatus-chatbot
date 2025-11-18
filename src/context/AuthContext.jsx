import React, { createContext, useEffect, useState } from "react";
import decodeToken from "../utils/decodeToken";
import { refreshToken as refreshGoogleToken } from "../utils/refreshToken";

const STORAGE_KEY = "google_auth_token";
const STORAGE_EMAIL = "google_auth_email";
const STORAGE_NAME = "google_auth_name";
const STORAGE_PICTURE = "google_auth_picture";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY);
    const email = localStorage.getItem(STORAGE_EMAIL);
    const name = localStorage.getItem(STORAGE_NAME);
    const picture = localStorage.getItem(STORAGE_PICTURE);

    if (!token) {
      setInitializing(false);
      return;
    }

    try {
      const payload = decodeToken(token);

      if (!payload || !payload.email) {
        logout();
        setInitializing(false);
        return;
      }

      // check expiry
      if (payload.exp * 1000 < Date.now()) {
        // try silent refresh
        refreshGoogleToken()
          .then((newToken) => {
            handleLoginWithToken(newToken);
            setInitializing(false);
          })
          .catch(() => {
            logout();
            setInitializing(false);
          });
        return;
      }

      // check domain
      if (!payload.email.endsWith("@lanatussystems.com")) {
        logout();
        setInitializing(false);
        return;
      }

      // Store user info without token
      setUser({ 
        email: email || payload.email, 
        name: name || payload.name || payload.email.split('@')[0],
        picture: picture || payload.picture || ''
      });
      setInitializing(false);
    } catch (err) {
      logout();
      setInitializing(false);
    }
  }, []);

  const handleLoginWithToken = (token) => {
    try {
      const payload = decodeToken(token);
      if (!payload.email.endsWith("@lanatussystems.com")) {
        throw new Error("Unauthorized domain");
      }
      localStorage.setItem(STORAGE_KEY, token);
      localStorage.setItem(STORAGE_EMAIL, payload.email);
      localStorage.setItem(STORAGE_NAME, payload.name || payload.email.split('@')[0]);
      localStorage.setItem(STORAGE_PICTURE, payload.picture || '');
      
      // Store user info without token
      setUser({ 
        email: payload.email, 
        name: payload.name || payload.email.split('@')[0],
        picture: payload.picture || ''
      });
      return true;
    } catch (e) {
      return false;
    }
  };

  const login = (credentialToken) => {
    return handleLoginWithToken(credentialToken);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_EMAIL);
    localStorage.removeItem(STORAGE_NAME);
    localStorage.removeItem(STORAGE_PICTURE);
    setUser(null);
    // disable auto-select if available
    if (window.google && window.google.accounts && window.google.accounts.id) {
      try {
        window.google.accounts.id.disableAutoSelect();
      } catch (e) {}
    }
  };

  const trySilentRefresh = async () => {
    try {
      const newToken = await refreshGoogleToken();
      const ok = handleLoginWithToken(newToken);
      if (!ok) throw new Error("Domain check failed");
      return { success: true, token: newToken };
    } catch (err) {
      logout();
      return { success: false, error: err };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, trySilentRefresh, initializing }}
    >
      {children}
    </AuthContext.Provider>
  );
}

