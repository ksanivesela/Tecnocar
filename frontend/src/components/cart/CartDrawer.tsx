import { useState } from "react";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useCartStore } from "../../store/useCartStore";
import { assetUrl } from "../../utils/constants";
import api from "../../services/api";

interface Props {
  open: boolean;
  onClose: () => void;
}

const checkoutSchema = z.object({
  nombre: z.string().min(2, "Ingresa tu nombre completo"),
  email: z.string().email("Correo no válido"),
  telefono: z.string().min(6, "Teléfono no válido"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CartDrawer({ open, onClose }: Props) {
  const { cart, remove, increase, decrease, total, clear } = useCartStore();
  const [checkingOut, setCheckingOut] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CheckoutForm>({ resolver: zodResolver(checkoutSchema) });

  const cerrar = () => {
    setCheckingOut(false);
    onClose();
  };

  const onSubmit = async (data: CheckoutForm) => {
    setLoading(true);
    try {
      await api.post("/pedidos", {
        ...data,
        items: cart.map((item) => ({ productoId: item.id, cantidad: item.cantidad })),
      });
      toast.success("¡Pedido enviado! Te contactaremos para coordinar el pago y la entrega.");
      clear();
      reset();
      setCheckingOut(false);
      onClose();
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data?.message ?? "No se pudo procesar el pedido")
          : "No se pudo procesar el pedido";
      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside
      className={`fixed top-0 right-0 h-screen w-[420px] bg-[#12161F] border-l border-[#2a313d] z-[999] duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-6 flex justify-between items-center border-b border-[#2a313d]">

        <h2 className="text-2xl font-bold">
          {checkingOut ? "Finalizar compra" : "Carrito"}
        </h2>

        <X
          className="cursor-pointer"
          onClick={cerrar}
        />

      </div>

      {!checkingOut && (
        <>
          <div className="p-6 space-y-6 overflow-auto h-[70vh]">

            {cart.length === 0 && (
              <p className="text-gray-500">
                El carrito está vacío.
              </p>
            )}

            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4"
              >
                <img
                  src={assetUrl(item.imagen)}
                  className="w-24 h-24 rounded-xl object-cover"
                />

                <div className="flex-1">

                  <h3>{item.nombre}</h3>

                  <p className="text-[#00E676] mt-2">
                    ${item.precio}
                  </p>

                  <div className="flex gap-3 mt-3 items-center">

                    <Minus
                      className="cursor-pointer"
                      size={18}
                      onClick={() => decrease(item.id)}
                    />

                    {item.cantidad}

                    <Plus
                      className="cursor-pointer"
                      size={18}
                      onClick={() => increase(item.id)}
                    />

                  </div>

                </div>

                <Trash2
                  className="cursor-pointer text-red-500"
                  onClick={() => remove(item.id)}
                />
              </div>
            ))}

          </div>

          <div className="absolute bottom-0 w-full p-6 border-t border-[#2a313d]">

            <div className="flex justify-between text-2xl font-bold">

              <span>Total</span>

              <span className="text-[#00E676]">
                ${total().toFixed(2)}
              </span>

            </div>

            <button
              disabled={cart.length === 0}
              onClick={() => setCheckingOut(true)}
              className="w-full mt-6 bg-[#00E676] text-black py-4 rounded-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Finalizar Compra
            </button>

          </div>
        </>
      )}

      {checkingOut && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-5"
        >
          <p className="text-gray-400 text-sm">
            Déjanos tus datos y te contactaremos para coordinar el pago y la entrega de tu pedido.
          </p>

          <div>
            <input
              {...register("nombre")}
              placeholder="Nombre completo"
              className="w-full bg-[#20242f] rounded-xl p-4 outline-none"
            />
            {errors.nombre && <p className="text-red-400 text-sm mt-1">{errors.nombre.message}</p>}
          </div>

          <div>
            <input
              {...register("email")}
              placeholder="Correo electrónico"
              className="w-full bg-[#20242f] rounded-xl p-4 outline-none"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <input
              {...register("telefono")}
              placeholder="Teléfono"
              className="w-full bg-[#20242f] rounded-xl p-4 outline-none"
            />
            {errors.telefono && <p className="text-red-400 text-sm mt-1">{errors.telefono.message}</p>}
          </div>

          <div className="flex justify-between text-xl font-bold pt-2">
            <span>Total</span>
            <span className="text-[#00E676]">${total().toFixed(2)}</span>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setCheckingOut(false)}
              className="flex-1 border border-[#2a313d] py-3 rounded-xl font-semibold"
            >
              Volver
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#00E676] text-black py-3 rounded-xl font-bold disabled:opacity-60"
            >
              {loading ? "Enviando..." : "Confirmar pedido"}
            </button>
          </div>
        </form>
      )}
    </aside>
  );
}
