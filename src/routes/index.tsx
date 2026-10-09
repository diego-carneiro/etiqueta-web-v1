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
import CustomerPage from "@/pages/CustomerPage";
import CustomerInfos from "@/pages/CustomerInfos";
import PaymentsPage from "@/pages/PaymentsPage";
import EmployeesPage from "@/pages/EmployeesPage";
import EmployeeRegisterPage from "@/pages/EmployeesRegisterPage";
import LogsPage from "@/pages/LogsPage";
import AuditLogs from "@/pages/AuditLogs";
import AddLabel from "@/pages/AddLabel";

// ---------------- ADMIN ----------------
import AdminSignInPage from "@/pages/admin/AdminSignInPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminCompaniesPage from "@/pages/admin/AdminCompaniesPage";
import AdminCompanyDetailPage from "@/pages/admin/AdminCompanyDetailPage";
import AdminFinancesPage from "@/pages/admin/AdminFinancesPage";
import AdminCustomersPage from "@/pages/admin/AdminCustomersPage";
import AdminEmployeesPage from "@/pages/admin/AdminEmployeesPage";
import AdminLogsPage from "@/pages/admin/AdminLogsPage";

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
          { path: "customer", element: <CustomerPage /> },
          { path: "customer-infos", element: <CustomerInfos /> },
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
          { path: "company-details", element: <AdminCompanyDetailPage /> },
          { path: "finances", element: <AdminFinancesPage /> },
          { path: "customer", element: <AdminCustomersPage /> },
          { path: "employees", element: <AdminEmployeesPage /> },
          { path: "logs", element: <AdminLogsPage /> },
        ],
      },
    ],
  },
]);
