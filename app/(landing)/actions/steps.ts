"use server";

import { getDb } from "@/db/drizzle";
import { users, addresses, stepsEnum } from "@/db/schema";
import { eq } from "drizzle-orm";
import { InferSelectModel } from "drizzle-orm";

type User = InferSelectModel<typeof users>;
type Address = InferSelectModel<typeof addresses>;
type StepType = (typeof stepsEnum.enumValues)[number];

export async function updateUserStep(
	userId: number,
	step: StepType,
	data: Record<string, unknown> | undefined
) {
	try {
		const db = await getDb();
		console.log("Received data in server action:", data);

		const updateData: Partial<User> = {
			currentStep: step,
		};

		if (data) {
			if (data.aboutMe !== undefined) {
				updateData.aboutMe = data.aboutMe as string;
			}

			if ("dateOfBirth" in data) {
				updateData.dateOfBirth = data.dateOfBirth
					? (data.dateOfBirth as string)
					: null;
			}

			if (data.address) {
				const addressData = data.address as Partial<Address>;
				await db.insert(addresses).values({
					userId,
					address1: addressData.address1!,
					address2: addressData.address2 || null,
					city: addressData.city!,
					state: addressData.state!,
					zip: addressData.zip!,
				});
			}
		}

		console.log("Update data being sent to DB:", updateData);

		await db.update(users).set(updateData).where(eq(users.id, userId));

		return { success: true };
	} catch (error) {
		console.log("Error in updateUserStep:", error);
		console.error("[UPDATE_USER_STEP_ERROR]", error);
		return { error: "Something went wrong!" };
	}
}
