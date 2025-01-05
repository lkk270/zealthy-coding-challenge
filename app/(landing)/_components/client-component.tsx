"use client";

import { useState, useEffect, useTransition } from "react";
import { LoginForm } from "./forms/login-form";
import { DynamicForm } from "./forms/dynamic-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserStore } from "@/store/use-user-store";
import { createStepSchema } from "../schema";
import { StepConfig } from "@/app/types";
import { toast } from "sonner";
import { updateUserStep } from "../actions/steps";
import { StepLabel, componentsEnum } from "@/db/schema";
import { UserMenu } from "./user-menu";
import { UserData } from "./user-data";

interface ConfigItem {
  step: string;
  component: (typeof componentsEnum.enumValues)[number];
}

interface ClientComponentProps {
  config: ConfigItem[];
}

const ClientComponent = ({ config }: ClientComponentProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  // Group components by step
  const stepConfigs = config.reduce((acc: Record<string, StepConfig>, curr) => {
    const step = curr.step;
    if (!acc[step]) {
      acc[step] = {
        step: step,
        components: [],
        schema: createStepSchema([curr.component]),
      };
    } else {
      acc[step].schema = createStepSchema([...acc[step].components, curr.component]);
    }
    acc[step].components.push(curr.component);
    return acc;
  }, {});

  const sortedSteps = Object.values(stepConfigs) as StepConfig[];

  // Calculate initial step based on user's currentStep
  const [currentStep, setCurrentStep] = useState(() => {
    if (!user || !user.currentStep) return 0;

    if (user.currentStep === "Finished") {
      return sortedSteps.length - 1;
    }

    // Find the index of the current step in sortedSteps
    const currentStepIndex = sortedSteps.findIndex((config) => config.step === user.currentStep);

    // If found, return that index, otherwise return 0
    return currentStepIndex >= 0 ? currentStepIndex : 0;
  });

  useEffect(() => {
    // Short timeout to allow hydration to complete
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user?.currentStep) {
      // This ensures the local state matches the database state
      setCurrentStep(() => {
        if (user.currentStep === "Finished") {
          return sortedSteps.length - 1;
        }
        const stepIndex = sortedSteps.findIndex((config) => config.step === user.currentStep);
        return stepIndex >= 0 ? stepIndex : 0;
      });
    }
  }, [user?.currentStep, sortedSteps]);

  const handleNext = async (data?: Record<string, unknown>) => {
    if (!user) return;

    const nextStep = currentStep + 1;
    const nextStepLabel = (nextStep >= sortedSteps.length ? "Finished" : sortedSteps[nextStep].step) as StepLabel;

    // If no changes were made, just update the step
    if (data?.noChanges) {
      toast("No changes made");
      // Store previous state for potential rollback
      const previousUser = { ...user };

      // Optimistic update
      setUser({
        ...user,
        currentStep: nextStepLabel,
      });
      setCurrentStep((prev) => Math.min(prev + 1, sortedSteps.length - 1));

      startTransition(async () => {
        const result = await updateUserStep(user.id, nextStepLabel, {});

        if (result.error) {
          //Rollback on error
          //No need to show the original values - in case the user would like to try form submission again.
          //They can always refresh the page to get the original values.
          toast.error(result.error);
          setUser(previousUser);
          setCurrentStep(currentStep);
          return;
        }
      });
      return;
    }

    // Store previous state for potential rollback
    const previousUser = { ...user };
    const previousStep = currentStep;

    // Optimistic update
    setUser({
      ...user,
      ...data,
      currentStep: nextStepLabel,
    });
    setCurrentStep((prev) => Math.min(prev + 1, sortedSteps.length - 1));

    // Update server in background
    startTransition(async () => {
      const result = await updateUserStep(user.id, nextStepLabel, data);

      if (result.error) {
        // Rollback on error
        toast(result.error);
        setUser(previousUser);
        setCurrentStep(previousStep);
        return;
      }
    });
  };

  const handlePrevious = () => {
    if (!user) return;

    const previousStep = currentStep - 1;
    if (previousStep < 0) return;

    const previousStepLabel = sortedSteps[previousStep].step;

    // Optimistic update
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    setUser({
      ...user,
      currentStep: previousStepLabel as StepLabel,
    });

    // Update server state in background
    startTransition(async () => {
      const result = await updateUserStep(user.id, previousStepLabel as StepLabel, {});

      if (result.error) {
        // Rollback both UI and store state on error
        // setCurrentStep(currentStep);
        // setUser(previousUser);
        toast.error("Current step not updated properly");
      }
    });
  };

  const handleEditProfile = () => {
    if (!user) return;

    // Set current step to Step2 (index 0)
    setCurrentStep(0);

    // Update user's currentStep in store and DB
    const updatedUser = { ...user, currentStep: "Step2" as const };
    setUser(updatedUser);

    startTransition(async () => {
      const result = await updateUserStep(user.id, "Step2", {});
      if (result.error) {
        toast.error(result.error);
        // Rollback on error
        setUser(user);
        setCurrentStep(sortedSteps.length - 1);
      }
    });
  };

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

  // Show completion view if user is finished
  if (user.currentStep === "Finished") {
    return (
      <div className="w-full max-w-4xl mx-auto pb-10">
        <div className="mb-6">
          <UserMenu />
        </div>
        <UserData user={user} onEdit={handleEditProfile} />
      </div>
    );
  }

  const currentConfig = sortedSteps[currentStep];

  return (
    <div className="w-full max-w-4xl mx-auto pb-10">
      <div className="mb-6">
        <UserMenu />
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            {currentConfig.step} - {currentStep + 2} of {sortedSteps.length + 1}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicForm
            components={currentConfig.components}
            schema={currentConfig.schema}
            onSubmit={(data: Record<string, unknown>) => {
              handleNext(data);
            }}
            onPrevious={handlePrevious}
            isLastStep={currentStep === sortedSteps.length - 1}
            isFirstStep={currentStep === 0}
            isPending={isPending}
            initialValues={user}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientComponent;
