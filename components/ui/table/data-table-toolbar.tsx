import { useState, useEffect } from "react";
import { CircleX } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { Button } from "../button";
import { Input } from "../input";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({
	table,
}: DataTableToolbarProps<TData>) {
	const [filterText, setFilterText] = useState("");

	useEffect(() => {
		table.setGlobalFilter(filterText);
	}, [filterText, table]);

	const isFiltered = table.getState().globalFilter;

	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center flex-1 space-x-2">
				<Input
					placeholder="Filter..."
					value={filterText}
					onChange={(event) => setFilterText(event.target.value)}
					className="h-8 w-[150px] lg:w-[250px]"
					suppressHydrationWarning
				/>
				{isFiltered && (
					<Button
						variant="ghost"
						onClick={() => {
							table.resetColumnFilters();
							setFilterText("");
							table.setGlobalFilter("");
						}}
						className="h-8 px-2 lg:px-3"
					>
						Reset
						<CircleX className="w-4 h-4 ml-2" />
					</Button>
				)}
			</div>
			{/* {customActions && <div className="flex gap-x-2">{customActions}</div>} */}
		</div>
	);
}
