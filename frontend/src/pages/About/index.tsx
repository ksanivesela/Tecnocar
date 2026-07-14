import useTitle from "../../hooks/useTitle";
import { Award, ShieldCheck, Wrench, Users } from "lucide-react";

const cards = [
  {
    icon: <Award size={40} />,
    title: "Calidad Garantizada",
    text: "Trabajamos únicamente con repuestos certificados y herramientas profesionales.",
  },
  {
    icon: <ShieldCheck size={40} />,
    title: "Garantía",
    text: "Todos nuestros servicios cuentan con garantía para brindar mayor tranquilidad.",
  },
  {
    icon: <Wrench size={40} />,
    title: "Personal Técnico",
    text: "Nuestro equipo está capacitado en diagnóstico y reparación automotriz.",
  },
  {
    icon: <Users size={40} />,
    title: "Clientes Satisfechos",
    text: "Más de 1800 clientes confían en Tecnocar N&S.",
  },
];

export default function About() {
  useTitle("Nosotros | Tecnocar N&S");

  return (
    <>
      <section className="py-20">

        <div className="container mx-auto px-6">

          <div className="text-center max-w-3xl mx-auto">

            <span className="text-[#00E676] uppercase tracking-[8px]">
              Sobre Nosotros
            </span>

            <h1 className="text-5xl md:text-6xl font-black mt-5">
              Tecnocar N&S
            </h1>

            <p className="text-gray-400 mt-8 text-lg leading-8">
              Somos un taller especializado en mantenimiento preventivo,
              mecánica general, diagnóstico computarizado y venta de
              repuestos para vehículos livianos y pesados.
            </p>

          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mt-20">

            <img
              src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1800&auto=format&fit=crop"
              className="w-full h-[500px] rounded-3xl object-cover"
            />

            <div>

              <h2 className="text-4xl font-black">
                Nuestra Historia
              </h2>

              <p className="text-gray-400 mt-8 leading-8">
                Durante más de diez años hemos brindado soluciones
                automotrices a cientos de clientes ofreciendo rapidez,
                confianza y calidad.
              </p>

              <p className="text-gray-400 mt-6 leading-8">
                Nuestro compromiso es mantener cada vehículo en óptimas
                condiciones utilizando tecnología moderna y personal
                altamente capacitado.
              </p>

            </div>

          </div>

        </div>

      </section>

      <section className="py-20 bg-[#12161F]">

        <div className="container mx-auto px-6">

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">

            {cards.map((card) => (

              <div
                key={card.title}
                className="bg-[#1A202C] rounded-3xl border border-[#29303b] p-8 hover:border-[#00E676] duration-300"
              >

                <div className="text-[#00E676]">

                  {card.icon}

                </div>

                <h3 className="text-2xl font-bold mt-6">

                  {card.title}

                </h3>

                <p className="text-gray-400 mt-5 leading-7">

                  {card.text}

                </p>

              </div>

            ))}

          </div>

        </div>

      </section>
    </>
  );
}