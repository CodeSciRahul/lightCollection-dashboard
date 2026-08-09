import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  canAccessDashboard,
  getDefaultRouteForUser,
  isApprovedSeller,
} from "../lib/redirect.js";
import { BrandLogo } from "@/components/BrandLogo.jsx";

export function LoadingScreen() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-gradient-to-br from-brand-cream/40 via-brand-white to-brand-cream/20">
      <BrandLogo subtitle="Dashboard" />
      <div className="flex items-center gap-2">
        <span className="size-2 animate-bounce rounded-full bg-brand-amber [animation-delay:-0.3s]" />
        <span className="size-2 animate-bounce rounded-full bg-brand-amber [animation-delay:-0.15s]" />
        <span className="size-2 animate-bounce rounded-full bg-brand-amber" />
      </div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );
}

export function ProtectedRoute({
  children,
  roles = [],
  requireApprovedSeller = false,
}) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  if (!canAccessDashboard(user)) {
    return <Navigate to="/auth" replace />;
  }

  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to={getDefaultRouteForUser(user)} replace />;
  }

  if (requireApprovedSeller && !isApprovedSeller(user) && user.role !== "admin") {
    return <Navigate to="/seller/profile" replace />;
  }

  return children;
}

export function GuestRoute({ children }) {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const clearingRef = useRef(false);

  // Wrong role (e.g. customer token) must not redirect /auth → /auth forever.
  useEffect(() => {
    if (!isAuthenticated || canAccessDashboard(user) || clearingRef.current) {
      return;
    }
    clearingRef.current = true;
    logout();
  }, [isAuthenticated, user, logout]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated && canAccessDashboard(user)) {
    return <Navigate to={getDefaultRouteForUser(user)} replace />;
  }

  if (isAuthenticated && !canAccessDashboard(user)) {
    return <LoadingScreen />;
  }

  return children;
}
