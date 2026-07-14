import type { Product } from "../../types/product";
import { useCartStore } from "../../store/useCartStore";
import { assetUrl } from "../../utils/constants";

interface Props {
  product: Product;
}

const NUEVO_DIAS = 14;
const STOCK_BAJO = 5;

function getBadge(product: Product): string {
  if (product.destacado) return "Popular";

  const dias = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  if (dias <= NUEVO_DIAS) return "Nuevo";

  if (product.stock > 0 && product.stock < STOCK_BAJO) return "Pocas unidades";

  return product.categoria.nombre;
}

export default function ProductCard({ product }: Props) {
  const { add } = useCartStore();
  const agotado = product.stock <= 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-[#29303b] bg-[#151922] transition-all duration-300 hover:-translate-y-2 hover:border-[#00E676] hover:shadow-xl hover:shadow-[#00E676]/10">

      <div className="overflow-hidden">
        <img
          src={assetUrl(product.imagen)}
          alt={product.nombre}
          className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-8">

        <div className="flex items-center justify-between">

          <span className="rounded-full bg-[#00E67622] px-4 py-2 text-xs font-semibold text-[#00E676]">
            {getBadge(product)}
          </span>

          <span className={`text-sm ${agotado ? "text-red-400" : "text-green-400"}`}>
            {agotado ? "Agotado" : "Disponible"}
          </span>

        </div>

        <h3 className="mt-8 text-2xl font-bold leading-tight">
          {product.nombre}
        </h3>

        <p className="mt-4 text-gray-400">
          Marca: {product.marca}
        </p>

        <p className="mt-3 leading-7 text-gray-500">
          {product.vehiculosCompatibles.join(" • ")}
        </p>

        <div className="mt-auto flex items-center justify-between pt-10">

          <h2 className="text-4xl font-black text-[#00E676]">
            ${product.precio}
          </h2>

          <button
            disabled={agotado}
            onClick={() =>
              add({
                id: product.id,
                nombre: product.nombre,
                precio: product.precio,
                imagen: product.imagen,
              })
            }
            className="rounded-xl border border-[#00E676] px-6 py-3 font-semibold transition-all hover:bg-[#00E676] hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit"
          >
            Agregar
          </button>

        </div>

      </div>

    </div>
  );
}
