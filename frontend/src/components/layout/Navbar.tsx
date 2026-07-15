import { Menu, ShoppingCart, User, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CartDrawer from "../cart/CartDrawer";
import { useAuthStore } from "../../store/useAuthStore";
import { useCartStore } from "../../store/useCartStore";

export default function Navbar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const cart = useCartStore((state) => state.cart);
  const itemCount = cart.reduce((sum, item) => sum + item.cantidad, 0);
  const [scroll, setScroll] = useState(false);
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative py-2 transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-[#00E676] after:transition-all after:duration-300 ${
      isActive
        ? "text-[#00E676] after:w-full"
        : "text-gray-300 hover:text-[#00E676] after:w-0 hover:after:w-full"
    }`;

  return (
    <>
      <header
        className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 ${
          scroll
            ? "bg-[#090B10]/95 backdrop-blur border-b border-[#20242f]"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto h-20 flex items-center justify-between">

          <NavLink
            to="/"
            className="text-3xl font-black text-[#00E676]"
          >
            TECNOCAR
          </NavLink>

          <nav className="hidden lg:flex gap-8 font-medium">

            <NavLink className={linkClass} to="/">
              Inicio
            </NavLink>

            <NavLink className={linkClass} to="/productos">
              Productos
            </NavLink>

            <NavLink className={linkClass} to="/nosotros">
              Nosotros
            </NavLink>

            <NavLink className={linkClass} to="/reservas">
              Reservas
            </NavLink>

            <NavLink className={linkClass} to="/contacto">
              Contacto
            </NavLink>

          </nav>

          <div className="flex gap-5 items-center">

            <div className="relative">
              <ShoppingCart
                className="cursor-pointer transition-all duration-300 hover:text-[#00E676] hover:scale-110"
                onClick={() => setCartOpen(true)}
              />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#00E676] text-xs font-bold text-black">
                  {itemCount}
                </span>
              )}
            </div>

            <User
              className="cursor-pointer transition-all duration-300 hover:text-[#00E676] hover:scale-110"
              onClick={() => navigate(user?.rol === "ADMIN" ? "/admin" : "/login")}
            />

            <button
              className="lg:hidden"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>

          </div>

        </div>

        {open && (
          <div className="lg:hidden bg-[#090B10] border-t border-[#20242f]">

            <nav className="flex flex-col gap-5 p-6">

              <NavLink to="/" onClick={() => setOpen(false)}>
                Inicio
              </NavLink>

              <NavLink to="/productos" onClick={() => setOpen(false)}>
                Productos
              </NavLink>

              <NavLink to="/nosotros" onClick={() => setOpen(false)}>
                Nosotros
              </NavLink>

              <NavLink to="/reservas" onClick={() => setOpen(false)}>
                Reservas
              </NavLink>

              <NavLink to="/contacto" onClick={() => setOpen(false)}>
                Contacto
              </NavLink>

            </nav>

          </div>
        )}
      </header>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
}