type Props = {
  onSearch: (keyword: string) => void;
};

export default function SearchBar({ onSearch }: Props) {
  return (
    <input
      type="text"
      placeholder="Search Keyword..."
      onChange={(e) => onSearch(e.target.value)}
      className="border p-2 w-full"
    />
  );
}
