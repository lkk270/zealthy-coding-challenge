"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
	size?: number;
}

export const Logo = ({ size = 65 }: LogoProps) => {
	return (
		<Link className="" href="/" onDragStart={(e) => e.preventDefault()}>
			<div className="flex items-center gap-x-2">
				<Image
					className="shrink-0"
					priority={true}
					src="/logo.png"
					height={size}
					width={size}
					alt="Logo"
					draggable={false}
				/>
			</div>
		</Link>
	);
};
