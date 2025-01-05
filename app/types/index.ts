import { createStepSchema } from "@/app/(landing)/schema";

export type ComboboxItemType = {
	value: string;
	label: string;
};

export type StepConfig = {
	step: string;
	components: string[];
	schema: ReturnType<typeof createStepSchema>;
};
