import { useEffect, useState } from "react";
import useTitle from "../../hooks/useTitle";
import ReservationTable from "../../components/dashboard/ReservationTable";
import api from "../../services/api";
import type { Reserva } from "../../types/reserva";

export default function DashboardReservas() {
  useTitle("Reservas | Panel");

  const [reservas, setReservas] = useState<Reserva[]>([]);

  const fetchReservas = () => api.get<Reserva[]>("/reservas").then((res) => setReservas(res.data));

  useEffect(() => {
    fetchReservas();
  }, []);

  return (
    <div>

      <h1 className="text-5xl font-black">
        Reservas
      </h1>

      <ReservationTable
        reservas={reservas}
        onUpdated={fetchReservas}
      />

    </div>
  );
}
