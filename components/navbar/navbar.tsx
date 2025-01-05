"use client";

import Link from "next/link";

import { MobileSidebar } from "./mobile-sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/reusable/logo";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../theme/mode-toggle";
import { navRoutes } from "@/lib/constants";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="h-24 z-50 top-0 flex items-center w-full p-2 sm:py-12 sm:px-5">
      <Logo />

      <div className={cn("w-full flex items-center pl-4")}>
        <div className="ml-auto flex items-center gap-x-4">
          <div className="hidden sm:flex sm:flex-row sm:gap-x-4">
            {navRoutes.map((route, index) => {
              const isActive = pathname === route.href;
              return (
                <Link href={route.href} key={index}>
                  <Button variant="ghost" size="sm">
                    <route.icon strokeWidth={isActive ? 2.5 : 2} className={cn(isActive && "text-[#0b08c2]")} />
                    <span className={cn("text-lg", isActive && "text-[#0b08c2] font-semibold")}>{route.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
          <ModeToggle />
          <MobileSidebar />
        </div>
      </div>
    </div>
  );
};
