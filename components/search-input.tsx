"use client";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useSearchParams } from "next/navigation";
import { useSearchApi } from "@/hooks/use-search-api";
import { toast } from "sonner";

const SearchInput = () => {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const { search: performSearch, error: searchError } = useSearchApi();

  useEffect(() => {
    performSearch(search);
  }, [search, performSearch]);

  useEffect(() => {
    if (searchError) {
      toast.error(searchError);
    }
  }, [searchError]);

  return (
    <Input
      placeholder="Search through over 70 million podcasts and episodes..."
      className="text-center border border-border flex-1"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};

export default SearchInput;
