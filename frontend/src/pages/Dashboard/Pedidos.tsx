import { useEffect, useState } from "react";
import useTitle from "../../hooks/useTitle";
import RecentOrders from "../../components/dashboard/RecentOrders";
import api from "../../services/api";
import type { Pedido } from "../../types/pedido";

export default function DashboardPedidos() {
  useTitle("Pedidos | Panel");

  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const fetchPedidos = () => api.get<Pedido[]>("/pedidos").then((res) => setPedidos(res.data));

  useEffect(() => {
    fetchPedidos();
  }, []);

  return (
    <div>

      <h1 className="text-5xl font-black">
        Pedidos
      </h1>

      <RecentOrders
        pedidos={pedidos}
        onUpdated={fetchPedidos}
        titulo="Todos los Pedidos"
      />

    </div>
  );
}
