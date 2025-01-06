"use server";

import { getDb } from "@/db/drizzle";
import { componentsEnum } from "@/db/schema";
import { revalidatePath } from "next/cache";

type OnboardingComponent = (typeof componentsEnum.enumValues)[number];

interface SaveConfigParams {
  step2: string[];
  step3: string[];
}

export async function saveConfig({ step2, step3 }: SaveConfigParams) {
  try {
    if (step2.length === 0 || step3.length === 0) {
      return { error: "Each step must have at least one component" };
    }

    const db = await getDb();

    // Create the new config items first
    const configItems = [
      ...step2.map((component) => ({
        component: component as OnboardingComponent,
        step: "Step2" as const,
      })),
      ...step3.map((component) => ({
        component: component as OnboardingComponent,
        step: "Step3" as const,
      })),
    ];

    // Delete and insert in a single query using SQL since transaction is not supported in Neon serverless.
    await db.execute(`
			WITH deleted AS (
				DELETE FROM "onboarding_config"
			)
			INSERT INTO "onboarding_config" (component, step)
			VALUES ${configItems.map((item) => `('${item.component}', '${item.step}')`).join(", ")}
		`);

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("[SAVE_CONFIG_ERROR]", error);
    return { error: "Failed to save configuration" };
  }
}
