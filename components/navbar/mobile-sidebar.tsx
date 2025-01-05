"use client";

import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { navRoutes } from "@/lib/constants";

export const MobileSidebar = () => {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger className="sm:hidden flex">
        <Menu />
      </SheetTrigger>
      <SheetContent side="right" className="w-60 p-0 pt-10 flex-col flex items-center gap-y-6">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        {navRoutes.map((route, index) => {
          const isActive = pathname === route.href;
          return (
            <SheetClose key={index} asChild>
              <Link href={route.href}>
                <Button variant="ghost" size="sm">
                  <route.icon className="h-4 w-4" strokeWidth={isActive ? 2.5 : 2} />
                  <span className={cn("text-lg", isActive && "text-[#0b08c2] font-semibold")}>{route.label}</span>
                </Button>
              </Link>
            </SheetClose>
          );
        })}
      </SheetContent>
    </Sheet>
  );
};
