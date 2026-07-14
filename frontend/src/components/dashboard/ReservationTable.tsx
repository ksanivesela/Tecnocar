import toast from "react-hot-toast";
import api from "../../services/api";
import type { EstadoReserva, Reserva } from "../../types/reserva";

interface Props {
  reservas: Reserva[];
  onUpdated: () => void;
}

const ESTADOS: EstadoReserva[] = ["PENDIENTE", "CONFIRMADA", "CANCELADA", "FINALIZADA"];

export default function ReservationTable({ reservas, onUpdated }: Props) {
  const handleChange = async (id: number, estado: string) => {
    try {
      await api.patch(`/reservas/${id}/estado`, { estado });
      toast.success("Estado actualizado");
      onUpdated();
    } catch {
      toast.error("No se pudo actualizar el estado");
    }
  };

  return (
    <div className="bg-[#151922] rounded-3xl p-8 mt-10 overflow-auto">

      <h2 className="text-3xl font-bold mb-8">
        Reservas
      </h2>

      <table className="w-full">

        <thead>

          <tr className="border-b border-[#2a313d]">

            <th className="text-left py-4">Cliente</th>

            <th>Vehículo</th>

            <th>Servicio</th>

            <th>Fecha</th>

            <th>Contacto</th>

            <th>Estado</th>

          </tr>

        </thead>

        <tbody>

          {reservas.map((item) => (

            <tr
              key={item.id}
              className="border-b border-[#20242f] text-center"
            >

              <td className="py-5 text-left">{item.nombre}</td>

              <td>{item.vehiculo} ({item.placa})</td>

              <td>{item.servicio}</td>

              <td>{new Date(item.fecha).toLocaleDateString("es-EC")}</td>

              <td className="text-sm text-gray-400">
                {item.email}<br />{item.telefono}
              </td>

              <td>
                <select
                  value={item.estado}
                  onChange={(e) => handleChange(item.id, e.target.value)}
                  className="bg-[#20242f] rounded-lg px-3 py-2"
                >
                  {ESTADOS.map((estado) => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {reservas.length === 0 && <p className="text-gray-500 text-center mt-8">Sin reservas todavía.</p>}

    </div>
  );
}
