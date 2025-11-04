import { Home, Users, Settings, LogOut, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: "Painel", icon: Home, path: "/app/dashboard" },
    { label: "Cliente", icon: FileText, path: "/app/client" },
    { label: "Funcionários", icon: Users, path: "/app/employees" },
    { label: "Histórico", icon: Settings, path: "/app/logs" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/sign-in");
  };

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
        {menuItems.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors duration-150",
                isActive
                  ? "bg-white/15 text-white font-semibold"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon
                size={18}
                className={cn(isActive ? "text-white" : "text-white/80")}
              />
              {label}
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
