"use client";
import React from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, EllipsisVertical } from "lucide-react";
import DemoDialog from "@/components/demo-dialog";
import SearchInput from "@/components/search-input";

const Header = () => {
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
      <SearchInput />
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
