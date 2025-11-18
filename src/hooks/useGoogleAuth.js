import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Simple hook to access auth functions/state
 */
export function useGoogleAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useGoogleAuth must be used inside AuthProvider");
  return ctx;
}

