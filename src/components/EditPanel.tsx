"use client";

import type { ReactNode } from "react";

import { ChartTypeSelect } from "@/components/ChartTypeSelect";
import { ComparisonResult } from "@/components/ComparisonResult";
import {
  AreaDatum,
  ComparisonSettings,
  PieDatum,
  PresentationData,
  StackedDatum
} from "@/types/presentation";

interface EditPanelProps {
  isOpen: boolean;
  data: PresentationData;
  onClose: () => void;
  onTextFieldChange: (
    field: "mainTitle" | "subtitle" | "averageResponseTime",
    value: string
  ) => void;
  onNumberFieldChange: (
    field:
      | "totalRequests"
      | "activeRequests"
      | "completedRequests"
      | "satisfactionRate",
    value: number
  ) => void;
  onSlideOneChartTypeChange: (value: PresentationData["slideOneChartType"]) => void;
  onSlideTwoChartTypeChange: (value: PresentationData["slideTwoChartType"]) => void;
  onStackedDataChange: (nextData: StackedDatum[]) => void;
  onPieDataChange: (nextData: PieDatum[]) => void;
  onAreaDataChange: (nextData: AreaDatum[]) => void;
  onComparisonSettingsChange: (nextSettings: ComparisonSettings) => void;
  onReset: () => void;
}

function toSafeNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function Section({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-slate-800 bg-slate-900/80 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
        {title}
      </h3>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-300">
      <span className="uppercase tracking-[0.22em] text-slate-500">{label}</span>
      {children}
    </label>
  );
}

const inputClassName =
  "rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-brand-lime focus:ring-2 focus:ring-brand-lime/20";

const actionButtonClassName =
  "rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-brand-lime hover:text-white";

