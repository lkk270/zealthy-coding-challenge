"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { PasswordChangeForm } from "../forms/password-change-form";

interface ChangePasswordButtonProps {
	children: React.ReactNode;
	asChild?: boolean;
}

export const ChangePasswordButton = ({
	children,
	asChild = false,
}: ChangePasswordButtonProps) => {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild={asChild}>{children}</DialogTrigger>
			{open && (
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Change Password</DialogTitle>
					</DialogHeader>
					<PasswordChangeForm onSuccess={() => setOpen(false)} />
				</DialogContent>
			)}
		</Dialog>
	);
};
