import { ArrowRight, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="bg-[#090B10] pt-16 pb-24">
      <div className="container mx-auto max-w-7xl px-8">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >

            <span className="uppercase tracking-[8px] text-[#00E676] font-semibold">
              Bienvenido a Tecnocar
            </span>

            <h1 className="text-5xl xl:text-7xl font-black leading-tight mt-6 max-w-xl">
              Tu taller automotriz
              <br />
              de confianza
            </h1>

            <p className="mt-6 text-xl leading-9 text-gray-400 max-w-xl">
              Servicio preventivo, diagnóstico computarizado,
              mantenimiento general y venta de repuestos
              originales para todas las marcas.
            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                to="/productos"
                className="group bg-[#00E676] hover:bg-[#00c853] text-black font-bold px-8 py-4 rounded-xl flex items-center gap-3 transition-all duration-300 shadow-lg shadow-[#00E676]/10 hover:shadow-[#00E676]/30 hover:-translate-y-0.5"
              >
                Comprar
                <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/reservas"
                className="group border border-[#00E676] text-[#00E676] hover:bg-[#00E676] hover:text-black font-bold px-8 py-4 rounded-xl flex items-center gap-3 transition-all duration-300 hover:-translate-y-0.5"
              >
                Reservar
                <CalendarDays size={20} className="transition-transform duration-300 group-hover:scale-110" />
              </Link>

            </div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          >

            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop"
              alt="Tecnocar"
              className="w-full h-[520px] rounded-[32px] object-cover border border-[#29303b]"
            />

          </motion.div>

        </div>

      </div>
    </section>
  );
}