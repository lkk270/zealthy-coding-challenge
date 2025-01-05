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

export { LoginSchema, PasswordChangeSchema };
