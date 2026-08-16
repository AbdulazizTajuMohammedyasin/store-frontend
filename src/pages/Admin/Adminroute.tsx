import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user || !user.is_staff) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
