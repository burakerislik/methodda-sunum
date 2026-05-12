"use client";

import { chartTypeLabels } from "@/lib/defaultData";
import { ChartType } from "@/types/presentation";

interface ChartTypeSelectProps {
  label?: string;
  value: ChartType;
  onChange: (value: ChartType) => void;
  compact?: boolean;
}

const chartTypeOptions: ChartType[] = ["stackedBar", "pie", "area"];

export function ChartTypeSelect({
  label,
  value,
  onChange,
  compact = false
}: ChartTypeSelectProps) {
  return (
    <label className="flex flex-col gap-1.5 text-slate-600">
      {label ? (
        <span
          className={`font-medium uppercase tracking-[0.18em] ${
            compact ? "text-[10px]" : "text-[11px]"
          }`}
        >
          {label}
        </span>
      ) : null}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as ChartType)}
        className={`rounded-2xl border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700 shadow-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 ${
          compact ? "text-xs" : "text-sm"
        }`}
      >
        {chartTypeOptions.map((option) => (
          <option key={option} value={option}>
            {chartTypeLabels[option]}
          </option>
        ))}
      </select>
    </label>
  );
}
