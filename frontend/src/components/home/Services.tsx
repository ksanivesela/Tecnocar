import {
  Wrench,
  Gauge,
  CarFront,
  ShieldCheck,
} from "lucide-react";
import Reveal from "../common/Reveal";

const services = [
  {
    icon: <Wrench size={42} />,
    title: "Mecánica General",
    text: "Reparación completa del vehículo.",
  },
  {
    icon: <Gauge size={42} />,
    title: "Diagnóstico",
    text: "Escáner automotriz profesional.",
  },
  {
    icon: <CarFront size={42} />,
    title: "Mantenimiento",
    text: "Cambio de aceite, filtros y revisión.",
  },
  {
    icon: <ShieldCheck size={42} />,
    title: "Garantía",
    text: "Todos nuestros trabajos están garantizados.",
  },
];

export default function Services() {
  return (
    <section className="bg-[#12161F] py-24">

      <div className="container mx-auto max-w-7xl px-8">

        <Reveal className="text-center mb-16">

          <span className="uppercase tracking-[8px] text-[#00E676] font-semibold">
            Servicios
          </span>

          <h2 className="text-5xl xl:text-6xl font-black mt-4">
            Lo que hacemos
          </h2>

        </Reveal>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">

          {services.map((service, i) => (

            <Reveal key={service.title} delay={i * 0.08}>
              <div className="group h-full bg-[#151922] border border-[#2B313C] rounded-[30px] p-8 transition-all duration-300 hover:border-[#00E676] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#00E676]/5">

                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#00E676]/10 text-[#00E676] mb-6 transition-colors duration-300 group-hover:bg-[#00E676]/20">
                  {service.icon}
                </div>

                <h3 className="text-2xl font-bold mb-3">
                  {service.title}
                </h3>

                <p className="text-gray-400 leading-8">
                  {service.text}
                </p>

              </div>
            </Reveal>

          ))}

        </div>

      </div>

    </section>
  );
}