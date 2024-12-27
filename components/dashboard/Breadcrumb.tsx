import { ChevronRight, Home, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BreadcrumbProps {
  path: { id: string; name: string }[];
  onNavigate: (folder: { id: string | null; name: string | null }) => void;
}

export function Breadcrumb({ path, onNavigate }: BreadcrumbProps) {
  const visiblePath = path.slice(-2);
  const hiddenPath = path.slice(0, -2);

  return (
    <div className="flex items-center space-x-2" aria-label="Breadcrumb">
      {/* Mobile View (Default) */}
      <div className="flex sm:hidden items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate({ id: null, name: null })}
          aria-label="Go to home"
        >
          <Home className="h-4 w-4" />
        </Button>

        {path.length > 0 && (
          <>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="truncate max-w-[150px]"
                >
                  <span className="truncate">{path[path.length - 1].name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {path.map((part) => (
                  <DropdownMenuItem
                    key={part.id}
                    onClick={() => onNavigate(part)}
                  >
                    {part.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>

      {/* Desktop View (sm breakpoint and above) */}
      <div className="hidden sm:flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate({ id: null, name: null })}
          aria-label="Go to home"
        >
          <Home className="h-4 w-4" />
        </Button>

        {/* Hidden paths dropdown */}
        {hiddenPath.length > 0 && (
          <>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {hiddenPath.map((part) => (
                  <DropdownMenuItem
                    key={part.id}
                    onClick={() => onNavigate(part)}
                  >
                    {part.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}

        {/* Visible paths */}
        {visiblePath.map((part) => (
          <div key={part.id} className="flex items-center min-w-0">
            <ChevronRight className="h-4 w-4 mx-2 shrink-0 text-muted-foreground" />
            <Button
              variant="ghost"
              onClick={() => onNavigate(part)}
              aria-label={`Go to ${part.name}`}
              size="sm"
              className="truncate"
            >
              <span className="truncate">{part.name}</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
