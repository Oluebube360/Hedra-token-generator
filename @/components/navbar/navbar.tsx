"use client";

import React, { useState, useEffect } from "react";
import ActionButtons from "@/components/navbar/_component/action-buttons";
import Logo from "@/components/navbar/_component/logo";
import { Menu } from "@/components/navbar/_component/menu";

const Navbar = () => {
  const navbarClasses = `
    flex items-center justify-between space-x-10 bg-white  h-14
    sticky top-0 z-50 border-b border-gray-200
  `;

  return (
    <div className={navbarClasses}>
      <div className="flex items-center justify-center">
        <Logo />
        <Menu />
      </div>
      <ActionButtons />
    </div>
  );
};

export default Navbar;