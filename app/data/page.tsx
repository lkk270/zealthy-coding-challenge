import { UsersDataTable } from "./_components/users-data-table";
import { getDb } from "@/db/drizzle";
import { users, addresses } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function DataPage() {
	const db = await getDb();
	const allUsers = await db
		.select()
		.from(users)
		.leftJoin(addresses, eq(users.id, addresses.userId));

	// Transform joined data to match User type
	const transformedUsers = allUsers.map(
		({ users: user, addresses: address }) => ({
			...user,
			address: address,
		})
	);

	return (
		<div className="container mx-auto py-4">
			<h1 className="text-2xl font-bold mb-4">Users</h1>
			<UsersDataTable users={transformedUsers} />
		</div>
	);
}
