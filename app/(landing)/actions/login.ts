"use server";

import { z } from "zod";
import { getDb } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { LoginSchema } from "@/app/(landing)/schema";

export async function login(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;
  const normalizedEmail = email.toLowerCase();

  try {
    const db = await getDb();
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, normalizedEmail),
    });

    if (existingUser) {
      if (existingUser.password !== password) {
        return { error: "Invalid credentials!" };
      }
      return { user: existingUser };
    }

    const newUser = await db
      .insert(users)
      .values({
        email: normalizedEmail,
        password,
        currentStep: "Step2",
      })
      .returning();

    return { user: newUser[0] };
  } catch (error) {
    console.error("[LOGIN_ERROR]", error);
    return { error: "Something went wrong!" };
  }
}
