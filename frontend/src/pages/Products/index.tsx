import { useEffect, useMemo, useState } from "react";
import useTitle from "../../hooks/useTitle";

import api from "../../services/api";
import type { Product } from "../../types/product";

import ProductBanner from "../../components/products/ProductBanner";
import SearchBar from "../../components/products/SearchBar";
import CategoryFilter from "../../components/products/CategoryFilter";
import ProductGrid from "../../components/products/ProductGrid";

export default function Products() {
  useTitle("Productos | Tecnocar N&S");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [products, setProducts] = useState<Product[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get<Product[]>("/productos"), api.get<{ nombre: string }[]>("/categorias")])
      .then(([productosRes, categoriasRes]) => {
        setProducts(productosRes.data);
        setCategorias(categoriasRes.data.map((c) => c.nombre));
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch =
        product.nombre.toLowerCase().includes(search.toLowerCase()) ||
        product.marca.toLowerCase().includes(search.toLowerCase());

      const matchCategory = category === "Todos" || product.categoria.nombre === category;

      return matchSearch && matchCategory;
    });
  }, [products, search, category]);

  return (
    <>
      <ProductBanner />

      <section className="py-20">

        <div className="container mx-auto px-6">

          <div className="max-w-5xl mx-auto">

            <SearchBar
              value={search}
              onChange={setSearch}
            />

          </div>

          <div className="flex justify-center mt-10">

            <CategoryFilter
              categories={categorias}
              selected={category}
              onSelect={setCategory}
            />

          </div>

          <div className="mt-16">

            {loading && (
              <p className="text-center text-gray-500">Cargando productos...</p>
            )}

            {!loading && filteredProducts.length === 0 && (
              <p className="text-center text-gray-500">
                No se encontraron productos con esos filtros.
              </p>
            )}

            {!loading && filteredProducts.length > 0 && (
              <ProductGrid products={filteredProducts} />
            )}

          </div>

        </div>

      </section>
    </>
  );
}
