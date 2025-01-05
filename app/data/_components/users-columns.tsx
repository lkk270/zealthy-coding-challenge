import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { users, addresses } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

type User = InferSelectModel<typeof users> & {
	address?: InferSelectModel<typeof addresses> | null;
};

export const usersColumns: ColumnDef<User>[] = [
	{
		accessorKey: "email",
		header: ({ column }) => (
			<div className="text-center">
				<DataTableColumnHeader column={column} title="Email" />
			</div>
		),
		cell: ({ row }) => (
			<div className="text-center">
				<span className="font-medium truncate">{row.getValue("email")}</span>
			</div>
		),
	},
	{
		accessorKey: "aboutMe",
		header: ({ column }) => (
			<div className="text-center">
				<DataTableColumnHeader column={column} title="About" />
			</div>
		),
		cell: ({ row }) => {
			const aboutMe = row.getValue("aboutMe") as string | null;
			if (!aboutMe) return <div className="text-center">-</div>;

			return (
				<div className="text-center">
					<Popover>
						<PopoverTrigger asChild>
							<Button variant="ghost" className="h-8 w-8">
								👤
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-80">
							<div className="relative">
								<div
									className="max-h-[200px] overflow-y-auto pr-2"
									ref={(element) => {
										if (element) {
											const isScrollable =
												element.scrollHeight > element.clientHeight;
											const gradient =
												element.nextElementSibling as HTMLElement;
											if (gradient) {
												gradient.style.display = isScrollable
													? "block"
													: "none";
											}

											const handleScroll = () => {
												if (gradient) {
													const isBottom =
														Math.abs(
															element.scrollHeight -
																element.clientHeight -
																element.scrollTop
														) < 1;
													gradient.style.display =
														isScrollable && !isBottom ? "block" : "none";
												}
											};

											element.addEventListener("scroll", handleScroll);
										}
									}}
								>
									<p className="text-sm">{aboutMe}</p>
								</div>
								<div className="absolute bottom-0 left-0 right-2 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
							</div>
						</PopoverContent>
					</Popover>
				</div>
			);
		},
	},
	{
		accessorKey: "address",
		header: ({ column }) => (
			<div className="text-center">
				<DataTableColumnHeader column={column} title="Address" />
			</div>
		),
		cell: ({ row }) => {
			const address = row.original.address;
			if (!address) return <div className="text-center">-</div>;

			return (
				<div className="text-center">
					<Popover>
						<PopoverTrigger asChild>
							<Button variant="ghost" className="h-8 w-8">
								📍
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-80">
							<div className="relative">
								<div
									className="space-y-2 max-h-[200px] overflow-y-auto pr-2"
									ref={(element) => {
										if (element) {
											const isScrollable =
												element.scrollHeight > element.clientHeight;
											const gradient =
												element.nextElementSibling as HTMLElement;
											if (gradient) {
												gradient.style.display = isScrollable
													? "block"
													: "none";
											}

											const handleScroll = () => {
												if (gradient) {
													const isBottom =
														Math.abs(
															element.scrollHeight -
																element.clientHeight -
																element.scrollTop
														) < 1;
													gradient.style.display =
														isScrollable && !isBottom ? "block" : "none";
												}
											};

											element.addEventListener("scroll", handleScroll);
										}
									}}
								>
									<p className="text-sm font-medium">{address.address1}</p>
									{address.address2 && (
										<p className="text-sm">{address.address2}</p>
									)}
									<p className="text-sm">
										{address.city}, {address.state} {address.zip}
									</p>
								</div>
								<div className="absolute bottom-0 left-0 right-2 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
							</div>
						</PopoverContent>
					</Popover>
				</div>
			);
		},
	},
	{
		accessorKey: "dateOfBirth",
		header: ({ column }) => (
			<div className="text-center">
				<DataTableColumnHeader column={column} title="Birth Date" />
			</div>
		),
		cell: ({ row }) => {
			const dateString = row.getValue("dateOfBirth") as string;
			if (!dateString) return <div className="text-center">-</div>;

			const [year, month, day] = dateString
				.split("T")[0]
				.split("-")
				.map(Number);
			const date = new Date(year, month - 1, day);

			return <div className="text-center">{format(date, "MMM d, yyyy")}</div>;
		},
	},
	{
		accessorKey: "currentStep",
		header: ({ column }) => (
			<div className="text-center">
				<DataTableColumnHeader column={column} title="Current Step" />
			</div>
		),
		cell: ({ row }) => (
			<div className="text-center">
				<span className="font-medium">{row.getValue("currentStep")}</span>
			</div>
		),
		sortingFn: (rowA, rowB) => {
			const stepOrder = {
				STEP2: 1,
				STEP3: 2,
				FINISHED: 3,
			};

			const stepA = (rowA.getValue("currentStep") as string).toUpperCase();
			const stepB = (rowB.getValue("currentStep") as string).toUpperCase();

			const valueA = stepOrder[stepA as keyof typeof stepOrder] || 0;
			const valueB = stepOrder[stepB as keyof typeof stepOrder] || 0;

			return valueA - valueB;
		},
	},
];
