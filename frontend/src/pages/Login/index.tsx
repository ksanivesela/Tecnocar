import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import useTitle from "../../hooks/useTitle";
import api from "../../services/api";
import { useAuthStore } from "../../store/useAuthStore";

const loginSchema = z.object({
  email: z.string().email("Correo no válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  useTitle("Iniciar Sesión | Tecnocar N&S");

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", data);
      setAuth(res.data.accessToken, res.data.user);
      toast.success(`Bienvenido, ${res.data.user.nombres}`);
      navigate("/admin");
    } catch (error) {
      const message =
        error instanceof AxiosError && error.response?.status === 401
          ? "Correo o contraseña incorrectos"
          : "No se pudo iniciar sesión";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#090B10]">

      <div className="w-full max-w-md bg-[#151922] rounded-3xl p-10 border border-[#29303b]">

        <h1 className="text-4xl font-black text-center">
          Iniciar Sesión
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 mt-10"
        >
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Correo"
              className="w-full bg-[#20242f] p-5 rounded-xl outline-none"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Contraseña"
              className="w-full bg-[#20242f] p-5 rounded-xl outline-none"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00E676] text-black py-4 rounded-xl font-bold disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

        </form>

      </div>

    </section>
  );
}
