import { z } from "zod";

const LoginSchema = z.object({
	email: z
		.string()
		.email("Invalid email address")
		.max(64, "Email must be less than 64 characters"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

export { LoginSchema };
