import { z } from "zod";

const LoginSchema = z.object({
	email: z
		.string()
		.email("Invalid email address")
		.max(64, "Email must be less than 64 characters"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

const PasswordChangeSchema = z
	.object({
		currentPassword: z.string().min(1, "Current password is required"),
		newPassword: z
			.string()
			.min(8, "New password must be at least 8 characters"),
		confirmPassword: z.string().min(8, "Password confirmation is required"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export const ComponentSchemas = {
	aboutMe: z.string().optional(),
	address: z
		.object({
			address1: z.string().optional(),
			address2: z.string().optional(),
			city: z.string().optional(),
			state: z.string().optional(),
			zip: z
				.string()
				.optional()
				.refine(
					(value) => {
						// Skip refinement if value is empty/null/undefined
						if (!value) return true;
						// Validate ZIP format
						return /^\d{5}$/.test(value);
					},
					{
						message: "ZIP code must be 5 digits",
					}
				),
		})
		.superRefine((data, ctx) => {
			const { address1, city, state, zip } = data;
			const fillStates = [
				!address1?.trim(),
				!city?.trim(),
				!state?.trim(),
				!zip?.trim(),
			];

			const allEmpty = fillStates.every((state) => state === true);
			const allFilled = fillStates.every((state) => state === false);

			// If some fields are filled but not all
			if (!allEmpty && !allFilled) {
				["address1", "city", "state", "zip"].forEach((fieldName, index) => {
					if (fillStates[index]) {
						ctx.addIssue({
							path: [fieldName],
							message: "All address fields must be filled (except address2)",
							code: "custom",
						});
					}
				});
			}
		})
		.optional(),
	dateOfBirth: z.string().optional(),
};

type ComponentKey = keyof typeof ComponentSchemas;

export const createStepSchema = (components: string[]) => {
	const schemaShape: Partial<Record<ComponentKey, z.ZodTypeAny>> = {};

	components.forEach((component) => {
		const key = component.toLowerCase().replace(/\s+/g, "") as ComponentKey;
		if (ComponentSchemas[key]) {
			schemaShape[key] = ComponentSchemas[key];
		}
	});

	return z.object(schemaShape);
};

export { LoginSchema, PasswordChangeSchema };
