import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}
export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  if (!isAuthenticated || !user) {
    const loginPath = location.pathname.startsWith("/super-admin")
      ? "/super-admin/login"
      : "/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "super_admin") {
      return <Navigate to="/super-admin/dashboard" replace />;
    }
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/member/dashboard" replace />;
  }
  return <>{children}</>;
};
