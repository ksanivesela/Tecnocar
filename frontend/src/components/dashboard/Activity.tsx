interface ActivityItem {
  mensaje: string;
  fecha: string;
}

interface Props {
  data: ActivityItem[];
}

export default function Activity({ data }: Props) {
  return (
    <div className="bg-[#151922] rounded-3xl p-8 mt-10">

      <h2 className="text-3xl font-bold mb-8">
        Actividad Reciente
      </h2>

      {data.length === 0 && <p className="text-gray-500">Sin actividad todavía.</p>}

      <div className="space-y-5">

        {data.map((item, index) => (

          <div
            key={index}
            className="flex gap-4 items-center"
          >

            <div className="w-3 h-3 rounded-full bg-[#00E676] shrink-0" />

            <span className="text-gray-300">
              {item.mensaje}
            </span>

            <span className="text-gray-600 text-xs ml-auto shrink-0">
              {new Date(item.fecha).toLocaleString("es-EC", { dateStyle: "short", timeStyle: "short" })}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}
