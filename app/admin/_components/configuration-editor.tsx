"use client";

import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { saveConfig } from "../actions/save-config";
import { COMPONENTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { StepContainer } from "./step-container";

interface ConfigurationEditorProps {
	initialConfig: {
		step2: string[];
		step3: string[];
	};
}

export function ConfigurationEditor({
	initialConfig,
}: ConfigurationEditorProps) {
	// Store the original order in ref when component mounts
	const originalOrder = useRef<string>("");

	const [steps, setSteps] = useState(() => {
		const config =
			!initialConfig.step2.length && !initialConfig.step3.length
				? {
						step2: [COMPONENTS[0].id, COMPONENTS[1].id],
						step3: [COMPONENTS[2].id],
				  }
				: initialConfig;

		// Set the original order on first render
		originalOrder.current = JSON.stringify(config);
		console.log("Original order set:", originalOrder.current);
		return config;
	});

	const isValidConfiguration = (config: typeof steps) => {
		const isValid = config.step2.length > 0 && config.step3.length > 0;
		console.log("Validation check:", {
			step2Length: config.step2.length,
			step3Length: config.step3.length,
			isValid,
		});
		return isValid;
	};

	const hasConfigurationChanged = (currentConfig: typeof steps) => {
		const currentString = JSON.stringify(currentConfig);

		console.log("Configuration comparison:", {
			current: currentString,
			original: originalOrder.current,
			areEqual: currentString === originalOrder.current,
			currentConfig,
			originalString: JSON.parse(originalOrder.current),
		});

		return currentString !== originalOrder.current;
	};

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination) return;

		const { source, destination } = result;
		const sourceList = source.droppableId;
		const destList = destination.droppableId;

		const newSteps = { ...steps };
		const [moved] = newSteps[sourceList as keyof typeof steps].splice(
			source.index,
			1
		);
		newSteps[destList as keyof typeof steps].splice(
			destination.index,
			0,
			moved
		);

		// Set the new state even if invalid
		setSteps(newSteps);

		// Show toast if invalid, don't revert
		if (!isValidConfiguration(newSteps)) {
			toast.error("Each step must have at least one component");
		}
	};

	const handleSave = async () => {
		console.log("Save attempted:", {
			steps,
			initialConfig,
			isValid: isValidConfiguration(steps),
		});

		if (!isValidConfiguration(steps)) {
			toast.error("Each step must have at least one component");
			return;
		}

		if (!hasConfigurationChanged(steps)) {
			console.log("No changes detected");
			toast.info("No changes made");
			return;
		}

		console.log("Saving changes to server");
		const result = await saveConfig(steps);
		if (result.success) {
			// Update the original order reference after successful save
			originalOrder.current = JSON.stringify(steps);
			console.log("New baseline set:", originalOrder.current);
			toast.success("Configuration saved successfully");
		} else {
			toast.error(result.error);
		}
	};
	console.log("Current steps:", steps);

	return (
		<>
			<DragDropContext onDragEnd={handleDragEnd}>
				<div className="grid grid-cols-2 gap-8">
					<StepContainer
						title="Step 2"
						droppableId="step2"
						components={steps.step2}
					/>
					<StepContainer
						title="Step 3"
						droppableId="step3"
						components={steps.step3}
					/>
				</div>
			</DragDropContext>

			<Button
				onClick={handleSave}
				disabled={!isValidConfiguration(steps)}
				variant="default"
				className="mt-8 px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
			>
				Save Configuration
			</Button>
		</>
	);
}
