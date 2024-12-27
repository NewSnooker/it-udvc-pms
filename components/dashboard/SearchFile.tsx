import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchFile() {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input className="pl-8" placeholder="Search files..." />
    </div>
  );
}
