import { ArrowRight } from "lucide-react";
import Reveal from "../common/Reveal";

export default function AboutPreview() {
  return (
    <section className="bg-[#12161F] py-24">

      <div className="container mx-auto max-w-7xl px-8">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <Reveal y={32}>

            <img
              src="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=1600&auto=format&fit=crop"
              alt="Tecnocar"
              className="w-full h-[480px] object-cover rounded-[32px] border border-[#2B313C]"
            />

          </Reveal>

          <Reveal y={32} delay={0.1} className="max-w-xl">

            <span className="uppercase tracking-[8px] text-[#00E676] font-semibold">

              Nosotros

            </span>

            <h2 className="text-5xl xl:text-6xl font-black mt-6 leading-tight">

              Más de 10 años
              <br />
              cuidando vehículos

            </h2>

            <p className="text-gray-400 text-xl leading-9 mt-6">

              Tecnocar N&S brinda servicios de mecánica
              automotriz, mantenimiento preventivo,
              venta de repuestos, lubricantes,
              diagnóstico computarizado y asesoría
              especializada para vehículos livianos
              y pesados.

            </p>

            <button className="group mt-10 bg-[#00E676] hover:bg-[#00c853] transition-all duration-300 text-black px-9 py-4 rounded-xl font-bold flex items-center gap-3 shadow-lg shadow-[#00E676]/10 hover:shadow-[#00E676]/30 hover:-translate-y-0.5">

              Conócenos
              <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />

            </button>

          </Reveal>

        </div>

      </div>

    </section>
  );
}