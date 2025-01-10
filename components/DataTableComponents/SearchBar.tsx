import { Search } from "lucide-react";
import React, { useState } from "react";
import { Input } from "../ui/input";

export default function SearchBar({
  data,
  onSearch,
  setIsSearch,
}: {
  data: any[];
  onSearch: any;
  setIsSearch: any;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    const filteredData = data.filter((item: any) =>
      Object.values(item).some(
        (value: any) =>
          value &&
          value.toString().toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
    setIsSearch(true);
    onSearch(filteredData);
  };
  return (
    <div className="w-full">
      <div className="relative clear-start">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="text-zinc-300 w-4 h-4" />
        </div>
        <Input
          id="search"
          name="search"
          type="text"
          autoComplete="search"
          value={searchTerm}
          onChange={handleSearch}
          className="block w-full rounded-md py-1.5 shadow-sm sm:text-sm sm:leading-6 pl-8"
          placeholder="ค้นหา..."
        />
      </div>
    </div>
  );
}
