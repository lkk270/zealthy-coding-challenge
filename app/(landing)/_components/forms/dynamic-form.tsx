"use client";

import React from "react";
import * as z from "zod";
import { useForm, Control, UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GenericCalendar } from "@/components/reusable/generic-calendar";
import { GenericCombobox } from "@/components/reusable/generic-combobox";
import { states } from "@/lib/constants";

interface FormValues extends Record<string, unknown> {
  aboutMe?: string | null;
  dateOfBirth?: string | null;
  address?: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
  };
}

interface ComponentRendererProps {
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  isPending?: boolean;
}

interface DynamicFormProps {
  components: string[];
  schema: z.ZodObject<Record<string, z.ZodTypeAny>>;
  onSubmit: (data: FormValues | { noChanges: true }) => void;
  isPending?: boolean;
  showButtons?: boolean;
  onPrevious?: () => void;
  isLastStep?: boolean;
  isFirstStep?: boolean;
  initialValues?: Partial<FormValues>;
}

export const DynamicForm = ({
  components = [],
  schema,
  onSubmit,
  isPending = false,
  showButtons = true,
  onPrevious,
  isLastStep = false,
  isFirstStep = false,
  initialValues,
}: DynamicFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      aboutMe: initialValues?.aboutMe ?? null,
      dateOfBirth: initialValues?.dateOfBirth ?? null,
      address: {
        address1: initialValues?.address?.address1 ?? "",
        address2: initialValues?.address?.address2 ?? "",
        city: initialValues?.address?.city ?? "",
        state: initialValues?.address?.state ?? "",
        zip: initialValues?.address?.zip ?? "",
      },
    },
  });

  const componentRenderers: Record<string, (props: ComponentRendererProps) => React.ReactElement> = {
    aboutme: ({ control }: ComponentRendererProps) => (
      <FormField
        control={control}
        name="aboutMe"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">About Me</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                className="h-[200px]"
                placeholder="Tell us about yourself..."
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),

    dateofbirth: ({ control }: ComponentRendererProps) => (
      <FormField
        control={control}
        name="dateOfBirth"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">Date of Birth</FormLabel>
            <FormControl>
              <GenericCalendar
                handleChange={(value) => {
                  if (!value) {
                    field.onChange(null);
                    return;
                  }
                  // Format as YYYY-MM-DD
                  const dateString = value.toLocaleDateString("en-CA");
                  field.onChange(dateString);
                }}
                valueParam={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),

    address: ({ control }: ComponentRendererProps) => (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="address.address1"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Address</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Address line 1" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="address.address2"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Address 2 (Optional)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Address line 2" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="address.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">City</FormLabel>
              <FormControl>
                <Input {...field} placeholder="City" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="address.state"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">State</FormLabel>
              <FormControl>
                <GenericCombobox
                  items={states}
                  handleChange={field.onChange}
                  valueParam={field.value}
                  placeholder="Select state..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="address.zip"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">ZIP Code</FormLabel>
              <FormControl>
                <Input {...field} placeholder="ZIP code" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    ),
  };

  const handleSubmit = async () => {
    const formState = form.getValues();
    const dirtyFields = form.formState.dirtyFields;

    // Check if any fields are actually dirty
    const hasChanges = Object.keys(dirtyFields).length > 0;

    if (!hasChanges) {
      onSubmit({ noChanges: true });
      return;
    }

    const relevantData = components.reduce((acc: Partial<FormValues>, component) => {
      const key = component.toLowerCase().replace(/\s+/g, "");

      switch (key) {
        case "aboutme":
          if (dirtyFields.aboutMe) {
            acc.aboutMe = formState.aboutMe;
          }
          break;
        case "dateofbirth":
          if (dirtyFields.dateOfBirth) {
            acc.dateOfBirth = formState.dateOfBirth || null;
          }
          break;
        case "address":
          if (dirtyFields.address) {
            acc.address = formState.address;
          }
          break;
      }
      return acc;
    }, {});

    onSubmit(relevantData);
  };

  if (!components || !Array.isArray(components)) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {components.map((component) => {
          const key = component.toLowerCase().replace(/\s+/g, "");
          const renderer = componentRenderers[key as keyof typeof componentRenderers];
          return renderer ? (
            <div key={key}>
              {renderer({
                control: form.control,
                setValue: form.setValue,
                isPending,
              })}
            </div>
          ) : null;
        })}
        {showButtons && (
          <div className="flex justify-between mt-6">
            <Button type="button" variant="outline" onClick={onPrevious} disabled={isFirstStep}>
              Previous
            </Button>
            <Button type="submit" disabled={isPending}>
              {isLastStep ? "Finish" : "Save and Continue"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};
