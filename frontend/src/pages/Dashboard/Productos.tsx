import { useEffect, useState } from "react";
import useTitle from "../../hooks/useTitle";
import ProductActions from "../../components/dashboard/ProductActions";
import ProductTable from "../../components/dashboard/ProductTable";
import ProductModal from "../../components/dashboard/modals/ProductModal";
import api from "../../services/api";
import type { Categoria, Product } from "../../types/product";

export default function DashboardProductos() {
  useTitle("Productos | Panel");

  const [products, setProducts] = useState<Product[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const fetchProducts = () => api.get<Product[]>("/productos/admin").then((res) => setProducts(res.data));
  const fetchCategorias = () => api.get<Categoria[]>("/categorias").then((res) => setCategorias(res.data));

  useEffect(() => {
    fetchProducts();
    fetchCategorias();
  }, []);

  return (
    <div>

      <h1 className="text-5xl font-black">
        Productos
      </h1>

      <ProductActions
        onNew={() => {
          setEditing(null);
          setModalOpen(true);
        }}
      />

      <ProductTable
        products={products}
        onEdit={(product) => {
          setEditing(product);
          setModalOpen(true);
        }}
        onDeleted={fetchProducts}
      />

      {modalOpen && (
        <ProductModal
          key={editing?.id ?? "new"}
          producto={editing}
          categorias={categorias}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            fetchProducts();
          }}
        />
      )}

    </div>
  );
}
