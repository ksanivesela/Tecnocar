import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import api from "../../../services/api";
import { assetUrl } from "../../../utils/constants";
import type { Categoria, Product } from "../../../types/product";

interface Props {
  producto?: Product | null;
  categorias: Categoria[];
  onClose: () => void;
  onSaved: () => void;
}

const numeroValido = (min: number) => (value: string) => !isNaN(Number(value)) && Number(value) >= min;

const schema = z.object({
  nombre: z.string().min(2, "Ingresa el nombre"),
  marca: z.string().min(1, "Ingresa la marca"),
  descripcion: z.string().min(2, "Ingresa la descripción"),
  precio: z.string().refine(numeroValido(0), "Precio inválido"),
  stock: z.string().refine(numeroValido(0), "Stock inválido"),
  categoriaId: z.string().min(1, "Selecciona una categoría"),
  vehiculosCompatibles: z.string().optional(),
  destacado: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

function defaultValues(producto: Product | null | undefined, categorias: Categoria[]): FormValues {
  if (producto) {
    return {
      nombre: producto.nombre,
      marca: producto.marca,
      descripcion: producto.descripcion,
      precio: String(producto.precio),
      stock: String(producto.stock),
      categoriaId: String(producto.categoriaId),
      vehiculosCompatibles: producto.vehiculosCompatibles.join(", "),
      destacado: producto.destacado,
    };
  }

  return {
    nombre: "",
    marca: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoriaId: categorias[0] ? String(categorias[0].id) : "",
    vehiculosCompatibles: "",
    destacado: false,
  };
}

export default function ProductModal({ producto, categorias, onClose, onSaved }: Props) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues(producto, categorias),
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("nombre", data.nombre);
      formData.append("marca", data.marca);
      formData.append("descripcion", data.descripcion);
      formData.append("precio", data.precio);
      formData.append("stock", data.stock);
      formData.append("categoriaId", data.categoriaId);
      formData.append("vehiculosCompatibles", data.vehiculosCompatibles ?? "");
      formData.append("destacado", String(data.destacado ?? false));
      if (imageFile) formData.append("imagen", imageFile);

      if (producto) {
        await api.patch(`/productos/${producto.id}`, formData);
      } else {
        await api.post("/productos", formData);
      }

      toast.success(producto ? "Producto actualizado" : "Producto creado");
      onSaved();
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data?.message ?? "No se pudo guardar el producto")
          : "No se pudo guardar el producto";
      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
      <div className="bg-[#151922] rounded-3xl w-full max-w-2xl p-10 max-h-[90vh] overflow-auto">

        <h2 className="text-3xl font-bold mb-8">
          {producto ? "Editar Producto" : "Nuevo Producto"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="grid grid-cols-2 gap-5">

            <div>
              <input placeholder="Nombre" className="bg-[#20242f] rounded-xl p-4 w-full" {...register("nombre")} />
              {errors.nombre && <p className="text-red-400 text-sm mt-1">{errors.nombre.message}</p>}
            </div>

            <div>
              <input placeholder="Marca" className="bg-[#20242f] rounded-xl p-4 w-full" {...register("marca")} />
              {errors.marca && <p className="text-red-400 text-sm mt-1">{errors.marca.message}</p>}
            </div>

            <div>
              <input
                type="number"
                step="0.01"
                placeholder="Precio"
                className="bg-[#20242f] rounded-xl p-4 w-full"
                {...register("precio")}
              />
              {errors.precio && <p className="text-red-400 text-sm mt-1">{errors.precio.message}</p>}
            </div>

            <div>
              <input
                type="number"
                placeholder="Stock"
                className="bg-[#20242f] rounded-xl p-4 w-full"
                {...register("stock")}
              />
              {errors.stock && <p className="text-red-400 text-sm mt-1">{errors.stock.message}</p>}
            </div>

            <div>
              <select className="bg-[#20242f] rounded-xl p-4 w-full" {...register("categoriaId")}>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              {errors.categoriaId && <p className="text-red-400 text-sm mt-1">{errors.categoriaId.message}</p>}
            </div>

            <div>
              <input
                placeholder="Vehículos compatibles (separados por coma)"
                className="bg-[#20242f] rounded-xl p-4 w-full"
                {...register("vehiculosCompatibles")}
              />
            </div>

          </div>

          <textarea
            rows={5}
            placeholder="Descripción"
            className="bg-[#20242f] rounded-xl p-4 w-full mt-5"
            {...register("descripcion")}
          />
          {errors.descripcion && <p className="text-red-400 text-sm mt-1">{errors.descripcion.message}</p>}

          <div className="flex items-center gap-4 mt-5">
            {producto?.imagen && !imageFile && (
              <img
                src={assetUrl(producto.imagen)}
                className="w-16 h-16 rounded-xl object-cover"
              />
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="text-sm text-gray-400"
            />
          </div>

          <label className="flex items-center gap-3 mt-5 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5"
              {...register("destacado")}
            />
            Producto destacado (aparece en la portada)
          </label>

          <div className="flex justify-end gap-5 mt-8">

            <button
              type="button"
              onClick={onClose}
              className="bg-gray-700 px-8 py-3 rounded-xl"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#00E676] text-black px-8 py-3 rounded-xl font-bold disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
