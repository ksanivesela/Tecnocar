export interface Categoria {
  id: number;
  nombre: string;
}

export interface Product {
  id: number;
  nombre: string;
  marca: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  vehiculosCompatibles: string[];
  destacado: boolean;
  activo: boolean;
  categoriaId: number;
  categoria: Categoria;
  createdAt: string;
  updatedAt: string;
}
