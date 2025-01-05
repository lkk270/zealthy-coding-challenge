"use client";

import { DataTable } from "@/components/ui/table/data-table";
import { usersColumns } from "./users-columns";
import { users } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

// Infer the User type from the schema
type User = InferSelectModel<typeof users>;

interface UsersDataTableProps {
	users: User[];
}
console.log(users);
export function UsersDataTable({ users }: UsersDataTableProps) {
	return <DataTable columns={usersColumns} data={users} />;
}
