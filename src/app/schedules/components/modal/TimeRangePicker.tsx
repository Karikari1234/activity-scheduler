"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { TimePickerInput } from "@/components/ui/time-picker-input";

interface TimeRangePickerProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  className?: string;
}

export function TimeRangePicker({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  className,
}: TimeRangePickerProps) {
  // Refs for focus management
  const startHourRef = React.useRef<HTMLInputElement>(null);
  const startMinuteRef = React.useRef<HTMLInputElement>(null);
  const endHourRef = React.useRef<HTMLInputElement>(null);
  const endMinuteRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      {/* Start Time */}
      <div>
        <div className="flex items-end gap-2">
          <div className="grid gap-1 text-center">
            <Label htmlFor="startHours" className="text-xs">
              Hours
            </Label>
            <TimePickerInput
              picker="hours"
              date={startDate}
              setDate={setStartDate}
              ref={startHourRef}
              onRightFocus={() => startMinuteRef.current?.focus()}
            />
          </div>
          <div className="grid gap-1 text-center">
            <Label htmlFor="startMinutes" className="text-xs">
              Minutes
            </Label>
            <TimePickerInput
              picker="minutes"
              date={startDate}
              setDate={setStartDate}
              ref={startMinuteRef}
              onLeftFocus={() => startHourRef.current?.focus()}
              onRightFocus={() => endHourRef.current?.focus()}
            />
          </div>
          <div className="flex h-10 items-center">
            <span className="px-2 text-text-secondary">to</span>
          </div>
          <div className="grid gap-1 text-center">
            <Label htmlFor="endHours" className="text-xs">
              Hours
            </Label>
            <TimePickerInput
              picker="hours"
              date={endDate}
              setDate={setEndDate}
              ref={endHourRef}
              onRightFocus={() => endMinuteRef.current?.focus()}
              onLeftFocus={() => startMinuteRef.current?.focus()}
            />
          </div>
          <div className="grid gap-1 text-center">
            <Label htmlFor="endMinutes" className="text-xs">
              Minutes
            </Label>
            <TimePickerInput
              picker="minutes"
              date={endDate}
              setDate={setEndDate}
              ref={endMinuteRef}
              onLeftFocus={() => endHourRef.current?.focus()}
            />
          </div>
          <div className="flex h-10 items-center">
            <Clock className="ml-2 h-4 w-4 text-text-secondary" />
          </div>
        </div>
      </div>
    </div>
  );
}
