import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="grid xl:grid-cols-4 gap-6 mt-12">

      <button
        onClick={() => navigate("/admin/productos")}
        className="bg-[#00E676] text-black py-5 rounded-xl font-bold"
      >
        Nuevo Producto
      </button>

      <button
        onClick={() => navigate("/admin/reservas")}
        className="bg-[#151922] py-5 rounded-xl"
      >
        Ver Reservas
      </button>

      <button
        onClick={() => navigate("/admin/pedidos")}
        className="bg-[#151922] py-5 rounded-xl"
      >
        Ver Pedidos
      </button>

      <button
        onClick={() => navigate("/admin/usuarios")}
        className="bg-[#151922] py-5 rounded-xl"
      >
        Ver Usuarios
      </button>

    </div>
  );
}
