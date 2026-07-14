import { Car, Users, Wrench, Award } from "lucide-react";
import Reveal from "../common/Reveal";

const stats = [
  {
    icon: <Car size={42} />,
    number: "2500+",
    title: "Vehículos Atendidos",
  },
  {
    icon: <Users size={42} />,
    number: "1800+",
    title: "Clientes",
  },
  {
    icon: <Wrench size={42} />,
    number: "25",
    title: "Servicios",
  },
  {
    icon: <Award size={42} />,
    number: "10",
    title: "Años de Experiencia",
  },
];

export default function Stats() {
  return (
    <section className="bg-[#12161F] py-24">

      <div className="container mx-auto max-w-7xl px-8">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">

          {stats.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <div className="group bg-[#151922] border border-[#2B313C] rounded-[30px] py-10 px-8 text-center transition-all duration-300 hover:border-[#00E676] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#00E676]/5">

                <div className="flex justify-center">
                  <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-[#00E676]/10 text-[#00E676] transition-colors duration-300 group-hover:bg-[#00E676]/20">
                    {item.icon}
                  </div>
                </div>

                <h2 className="text-5xl font-black mt-6">
                  {item.number}
                </h2>

                <p className="text-gray-400 text-lg mt-3">
                  {item.title}
                </p>

              </div>
            </Reveal>
          ))}

        </div>

      </div>

    </section>
  );
}