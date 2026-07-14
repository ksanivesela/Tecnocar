import { useEffect, useState } from "react";
import useTitle from "../../hooks/useTitle";

import QuickActions from "../../components/dashboard/QuickActions";
import StatCard from "../../components/dashboard/StatCard";
import RevenueChart from "../../components/dashboard/RevenueChart";
import Inventory from "../../components/dashboard/Inventory";
import Activity from "../../components/dashboard/Activity";
import api from "../../services/api";
import type { Product } from "../../types/product";

interface Stats {
  productos: number;
  reservas: number;
  pedidos: number;
  clientes: number;
}

interface RevenueItem {
  month: string;
  total: number;
}

interface ActivityItem {
  mensaje: string;
  fecha: string;
}

export default function DashboardOverview() {
  useTitle("Dashboard | Tecnocar N&S");

  const [stats, setStats] = useState<Stats | null>(null);
  const [revenue, setRevenue] = useState<RevenueItem[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [inventory, setInventory] = useState<Product[]>([]);

  useEffect(() => {
    api.get<Stats>("/dashboard/stats").then((res) => setStats(res.data));
    api.get<RevenueItem[]>("/dashboard/revenue").then((res) => setRevenue(res.data));
    api.get<ActivityItem[]>("/dashboard/activity").then((res) => setActivity(res.data));
    api.get<Product[]>("/productos/admin").then((res) => {
      const activos = res.data.filter((p) => p.activo);
      setInventory([...activos].sort((a, b) => a.stock - b.stock).slice(0, 5));
    });
  }, []);

  return (
    <div>

      <h1 className="text-5xl font-black">
        Dashboard
      </h1>

      <QuickActions />

      <div className="grid xl:grid-cols-4 gap-8 mt-10">

        <StatCard title="Productos" value={String(stats?.productos ?? "—")} />

        <StatCard title="Reservas" value={String(stats?.reservas ?? "—")} />

        <StatCard title="Pedidos" value={String(stats?.pedidos ?? "—")} />

        <StatCard title="Clientes" value={String(stats?.clientes ?? "—")} />

      </div>

      <div className="grid xl:grid-cols-2 gap-10">

        <RevenueChart data={revenue} />

        <Inventory
          data={inventory.map((p) => ({ id: p.id, nombre: p.nombre, stock: p.stock }))}
        />

      </div>

      <Activity data={activity} />

    </div>
  );
}
