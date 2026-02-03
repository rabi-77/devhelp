import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
interface PublicRouteProps {
  children: React.ReactNode;
}
export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user) {
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
