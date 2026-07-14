export type EstadoPedido = "PENDIENTE" | "CONFIRMADO" | "ENVIADO" | "COMPLETADO" | "CANCELADO";

export interface DetallePedido {
  id: number;
  productoId: number;
  cantidad: number;
  precio: number;
  producto: {
    id: number;
    nombre: string;
    imagen: string;
  };
}

export interface Pedido {
  id: number;
  usuarioId: number | null;
  nombre: string;
  email: string;
  telefono: string;
  total: number;
  estado: EstadoPedido;
  createdAt: string;
  detalles: DetallePedido[];
}
