import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useGoogleAuth();

  const onSuccess = (credentialResponse) => {
    const token = credentialResponse?.credential;
    
    if (!token) {
      toast.error("Please try again.");
      return;
    }

    const payload = jwtDecode(token);
    const email = payload?.email;
    
    if (!email || !email.endsWith("@lanatussystems.com")) {
      toast.error("Access denied. Only lanatussystems users allowed.");
      return;
    }

    const ok = login(token);
    if (!ok) {
      toast.error("Login failed. Please try again.");
    } else {
      toast.success("Login successful!");
    }
  };

  const onError = () => {
    toast.error("Login failed. Please try again.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative">
      {/* Logo in top left */}
      <div className="absolute top-6 left-6 z-10">
        <img src="/logo.png" alt="Logo" className="h-14 w-auto" />
      </div>

      {/* Centered sign-in form */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={onSuccess}
            onError={onError}
          />
        </div>
      </div>
    </div>
  );
}
