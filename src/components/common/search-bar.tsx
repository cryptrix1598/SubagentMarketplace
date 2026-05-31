"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBar({
  initialQuery = "",
  placeholder = "Search agents, users, collections...",
  onSearch,
  className = "",
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);

  const handleSearch = useCallback(
    (searchQuery: string) => {
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        if (searchQuery.trim()) {
          router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
          router.push("/explore");
        }
      }
    },
    [onSearch, router],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    handleSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="h-11 pl-10 pr-10"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
}