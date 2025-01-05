"use client";

import { useState, useEffect } from "react";
import { LoginForm } from "./forms/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserStore } from "@/store/use-user-store";

const ClientComponent = ({}) => {
	const [isLoading, setIsLoading] = useState(true);
	const user = useUserStore((state) => state.user);
	const setUser = useUserStore((state) => state.setUser);

	useEffect(() => {
		// Short timeout to allow hydration to complete
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 100);

		return () => clearTimeout(timer);
	}, []);

	if (isLoading) {
		return null;
	}

	if (!user) {
		return (
			<Card className="w-full max-w-md mx-auto">
				<CardHeader>
					<CardTitle>Login</CardTitle>
				</CardHeader>
				<CardContent>
					<LoginForm />
				</CardContent>
			</Card>
		);
	}

	return <div className="w-full max-w-4xl mx-auto pb-10">steps</div>;
};

export default ClientComponent;
