import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "@/pages/PrivateRoute";

// ---------------- PÁGINAS PÚBLICAS ----------------
import RedirectPage from "@/pages/RedirectPage";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import RecoverPasswordPage from "@/pages/RecoverPasswordPage";
import RecoverCodePage from "@/pages/RecoverCodePage";
import RedefinePasswordPage from "@/pages/RedefinePasswordPage";

// ---------------- LAYOUTS E PÁGINAS DO APP ----------------
import MainLayout from "@/pages/layout/MainLayout";
import DashboardPage from "@/pages/DashboardPage";
import ClientPage from "@/pages/ClientPage";
import PaymentsPage from "@/pages/PaymentsPage";
import EmployeesPage from "@/pages/EmployeesPage";
import EmployeeRegisterPage from "@/pages/EmployeesRegisterPage";
import LogsPage from "@/pages/LogsPage";
import AuditLogs from "@/pages/AuditLogs";
import UserInfos from "@/pages/UserInfos";
import AddLabel from "@/pages/AddLabel";

// ---------------- ADMIN ----------------
import AdminSignInPage from "@/pages/admin/AdminSignInPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminCompaniesPage from "@/pages/admin/AdminCompaniesPage";
import AdminFinancesPage from "@/pages/admin/AdminFinancesPage";
import AdminClientsPage from "@/pages/admin/AdminClientsPage";
import AdminEmployeesPage from "@/pages/admin/AdminEmployeesPage";

export const Router = createBrowserRouter([
  // ---------------- PÚBLICAS ----------------
  { path: "/", element: <RedirectPage /> },
  { path: "/sign-in", element: <SignInPage /> },
  { path: "/sign-up", element: <SignUpPage /> },
  { path: "/recover-password", element: <RecoverPasswordPage /> },
  { path: "/recover-code", element: <RecoverCodePage /> },
  { path: "/redefine-password", element: <RedefinePasswordPage /> },

  // ---------------- APP PRINCIPAL ----------------
  {
    path: "/app",
    element: <PrivateRoute />,
    children: [
      {
        path: "",
        element: <MainLayout />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          { path: "user-infos", element: <UserInfos /> },
          { path: "clients", element: <ClientPage /> },
          { path: "add-label", element: <AddLabel /> },
          { path: "payments", element: <PaymentsPage /> },
          { path: "employees", element: <EmployeesPage /> },
          { path: "employee-register", element: <EmployeeRegisterPage /> },
          { path: "logs", element: <LogsPage /> },
          { path: "audit-log", element: <AuditLogs /> },
        ],
      },
    ],
  },

  // ---------------- ADMIN ----------------
  { path: "/admin/sign-in", element: <AdminSignInPage /> },
  {
    path: "/admin/app",
    element: <PrivateRoute />,
    children: [
      {
        path: "",
        element: <MainLayout />,
        children: [
          { path: "dashboard", element: <AdminDashboardPage /> },
          { path: "companies", element: <AdminCompaniesPage /> },
          { path: "finances", element: <AdminFinancesPage /> },
          { path: "clients", element: <AdminClientsPage /> },
          { path: "employees", element: <AdminEmployeesPage /> },
        ],
      },
    ],
  },
]);
