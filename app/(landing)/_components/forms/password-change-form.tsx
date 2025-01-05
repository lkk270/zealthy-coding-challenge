"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordChangeSchema } from "../../schema";
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
import { changePassword } from "../../actions";
import { useUserStore } from "@/store/use-user-store";
import { DialogClose } from "@/components/ui/dialog";

interface PasswordChangeFormProps {
	onSuccess?: () => void;
}

export const PasswordChangeForm = ({ onSuccess }: PasswordChangeFormProps) => {
	const [error, setError] = useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();
	const user = useUserStore((state) => state.user);

	const form = useForm<z.infer<typeof PasswordChangeSchema>>({
		resolver: zodResolver(PasswordChangeSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof PasswordChangeSchema>) => {
		if (!user) return;

		setError("");
		startTransition(async () => {
			const result = await changePassword(user.id.toString(), values);

			if (result.error) {
				setError(result.error);
			} else if (result.success) {
				form.reset();
				onSuccess?.();
			}
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className="space-y-4">
					<FormField
						control={form.control}
						name="currentPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-bold">Current Password</FormLabel>
								<FormControl>
									<Input {...field} type="password" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="newPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-bold">New Password</FormLabel>
								<FormControl>
									<Input {...field} type="password" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-bold">
									Confirm New Password
								</FormLabel>
								<FormControl>
									<Input {...field} type="password" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormError message={error} />
				<div className="flex justify-end gap-x-2">
					<DialogClose asChild>
						<Button type="button" variant="outline">
							Cancel
						</Button>
					</DialogClose>
					<Button type="submit">
						{isPending ? "Loading..." : "Change Password"}
					</Button>
				</div>
			</form>
		</Form>
	);
};
