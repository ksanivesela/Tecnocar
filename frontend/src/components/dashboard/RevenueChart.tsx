interface RevenueItem {
  month: string;
  total: number;
}

interface Props {
  data: RevenueItem[];
}

export default function RevenueChart({ data }: Props) {
  const max = Math.max(1, ...data.map((m) => m.total));

  return (
    <div className="bg-[#151922] rounded-3xl p-8 mt-10">
      <h2 className="text-3xl font-bold mb-10">
        Ventas Mensuales
      </h2>

      {data.length === 0 && <p className="text-gray-500">Sin datos todavía.</p>}

      <div className="flex items-end justify-between h-72 gap-5">

        {data.map((item) => (

          <div
            key={item.month}
            className="flex flex-col items-center flex-1"
          >

            <span className="text-gray-400 text-sm mb-2">${item.total.toFixed(0)}</span>

            <div
              className="w-full bg-[#00E676] rounded-t-xl duration-500 hover:opacity-80"
              style={{
                height: `${(item.total / max) * 220}px`,
              }}
            />

            <span className="mt-4 text-gray-400">
              {item.month}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}
