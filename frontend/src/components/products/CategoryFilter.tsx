interface Props {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: Props) {
  const options = ["Todos", ...categories];

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {options.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`px-7 py-3 rounded-full duration-300
${
  selected === category
    ? "bg-[#00E676] text-black"
    : "bg-[#1A202C] text-white"
}
`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
