"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginSchema } from "../../schema";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/reusable/form-error";
import { login } from "../../actions";
import { useUserStore } from "@/store/use-user-store";

export const LoginForm = () => {
	const [error, setError] = useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();
	const setUser = useUserStore((state) => state.setUser);

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		setError("");
		startTransition(() => {
			login(values)
				.then((data) => {
					if (data?.error) {
						setError(data.error);
					}
					if (data?.user) {
						form.reset();
						setUser(data.user);
					}
				})
				.catch(() => {
					setError("Something went wrong");
				});
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className="space-y-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										{...field}
										disabled={isPending}
										placeholder="john.doe@example.com"
										type="email"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										{...field}
										disabled={isPending}
										placeholder="******"
										type="password"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormError message={error} />
				<Button disabled={isPending} type="submit" className="w-full">
					{isPending ? "Loading..." : "Login/Sign Up"}
				</Button>
			</form>
		</Form>
	);
};
