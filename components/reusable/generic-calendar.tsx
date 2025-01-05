import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

interface GenericCalendarProps {
  disabled?: boolean;
  valueParam?: Date | string | null;
  handleChange: (value: Date | null) => void;
}

export const GenericCalendar = ({ disabled = false, valueParam, handleChange }: GenericCalendarProps) => {
  const [selected, setSelected] = useState<Date | undefined>(() => {
    if (!valueParam) return undefined;

    // For ISO strings, extract just the date part to avoid timezone issues
    if (typeof valueParam === "string") {
      const dateOnly = valueParam.split("T")[0];
      const [year, month, day] = dateOnly.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return date;
    }

    return new Date(valueParam);
  });

  const defaultMonth = selected || new Date();

  const handleDayClick = (day: Date | undefined) => {
    if (!day) {
      setSelected(undefined);
      handleChange(null);
      return;
    }

    // Create date using local components to avoid timezone issues
    const year = day.getFullYear();
    const month = day.getMonth();
    const dayOfMonth = day.getDate();
    const localDate = new Date(year, month, dayOfMonth);

    setSelected(localDate);
    handleChange(localDate);
  };

  return (
    <div className="z-[1000] border-primary/10 rounded-md">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={handleDayClick}
        disabled={disabled}
        defaultMonth={defaultMonth}
        footer={selected ? `Selected: ${selected.toLocaleDateString()}` : "Pick a day."}
        captionLayout="dropdown"
      />
    </div>
  );
};
