"use client";

import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

interface HeaderProps {
  label: string;
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex items-center justify-center flex-col gap-y-4">
      <h1 className={cn("text-3xl font-semibold", font.className)}>🔒 Auth</h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};

export default Header;
