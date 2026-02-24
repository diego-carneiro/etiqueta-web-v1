import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PrivateRoute() {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    const isAdminRoute = location.pathname.startsWith("/admin");

    return (
      <Navigate to={isAdminRoute ? "/admin/sign-in" : "/sign-in"} replace />
    );
  }

  return <Outlet />;
}
