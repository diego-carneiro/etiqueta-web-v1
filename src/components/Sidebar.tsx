import { useState } from "react";
import {
  Home,
  Users,
  Settings,
  LogOut,
  FileText,
  Building2,
  Wallet,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

  const isAdmin = location.pathname.startsWith("/admin");
  const basePath = isAdmin ? "/admin/app" : "/app";

  const handleLogout = () => {
    navigate(isAdmin ? "/admin/sign-in" : "/sign-in");
  };

  const baseMenuItems = [
    { label: "Dashboard", icon: Home, path: `${basePath}/dashboard` },
    { label: "Clientes", icon: FileText, path: `${basePath}/clients` },
    { label: "Funcionários", icon: Users, path: `${basePath}/employees` },
    { label: "Histórico", icon: Settings, path: `${basePath}/logs` },
  ];

  const adminExtraItems = [
    {
      label: "Administrativo",
      icon: Wallet,
      subItems: [
        {
          label: "Lojas",
          icon: Building2,
          path: `${basePath}/service-centers`,
        },
        { label: "Financeiro", icon: Wallet, path: `${basePath}/finances` },
      ],
    },
  ];

  const reorderedMenu = isAdmin
    ? [baseMenuItems[0], ...adminExtraItems, ...baseMenuItems.slice(1)]
    : baseMenuItems;

  return (
    <aside className="w-64 h-screen bg-[#004AAD] p-6 flex flex-col">
      <div className="flex justify-center mb-8 mt-2">
        <img
          src="../../img/etiquetalogomedium.png"
          alt="Logo"
          className="w-40 h-auto"
        />
      </div>

      <h2 className="text-sm text-white font-semibold mb-4 tracking-wide">
        Menu
      </h2>

      <nav className="flex flex-col gap-2">
        {reorderedMenu.map((item) => {
          if ("subItems" in item) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                  className="flex items-center justify-between w-full px-4 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-150"
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className="text-white" />
                    <span className="font-semibold text-white">
                      {item.label}
                    </span>
                  </div>
                  {isAdminDropdownOpen ? (
                    <ChevronUp size={16} className="text-white" />
                  ) : (
                    <ChevronDown size={16} className="text-white" />
                  )}
                </button>

                {isAdminDropdownOpen && (
                  <div className="ml-9 mt-2 flex flex-col gap-2">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        className="flex items-center gap-3 px-2 py-1.5 rounded-md text-sm text-white"
                      >
                        <sub.icon size={16} />
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors duration-150 ${
                isActive
                  ? "bg-white/15 text-white font-semibold"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <item.icon
                size={18}
                className={isActive ? "text-white" : "text-white/80"}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-150"
      >
        <LogOut size={18} className="text-white/80" />
        Sair
      </button>
    </aside>
  );
}
