interface InventoryItem {
  id: number;
  nombre: string;
  stock: number;
}

interface Props {
  data: InventoryItem[];
}

export default function Inventory({ data }: Props) {
  const max = Math.max(1, ...data.map((item) => item.stock));

  return (
    <div className="bg-[#151922] rounded-3xl p-8 mt-10">

      <h2 className="text-3xl font-bold mb-8">
        Inventario más bajo
      </h2>

      {data.length === 0 && <p className="text-gray-500">Sin productos todavía.</p>}

      <div className="space-y-6">

        {data.map((item) => (

          <div key={item.id}>

            <div className="flex justify-between">

              <span>{item.nombre}</span>

              <span>{item.stock} u.</span>

            </div>

            <div className="bg-[#222935] h-3 rounded-full mt-3">

              <div
                className="bg-[#00E676] h-3 rounded-full"
                style={{
                  width: `${(item.stock / max) * 100}%`,
                }}
              />

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
