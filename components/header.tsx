"use client";
import React from "react";
import SearchInput from "@/components/search-input";

const Header = () => {
  return (
    <header className="flex gap-4 p-2 sticky top-0 bg-background z-50">
      <div className="md:flex hidden ">
      </div>
      <SearchInput />
    </header>
  );
};

export default Header;
