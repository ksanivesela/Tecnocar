import { useEffect, useState } from "react";
import useTitle from "../../hooks/useTitle";
import UsuariosTable from "../../components/dashboard/UsuariosTable";
import api from "../../services/api";
import type { Usuario } from "../../types/usuario";

export default function DashboardUsuarios() {
  useTitle("Usuarios | Panel");

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    api.get<Usuario[]>("/usuarios").then((res) => setUsuarios(res.data));
  }, []);

  return (
    <div>

      <h1 className="text-5xl font-black">
        Usuarios
      </h1>

      <UsuariosTable usuarios={usuarios} />

    </div>
  );
}
