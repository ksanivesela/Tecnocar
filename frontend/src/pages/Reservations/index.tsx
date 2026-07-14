import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import useTitle from "../../hooks/useTitle";
import api from "../../services/api";

const reservaSchema = z.object({
  nombre: z.string().min(2, "Ingresa tu nombre completo"),
  email: z.string().email("Correo no válido"),
  telefono: z.string().min(6, "Teléfono no válido"),
  vehiculo: z.string().min(2, "Ingresa el vehículo"),
  placa: z.string().min(3, "Ingresa la placa"),
  fecha: z.string().min(1, "Selecciona una fecha"),
  servicio: z.string().min(2, "Describe el servicio requerido"),
  observacion: z.string().optional(),
});

type ReservaForm = z.infer<typeof reservaSchema>;

export default function Reservations() {
  useTitle("Reservas | Tecnocar N&S");

  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReservaForm>({ resolver: zodResolver(reservaSchema) });

  const onSubmit = async (data: ReservaForm) => {
    setLoading(true);
    try {
      await api.post("/reservas", data);
      toast.success("¡Reserva enviada! Te contactaremos para confirmar tu cita.");
      reset();
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data?.message ?? "No se pudo enviar la reserva")
          : "No se pudo enviar la reserva";
      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setLoading(false);
    }
  };

  return (

    <section className="py-20">

      <div className="container mx-auto max-w-5xl px-6">

        <div className="text-center mb-14">

          <span className="text-[#00E676] uppercase tracking-[8px]">

            Agenda tu cita

          </span>

          <h1 className="text-5xl md:text-6xl font-black mt-5">

            Reserva un Servicio

          </h1>

          <p className="text-gray-400 mt-6 max-w-3xl mx-auto">

            Agenda el mantenimiento de tu vehículo en pocos minutos.

          </p>

        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-[#151922] border border-[#2B313C] rounded-3xl p-10"
        >

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <input
                {...register("nombre")}
                placeholder="Nombre completo"
                className="bg-[#20242f] rounded-xl p-4 outline-none w-full"
              />
              {errors.nombre && <p className="text-red-400 text-sm mt-1">{errors.nombre.message}</p>}
            </div>

            <div>
              <input
                {...register("email")}
                placeholder="Correo electrónico"
                className="bg-[#20242f] rounded-xl p-4 outline-none w-full"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <input
                {...register("telefono")}
                placeholder="Teléfono"
                className="bg-[#20242f] rounded-xl p-4 outline-none w-full"
              />
              {errors.telefono && <p className="text-red-400 text-sm mt-1">{errors.telefono.message}</p>}
            </div>

            <div>
              <input
                {...register("vehiculo")}
                placeholder="Vehículo"
                className="bg-[#20242f] rounded-xl p-4 outline-none w-full"
              />
              {errors.vehiculo && <p className="text-red-400 text-sm mt-1">{errors.vehiculo.message}</p>}
            </div>

            <div>
              <input
                {...register("placa")}
                placeholder="Placa"
                className="bg-[#20242f] rounded-xl p-4 outline-none w-full"
              />
              {errors.placa && <p className="text-red-400 text-sm mt-1">{errors.placa.message}</p>}
            </div>

            <div>
              <input
                {...register("fecha")}
                type="date"
                className="bg-[#20242f] rounded-xl p-4 outline-none w-full"
              />
              {errors.fecha && <p className="text-red-400 text-sm mt-1">{errors.fecha.message}</p>}
            </div>

          </div>

          <div className="mt-6">
            <input
              {...register("servicio")}
              placeholder="Servicio requerido (ej. Cambio de aceite, revisión de frenos...)"
              className="bg-[#20242f] rounded-xl p-4 outline-none w-full"
            />
            {errors.servicio && <p className="text-red-400 text-sm mt-1">{errors.servicio.message}</p>}
          </div>

          <textarea
            {...register("observacion")}
            rows={6}
            placeholder="Describe el problema o servicio requerido..."
            className="bg-[#20242f] rounded-xl p-4 outline-none w-full mt-6"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-8 bg-[#00E676] hover:bg-[#00C853] text-black font-bold px-8 py-4 rounded-xl disabled:opacity-60"
          >
            {loading ? "Enviando..." : "Confirmar Reserva"}
          </button>

        </form>

      </div>

    </section>

  );

}
