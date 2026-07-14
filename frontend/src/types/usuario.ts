export interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string | null;
  rol: "ADMIN" | "CLIENTE";
  createdAt: string;
  _count: {
    pedidos: number;
    reservas: number;
  };
}
