"use server";

import { z } from "zod";
import { getDb } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PasswordChangeSchema } from "@/app/(landing)/schema";

export async function changePassword(
	userId: string,
	values: z.infer<typeof PasswordChangeSchema>
) {
	const validatedFields = PasswordChangeSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: "Invalid fields!" };
	}

	const { currentPassword, newPassword } = validatedFields.data;

	try {
		const db = await getDb();
		const user = await db.query.users.findFirst({
			where: eq(users.id, parseInt(userId)),
		});

		if (!user) {
			return { error: "User not found" };
		}

		const normalizedUserEmail = user.email.toLowerCase();
		const existingUser = await db.query.users.findFirst({
			where: eq(users.email, normalizedUserEmail),
		});

		if (!existingUser || existingUser.password !== currentPassword) {
			return { error: "Current password is incorrect" };
		}

		await db
			.update(users)
			.set({ password: newPassword })
			.where(eq(users.id, existingUser.id));

		return { success: true };
	} catch (error) {
		console.error("[CHANGE_PASSWORD_ERROR]", error);
		return { error: "Something went wrong!" };
	}
}
