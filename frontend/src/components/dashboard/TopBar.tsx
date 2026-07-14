import { useAuthStore } from "../../store/useAuthStore";

export default function TopBar() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex justify-between items-center mb-10">

      <div>
        <h1 className="text-2xl font-bold">
          Hola, {user?.nombres}
        </h1>
        <p className="text-gray-500 text-sm">Panel de administración de Tecnocar N&S</p>
      </div>

      <span className="bg-[#00E67622] text-[#00E676] px-4 py-2 rounded-full text-sm font-semibold">
        {user?.rol}
      </span>

    </div>
  );
}
