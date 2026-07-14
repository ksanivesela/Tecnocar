interface Props {
  onNew: () => void;
}

export default function ProductActions({ onNew }: Props) {
  return (
    <div className="flex justify-end mt-10">

      <button
        onClick={onNew}
        className="bg-[#00E676] text-black px-8 py-4 rounded-xl font-bold"
      >
        Nuevo Producto
      </button>

    </div>
  );
}
