import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import type { Product } from "../../types/product";

interface Props {
  products: Product[];
  onEdit: (product: Product) => void;
  onDeleted: () => void;
}

export default function ProductTable({ products, onEdit, onDeleted }: Props) {
  const handleDelete = async (product: Product) => {
    if (!confirm(`¿Eliminar "${product.nombre}"? Podrás seguir viéndolo en pedidos anteriores.`)) return;

    try {
      await api.delete(`/productos/${product.id}`);
      toast.success("Producto eliminado");
      onDeleted();
    } catch {
      toast.error("No se pudo eliminar el producto");
    }
  };

  return (
    <div className="bg-[#151922] rounded-3xl p-8 mt-10 overflow-auto">

      <h2 className="text-3xl font-bold mb-8">Productos</h2>

      <table className="w-full">

        <thead>

          <tr className="border-b border-[#2a313d]">

            <th className="text-left py-5">Producto</th>

            <th>Marca</th>

            <th>Categoría</th>

            <th>Precio</th>

            <th>Stock</th>

            <th>Estado</th>

            <th>Acciones</th>

          </tr>

        </thead>

        <tbody>

          {products.map((product) => (

            <tr
              key={product.id}
              className={`border-b border-[#20242f] text-center ${!product.activo ? "opacity-40" : ""}`}
            >

              <td className="py-6 text-left">{product.nombre}</td>

              <td>{product.marca}</td>

              <td>{product.categoria.nombre}</td>

              <td>${product.precio}</td>

              <td>{product.stock}</td>

              <td>{product.activo ? "Activo" : "Inactivo"}</td>

              <td>

                <div className="flex justify-center gap-5">

                  <Pencil
                    size={18}
                    className="cursor-pointer text-yellow-400"
                    onClick={() => onEdit(product)}
                  />

                  {product.activo && (
                    <Trash2
                      size={18}
                      className="cursor-pointer text-red-500"
                      onClick={() => handleDelete(product)}
                    />
                  )}

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {products.length === 0 && <p className="text-gray-500 text-center mt-8">Sin productos todavía.</p>}

    </div>
  );
}
