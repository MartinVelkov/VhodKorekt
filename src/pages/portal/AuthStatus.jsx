import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useAuth } from "../contexts/AuthContext";

export default function AuthStatus() {
  const { user, claims, loading } = useAuth();

  if (loading) return null;
  if (!user) return null;

  const role = claims?.role || (claims?.admin ? "admin" : claims?.owner ? "owner" : claims?.seller ? "seller" : "user");

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <div style={{ fontSize: 14, opacity: 0.85 }}>
        {user.email || user.uid} • {role}
      </div>
      <button
        type="button"
        onClick={() => signOut(auth)}
        style={{
          border: "1px solid #ddd",
          padding: "8px 10px",
          borderRadius: 8,
          background: "white",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}