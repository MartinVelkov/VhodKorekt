import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

export default function RequireAuth({ redirectTo = "/login" }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        Loading…
      </div>
    );
  }

  if (!user) {
    // Save where the user wanted to go
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <Outlet />;
}