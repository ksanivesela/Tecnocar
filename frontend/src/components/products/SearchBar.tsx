import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: Props) {
  return (
    <div className="relative">

      <Search
        className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
      />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por nombre o marca..."
        className="w-full bg-[#161B22] rounded-2xl pl-14 pr-6 py-5 border border-[#2B313C] outline-none"
      />

    </div>
  );
}