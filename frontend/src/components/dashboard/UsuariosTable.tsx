import type { Usuario } from "../../types/usuario";

interface Props {
  usuarios: Usuario[];
}

export default function UsuariosTable({ usuarios }: Props) {
  return (
    <div className="bg-[#151922] rounded-3xl p-8 mt-10 overflow-auto">

      <h2 className="text-3xl font-bold mb-8">
        Usuarios
      </h2>

      <table className="w-full">

        <thead>

          <tr className="border-b border-[#2a313d]">

            <th className="text-left py-4">Nombre</th>

            <th>Correo</th>

            <th>Teléfono</th>

            <th>Rol</th>

            <th>Pedidos</th>

            <th>Reservas</th>

            <th>Registrado</th>

          </tr>

        </thead>

        <tbody>

          {usuarios.map((usuario) => (

            <tr
              key={usuario.id}
              className="border-b border-[#20242f] text-center"
            >

              <td className="py-5 text-left">{usuario.nombres} {usuario.apellidos}</td>

              <td>{usuario.email}</td>

              <td>{usuario.telefono ?? "—"}</td>

              <td>
                <span className="bg-[#00E67622] text-[#00E676] px-4 py-1 rounded-full text-sm">
                  {usuario.rol}
                </span>
              </td>

              <td>{usuario._count.pedidos}</td>

              <td>{usuario._count.reservas}</td>

              <td>{new Date(usuario.createdAt).toLocaleDateString("es-EC")}</td>

            </tr>

          ))}

        </tbody>

      </table>

      {usuarios.length === 0 && <p className="text-gray-500 text-center mt-8">Sin usuarios todavía.</p>}

    </div>
  );
}
