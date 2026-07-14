import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../common/Reveal";

export default function ContactPreview() {
  return (
    <section className="bg-[#090B10] py-24">

      <div className="container mx-auto max-w-7xl px-8">

        <Reveal>
          <div className="rounded-[36px] border border-[#2B313C] bg-[#151922] px-10 py-16 text-center lg:px-20 transition-colors duration-300 hover:border-[#00E676]/40">

            <span className="uppercase tracking-[8px] text-[#00E676] font-semibold">

              Contáctanos

            </span>

            <h2 className="mt-6 text-5xl xl:text-6xl font-black leading-tight">

              ¿Necesitas ayuda con tu vehículo?

            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-gray-400">

              Agenda una cita, solicita una cotización o recibe asesoría
              personalizada de nuestro equipo técnico.
              Estamos listos para ayudarte.

            </p>

            <div className="mt-10 flex justify-center">

              <Link
                to="/contacto"
                className="group flex items-center gap-3 rounded-xl bg-[#00E676] px-9 py-4 font-bold text-black transition-all duration-300 hover:bg-[#00C853] shadow-lg shadow-[#00E676]/10 hover:shadow-[#00E676]/30 hover:-translate-y-0.5"
              >

                Contactar Ahora

                <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />

              </Link>

            </div>

          </div>
        </Reveal>

      </div>

    </section>
  );
}