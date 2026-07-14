import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import useTitle from "../../hooks/useTitle";
import api from "../../services/api";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

const contactoSchema = z.object({
  nombre: z.string().min(2, "Ingresa tu nombre"),
  email: z.string().email("Correo no válido"),
  telefono: z.string().optional(),
  mensaje: z.string().min(5, "Escribe tu mensaje"),
});

type ContactoForm = z.infer<typeof contactoSchema>;

export default function Contact() {

  useTitle("Contacto | Tecnocar N&S");

  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactoForm>({ resolver: zodResolver(contactoSchema) });

  const onSubmit = async (data: ContactoForm) => {
    setLoading(true);
    try {
      await api.post("/contacto", data);
      toast.success("¡Mensaje enviado! Te responderemos pronto.");
      reset();
    } catch {
      toast.error("No se pudo enviar el mensaje");
    } finally {
      setLoading(false);
    }
  };

  return (

    <section className="py-20">

      <div className="container mx-auto px-6">

        <div className="text-center mb-14">

          <span className="text-[#00E676] uppercase tracking-[8px]">

            Contacto

          </span>

          <h1 className="text-5xl md:text-6xl font-black mt-5">

            Estamos para ayudarte

          </h1>

          <p className="text-gray-400 mt-6 max-w-3xl mx-auto">

            Ponte en contacto con nosotros para cotizaciones,
            compras o consultas.

          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-[#151922] rounded-3xl border border-[#2B313C] p-10 space-y-5"
          >

            <div>
              <input
                {...register("nombre")}
                placeholder="Nombre"
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
            </div>

            <div>
              <textarea
                {...register("mensaje")}
                rows={6}
                placeholder="Mensaje"
                className="bg-[#20242f] rounded-xl p-4 outline-none w-full"
              />
              {errors.mensaje && <p className="text-red-400 text-sm mt-1">{errors.mensaje.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#00E676] hover:bg-[#00C853] text-black px-8 py-4 rounded-xl font-bold disabled:opacity-60"
            >
              {loading ? "Enviando..." : "Enviar Mensaje"}
            </button>

          </form>

          <div className="bg-[#151922] rounded-3xl border border-[#2B313C] p-10">

            <h2 className="text-3xl font-bold">

              Información

            </h2>

            <div className="space-y-8 mt-10">

              <div className="flex items-center gap-4">

                <MapPin className="text-[#00E676]" />

                <span>Quito - Ecuador</span>

              </div>

              <div className="flex items-center gap-4">

                <Phone className="text-[#00E676]" />

                <span>+593 99 999 9999</span>

              </div>

              <div className="flex items-center gap-4">

                <Mail className="text-[#00E676]" />

                <span>info@tecnocar.com</span>

              </div>

              <div className="flex items-center gap-4">

                <Clock className="text-[#00E676]" />

                <span>Lunes a Sábado · 08:00 - 18:00</span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>

  );

}