export function EditPanel({
  isOpen,
  data,
  onClose,
  onTextFieldChange,
  onNumberFieldChange,
  onSlideOneChartTypeChange,
  onSlideTwoChartTypeChange,
  onStackedDataChange,
  onPieDataChange,
  onAreaDataChange,
  onComparisonSettingsChange,
  onReset
}: EditPanelProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm transition ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-40 h-screen w-full max-w-[420px] overflow-y-auto border-l border-slate-800 bg-slate-950/95 p-5 shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-lime">
              Edit Mode
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              Demo veri paneli
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Tum degisiklikler anlik uygulanir ve localStorage icinde saklanir.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-brand-lime"
          >
            Kapat
          </button>
        </div>

        <div className="mt-5 space-y-4 pb-8">
          <Section title="General">
            <Field label="Main Title">
              <input
                className={inputClassName}
                value={data.mainTitle}
                onChange={(event) => onTextFieldChange("mainTitle", event.target.value)}
              />
            </Field>
            <Field label="Subtitle">
              <textarea
                className={`${inputClassName} min-h-[88px] resize-y`}
                value={data.subtitle}
                onChange={(event) => onTextFieldChange("subtitle", event.target.value)}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Total Requests">
                <input
                  type="number"
                  className={inputClassName}
                  value={data.totalRequests}
                  onChange={(event) =>
                    onNumberFieldChange("totalRequests", toSafeNumber(event.target.value))
                  }
                />
              </Field>
              <Field label="Active Requests">
                <input
                  type="number"
                  className={inputClassName}
                  value={data.activeRequests}
                  onChange={(event) =>
                    onNumberFieldChange("activeRequests", toSafeNumber(event.target.value))
                  }
                />
              </Field>
              <Field label="Completed">
                <input
                  type="number"
                  className={inputClassName}
                  value={data.completedRequests}
                  onChange={(event) =>
                    onNumberFieldChange("completedRequests", toSafeNumber(event.target.value))
                  }
                />
              </Field>
              <Field label="Satisfaction Rate">
                <input
                  type="number"
                  className={inputClassName}
                  value={data.satisfactionRate}
                  onChange={(event) =>
                    onNumberFieldChange("satisfactionRate", toSafeNumber(event.target.value))
                  }
                />
              </Field>
            </div>
            <Field label="Average Response Time">
              <input
                className={inputClassName}
                value={data.averageResponseTime}
                onChange={(event) =>
                  onTextFieldChange("averageResponseTime", event.target.value)
                }
              />
            </Field>
          </Section>

          <Section title="Charts">
            <ChartTypeSelect
              label="Slide 1 chart type"
              value={data.slideOneChartType}
              onChange={onSlideOneChartTypeChange}
            />
            <ChartTypeSelect
              label="Slide 2 chart type"
              value={data.slideTwoChartType}
              onChange={onSlideTwoChartTypeChange}
            />
          </Section>

          <Section title="Stacked Bar Data Editor">
            {data.stackedData.map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3"
              >
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Label">
                    <input
                      className={inputClassName}
                      value={item.label}
                      onChange={(event) => {
                        const nextData = [...data.stackedData];
                        nextData[index] = { ...item, label: event.target.value };
                        onStackedDataChange(nextData);
                      }}
                    />
                  </Field>
                  <Field label="Primary Value">
                    <input
                      type="number"
                      className={inputClassName}
                      value={item.primaryValue}
                      onChange={(event) => {
                        const nextData = [...data.stackedData];
                        nextData[index] = {
                          ...item,
                          primaryValue: toSafeNumber(event.target.value)
                        };
                        onStackedDataChange(nextData);
                      }}
                    />
                  </Field>
                  <Field label="Secondary Value">
                    <input
                      type="number"
                      className={inputClassName}
                      value={item.secondaryValue}
                      onChange={(event) => {
                        const nextData = [...data.stackedData];
                        nextData[index] = {
                          ...item,
                          secondaryValue: toSafeNumber(event.target.value)
                        };
                        onStackedDataChange(nextData);
                      }}
                    />
                  </Field>
                  <Field label="Tertiary Value">
                    <input
                      type="number"
                      className={inputClassName}
                      value={item.tertiaryValue}
                      onChange={(event) => {
                        const nextData = [...data.stackedData];
                        nextData[index] = {
                          ...item,
                          tertiaryValue: toSafeNumber(event.target.value)
                        };
                        onStackedDataChange(nextData);
                      }}
                    />
                  </Field>
                </div>
                <button
                  type="button"
                  className={`${actionButtonClassName} mt-3 w-full`}
                  onClick={() =>
                    onStackedDataChange(data.stackedData.filter((_, itemIndex) => itemIndex !== index))
                  }
                >
                  Satiri sil
                </button>
              </div>
            ))}
            <button
              type="button"
              className={`${actionButtonClassName} w-full border-brand-blue/40 bg-brand-blue/10`}
              onClick={() =>
                onStackedDataChange([
                  ...data.stackedData,
                  {
                    label: `Yeni Donem ${data.stackedData.length + 1}`,
                    primaryValue: 0,
                    secondaryValue: 0,
                    tertiaryValue: 0
                  }
                ])
              }
            >
              Yeni satir ekle
            </button>
          </Section>

          <Section title="Pie Data Editor">
            {data.pieData.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3"
              >
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Name">
                    <input
                      className={inputClassName}
                      value={item.name}
                      onChange={(event) => {
                        const nextData = [...data.pieData];
                        nextData[index] = { ...item, name: event.target.value };
                        onPieDataChange(nextData);
                      }}
                    />
                  </Field>
                  <Field label="Value">
                    <input
                      type="number"
                      className={inputClassName}
                      value={item.value}
                      onChange={(event) => {
                        const nextData = [...data.pieData];
                        nextData[index] = { ...item, value: toSafeNumber(event.target.value) };
                        onPieDataChange(nextData);
                      }}
                    />
                  </Field>
                </div>
                <button
                  type="button"
                  className={`${actionButtonClassName} mt-3 w-full`}
                  onClick={() =>
                    onPieDataChange(data.pieData.filter((_, itemIndex) => itemIndex !== index))
                  }
                >
                  Kategoriyi sil
                </button>
              </div>
            ))}
            <button
              type="button"
              className={`${actionButtonClassName} w-full border-brand-green/40 bg-brand-green/10`}
              onClick={() =>
                onPieDataChange([
                  ...data.pieData,
                  {
                    name: `Kategori ${data.pieData.length + 1}`,
                    value: 0
                  }
                ])
              }
            >
              Yeni kategori ekle
            </button>
          </Section>

          <Section title="Area Data Editor">
            {data.areaData.map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3"
              >
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Label">
                    <input
                      className={inputClassName}
                      value={item.label}
                      onChange={(event) => {
                        const nextData = [...data.areaData];
                        nextData[index] = { ...item, label: event.target.value };
                        onAreaDataChange(nextData);
                      }}
                    />
                  </Field>
                  <Field label="Value">
                    <input
                      type="number"
                      className={inputClassName}
                      value={item.value}
                      onChange={(event) => {
                        const nextData = [...data.areaData];
                        nextData[index] = { ...item, value: toSafeNumber(event.target.value) };
                        onAreaDataChange(nextData);
                      }}
                    />
                  </Field>
                </div>
                <button
                  type="button"
                  className={`${actionButtonClassName} mt-3 w-full`}
                  onClick={() =>
                    onAreaDataChange(data.areaData.filter((_, itemIndex) => itemIndex !== index))
                  }
                >
                  Satiri sil
                </button>
              </div>
            ))}
            <button
              type="button"
              className={`${actionButtonClassName} w-full border-brand-navy/40 bg-brand-navy/10`}
              onClick={() =>
                onAreaDataChange([
                  ...data.areaData,
                  {
                    label: `Yeni Donem ${data.areaData.length + 1}`,
                    value: 0
                  }
                ])
              }
            >
              Yeni satir ekle
            </button>
          </Section>

          <Section title="Comparison Settings">
            <ComparisonResult
              stackedData={data.stackedData}
              settings={data.comparisonSettings}
              onSettingsChange={onComparisonSettingsChange}
              compact
            />
          </Section>

          <button
            type="button"
            onClick={onReset}
            className="w-full rounded-2xl border border-feedback-negative/40 bg-feedback-negative/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-feedback-negative/20"
          >
            Reset Demo Data
          </button>
        </div>
      </aside>
    </>
  );
}
