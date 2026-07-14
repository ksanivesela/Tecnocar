import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const links = [
  { label: "Inicio", to: "/" },
  { label: "Productos", to: "/productos" },
  { label: "Nosotros", to: "/nosotros" },
  { label: "Reservas", to: "/reservas" },
  { label: "Contacto", to: "/contacto" },
];

export default function Footer() {
  return (
    <footer className="bg-[#090B10] border-t border-[#222935] pt-16 pb-10">

      <div className="container grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">

        <div>

          <h2 className="text-3xl font-black text-[#00E676]">
            TECNOCAR N&S
          </h2>

          <p className="text-gray-400 mt-4 max-w-sm leading-7">
            Especialistas en mecánica automotriz,
            mantenimiento y venta de repuestos originales.
          </p>

        </div>

        <div>

          <h3 className="font-bold mb-5">
            Navegación
          </h3>

          <nav className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-400 transition-colors hover:text-[#00E676]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

        </div>

        <div>

          <h3 className="font-bold mb-5">
            Contacto
          </h3>

          <div className="flex flex-col gap-3">

            <p className="flex items-center gap-3 text-gray-400">
              <MapPin size={18} className="shrink-0 text-[#00E676]" />
              Quito - Ecuador
            </p>

            <p className="flex items-center gap-3 text-gray-400">
              <Phone size={18} className="shrink-0 text-[#00E676]" />
              +593 99 999 9999
            </p>

            <p className="flex items-center gap-3 text-gray-400">
              <Mail size={18} className="shrink-0 text-[#00E676]" />
              info@tecnocar.com
            </p>

          </div>

        </div>

      </div>

      <div className="container mt-12 pt-6 border-t border-[#1c212b] text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Tecnocar N&S. Todos los derechos reservados.
      </div>

    </footer>
  );
}