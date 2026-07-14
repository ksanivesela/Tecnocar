import { LayoutDashboard, Package, CalendarDays, Users, ShoppingBag, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const items = [
  { icon: <LayoutDashboard />, name: "Dashboard", to: "/admin", end: true },
  { icon: <Package />, name: "Productos", to: "/admin/productos", end: false },
  { icon: <CalendarDays />, name: "Reservas", to: "/admin/reservas", end: false },
  { icon: <ShoppingBag />, name: "Pedidos", to: "/admin/pedidos", end: false },
  { icon: <Users />, name: "Usuarios", to: "/admin/usuarios", end: false },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="w-72 bg-[#151922] min-h-screen border-r border-[#2a313d] p-8 flex flex-col">

      <h2 className="text-3xl font-black text-[#00E676]">
        TECNOCAR
      </h2>

      <div className="mt-12 space-y-3 flex-1">

        {items.map((item) => (

          <NavLink
            key={item.name}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-4 w-full p-4 rounded-xl transition-colors ${
                isActive ? "bg-[#00E676] text-black" : "hover:bg-[#20242f]"
              }`
            }
          >
            {item.icon}

            {item.name}

          </NavLink>

        ))}

      </div>

      <button
        onClick={() => {
          logout();
          navigate("/");
        }}
        className="flex items-center gap-4 w-full p-4 rounded-xl hover:bg-[#20242f] text-red-400"
      >
        <LogOut />
        Cerrar sesión
      </button>

    </aside>
  );
}
