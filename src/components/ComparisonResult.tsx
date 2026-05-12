"use client";

import { metricLabels } from "@/lib/defaultData";
import {
  ComparisonMetric,
  ComparisonSettings,
  StackedDatum
} from "@/types/presentation";

interface ComparisonResultProps {
  stackedData: StackedDatum[];
  settings: ComparisonSettings;
  onSettingsChange: (nextSettings: ComparisonSettings) => void;
  compact?: boolean;
}

function formatMetric(metric: ComparisonMetric): string {
  return metricLabels[metric];
}

export function ComparisonResult({
  stackedData,
  settings,
  onSettingsChange,
  compact = false
}: ComparisonResultProps) {
  if (stackedData.length === 0) {
    return (
      <div
        className={
          compact
            ? "rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500"
            : "rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 text-sm text-slate-500 shadow-soft"
        }
      >
        Comparison sonucu gormek icin once stacked bar verisi ekleyin.
      </div>
    );
  }

  const firstValue =
    stackedData.find((item) => item.label === settings.columnA)?.[settings.metric] ?? 0;
  const secondValue =
    stackedData.find((item) => item.label === settings.columnB)?.[settings.metric] ?? 0;
  const difference = secondValue - firstValue;
  const percentageChange =
    firstValue === 0 ? 0 : Number(((difference / firstValue) * 100).toFixed(1));

  const differenceClassName =
    difference > 0
      ? "text-brand-green"
      : difference < 0
        ? "text-feedback-negative"
        : "text-feedback-neutral";

  const wrapperClassName = compact
    ? "rounded-2xl border border-slate-200 bg-slate-50 p-4"
    : "rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-soft";

  return (
    <div className={wrapperClassName}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            Comparison Result
          </p>
          <h3
            className={`mt-2 font-semibold tracking-tight text-slate-900 ${
              compact ? "text-base" : "text-xl"
            }`}
          >
            Donem karsilastirmasi
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <select
            value={settings.columnA}
            onChange={(event) =>
              onSettingsChange({ ...settings, columnA: event.target.value })
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
          >
            {stackedData.map((item) => (
              <option key={`column-a-${item.label}`} value={item.label}>
                Column A: {item.label}
              </option>
            ))}
          </select>
          <select
            value={settings.columnB}
            onChange={(event) =>
              onSettingsChange({ ...settings, columnB: event.target.value })
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
          >
            {stackedData.map((item) => (
              <option key={`column-b-${item.label}`} value={item.label}>
                Column B: {item.label}
              </option>
            ))}
          </select>
          <select
            value={settings.metric}
            onChange={(event) =>
              onSettingsChange({
                ...settings,
                metric: event.target.value as ComparisonMetric
              })
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
          >
            {Object.entries(metricLabels).map(([metric, label]) => (
              <option key={metric} value={metric}>
                Metric: {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        className={`mt-4 grid gap-3 ${
          compact ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4"
        }`}
      >
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
            Column A
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">{settings.columnA}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            {firstValue}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
            Column B
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">{settings.columnB}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            {secondValue}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Metric</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {formatMetric(settings.metric)}
          </p>
          <p className={`mt-1 text-2xl font-semibold tracking-tight ${differenceClassName}`}>
            {difference > 0 ? "+" : ""}
            {difference}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
            Percentage
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">Degisim orani</p>
          <p className={`mt-1 text-2xl font-semibold tracking-tight ${differenceClassName}`}>
            {percentageChange > 0 ? "+" : ""}
            {percentageChange}%
          </p>
        </div>
      </div>
    </div>
  );
}
