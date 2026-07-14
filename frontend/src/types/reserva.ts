export type EstadoReserva = "PENDIENTE" | "CONFIRMADA" | "CANCELADA" | "FINALIZADA";

export interface Reserva {
  id: number;
  usuarioId: number | null;
  nombre: string;
  email: string;
  telefono: string;
  vehiculo: string;
  placa: string;
  servicio: string;
  fecha: string;
  observacion: string | null;
  estado: EstadoReserva;
  createdAt: string;
}
