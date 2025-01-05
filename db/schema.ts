import {
	pgTable,
	serial,
	text,
	integer,
	timestamp,
	date,
	pgEnum,
} from "drizzle-orm/pg-core";

export const stepsEnum = pgEnum("steps", ["Step2", "Step3", "Finished"]);

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),
	aboutMe: text("about_me"),
	dateOfBirth: date("dob"),
	currentStep: stepsEnum("current_step").notNull().default("Step2"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const addresses = pgTable("addresses", {
	id: serial("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id),
	address1: text("address_1").notNull(),
	address2: text("address_2"),
	city: text("city").notNull(),
	state: text("state").notNull(),
	zip: text("zip").notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});
