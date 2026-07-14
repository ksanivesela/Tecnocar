import toast from "react-hot-toast";
import api from "../../services/api";
import type { EstadoPedido, Pedido } from "../../types/pedido";

interface Props {
  pedidos: Pedido[];
  onUpdated: () => void;
  titulo?: string;
}

const ESTADOS: EstadoPedido[] = ["PENDIENTE", "CONFIRMADO", "ENVIADO", "COMPLETADO", "CANCELADO"];

export default function RecentOrders({ pedidos, onUpdated, titulo = "Últimos Pedidos" }: Props) {
  const handleChange = async (id: number, estado: string) => {
    try {
      await api.patch(`/pedidos/${id}/estado`, { estado });
      toast.success("Estado actualizado");
      onUpdated();
    } catch {
      toast.error("No se pudo actualizar el estado");
    }
  };

  return (
    <div className="bg-[#151922] rounded-3xl p-8 mt-10">

      <h2 className="text-3xl font-bold mb-8">
        {titulo}
      </h2>

      <div className="space-y-5">

        {pedidos.map((pedido) => (

          <div
            key={pedido.id}
            className="flex flex-wrap justify-between items-center gap-3 border-b border-[#2a313d] pb-4"
          >

            <span className="text-gray-400">#{pedido.id}</span>

            <span>{pedido.nombre}</span>

            <span className="text-[#00E676] font-semibold">${pedido.total.toFixed(2)}</span>

            <select
              value={pedido.estado}
              onChange={(e) => handleChange(pedido.id, e.target.value)}
              className="bg-[#20242f] rounded-lg px-3 py-2"
            >
              {ESTADOS.map((estado) => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>

          </div>

        ))}

      </div>

      {pedidos.length === 0 && <p className="text-gray-500 text-center mt-4">Sin pedidos todavía.</p>}

    </div>
  );
}
