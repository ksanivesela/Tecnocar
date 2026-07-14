import { useEffect, useState } from "react";
import api from "../../services/api";
import type { Product } from "../../types/product";
import ProductCard from "../common/ProductCard";
import Reveal from "../common/Reveal";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api
      .get<Product[]>("/productos/destacados")
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="bg-[#090B10] py-24">

      <div className="container mx-auto max-w-7xl px-8">

        <Reveal className="text-center mb-16">

          <span className="uppercase tracking-[8px] text-[#00E676] font-semibold">
            Catálogo
          </span>

          <h2 className="text-5xl xl:text-6xl font-black mt-4">
            Productos Destacados
          </h2>

          <p className="text-gray-400 text-xl leading-9 max-w-3xl mx-auto mt-6">
            Los productos más vendidos de nuestra mecánica.
            Descubre repuestos originales, accesorios y
            componentes de las mejores marcas.
          </p>

        </Reveal>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">

          {products.map((product, i) => (
            <Reveal key={product.id} delay={i * 0.06}>
              <ProductCard product={product} />
            </Reveal>
          ))}

        </div>

      </div>

    </section>
  );
}
