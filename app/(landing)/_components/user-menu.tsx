"use client";

import { Button } from "@/components/ui/button";
import { LogOut, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChangePasswordButton } from "./buttons/change-password-button";
import { useUserStore } from "@/store/use-user-store";

export const UserMenu = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  if (!user) return null;

  return (
    <div className="flex items-center justify-end gap-x-4">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-x-2 text-sm text-muted-foreground hover:text-foreground transition max-w-[180px]">
          <span className="truncate" title={user.email}>
            {user.email}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <ChangePasswordButton asChild>
              <button className="w-full text-left">Change Password</button>
            </ChangePasswordButton>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="ghost" size="sm" onClick={() => setUser(null)} className="flex items-center gap-x-2">
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
};
