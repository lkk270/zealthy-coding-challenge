"use client";

import React from "react";
import Link from "next/link";
import { MobileSidebar } from "./mobile-sidebar";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/reusable/logo";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navRoutes } from "@/lib/constants";

export const AfterScrollNavbar = () => {
  const visible = useScrollTop(70);
  const pathname = usePathname();

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 w-full h-12 p-2 sm:py-4 sm:px-5 flex items-center bg-background border-b transition-transform duration-500 ease-in-out ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <Logo size={45} />

      <div className="w-full flex items-center pl-4">
        <div className="ml-auto flex items-center gap-x-4">
          <div className="hidden sm:flex sm:flex-row sm:gap-x-4">
            {navRoutes.map((route, index) => {
              const isActive = pathname === route.href;
              return (
                <Link href={route.href} key={index}>
                  <Button variant="ghost" size="sm">
                    <route.icon
                      strokeWidth={isActive ? 2.5 : 2}
                      className={cn("h-4 w-4", isActive && "text-[#0b08c2]")}
                    />
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
