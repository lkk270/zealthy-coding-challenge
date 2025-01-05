"use client";

import { DataTable } from "@/components/ui/table/data-table";
import { usersColumns } from "./users-columns";
import { users } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

// Infer the User type from the schema
type User = InferSelectModel<typeof users>;

interface UsersDataTableProps {
  users: User[];
}

export function UsersDataTable({ users }: UsersDataTableProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => router.refresh()} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      <DataTable columns={usersColumns} data={users} />
    </div>
  );
}
