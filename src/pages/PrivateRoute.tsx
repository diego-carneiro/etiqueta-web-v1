import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PrivateRoute() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const token = localStorage.getItem(isAdminRoute ? "adminToken" : "token");

  return token ? (
    <Outlet />
  ) : (
    <Navigate to={isAdminRoute ? "/admin/sign-in" : "/sign-in"} replace />
  );
}
