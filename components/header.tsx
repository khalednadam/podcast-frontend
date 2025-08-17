"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, EllipsisVertical } from "lucide-react";
import { Input } from "./ui/input";
import { useSearchParams } from "next/navigation";
import { useSearchApi } from "@/hooks/use-search-api";
import DemoDialog from "@/components/demo-dialog";
import { toast } from "sonner";

const Header = () => {
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
    <header className="flex gap-4 p-2 sticky top-0 bg-background z-50">
      <div className="md:flex hidden ">
        <DemoDialog>
          <Button size="icon" variant="ghost">
            <ChevronLeft />
          </Button>
        </DemoDialog>
        <DemoDialog>
          <Button size="icon" variant="ghost">
            <ChevronRight />
          </Button>
        </DemoDialog>
      </div>
      <Input
        placeholder="Search through over 70 million podcasts and episodes..."
        className="text-center border border-border flex-1"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <DemoDialog>
        <Button className="hidden md:block bg-gradient-to-b from-button1 to-button2 text-white !py-[2px] !px-[10px] rounded-md !text-[13px] font-medium">
          Log in
        </Button>
      </DemoDialog>
      <DemoDialog>
        <Button className="hidden md:block bg-gradient-to-b from-button1 to-button2 text-white !py-[2px] !px-[10px] rounded-md !text-[13px] font-medium">
          Sign up
        </Button>
      </DemoDialog>
      <DemoDialog>
        <Button size="icon" variant="ghost">
          <EllipsisVertical />
        </Button>
      </DemoDialog>
    </header>
  );
};

export default Header;
