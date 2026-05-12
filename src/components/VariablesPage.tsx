"use client";

import type { ReactNode } from "react";

import { ChartTypeSelect } from "@/components/ChartTypeSelect";
import { ComparisonResult } from "@/components/ComparisonResult";
import {
  AreaDatum,
  ComparisonSettings,
  PieDatum,
  PresentationData,
  PresentationYear,
  StackedDatum
} from "@/types/presentation";

interface VariablesPageProps {
  years: PresentationYear[];
  activeYearId: string;
  data: PresentationData;
  onSelectYear: (yearId: string) => void;
  onAddYear: () => void;
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
    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-soft">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#64748B]">
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
    <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600">
      <span className="uppercase tracking-[0.22em] text-slate-400">{label}</span>
      {children}
    </label>
  );
}

const inputClassName =
  "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20";

const actionButtonClassName =
  "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand-blue hover:text-brand-blue";

export function VariablesPage({
  years,
  activeYearId,
  data,
  onSelectYear,
  onAddYear,
  onTextFieldChange,
  onNumberFieldChange,
  onSlideOneChartTypeChange,
  onSlideTwoChartTypeChange: _onSlideTwoChartTypeChange,
  onStackedDataChange,
  onPieDataChange,
  onAreaDataChange,
  onComparisonSettingsChange,
  onReset
}: VariablesPageProps) {
  return (
    <section className="flex h-full flex-col bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FBFF_100%)]">
      <div className="border-b border-slate-200 px-[3.5%] py-[2.4%]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-blue">
          Variables
        </p>
        <h1 className="mt-3 text-[clamp(1.6rem,2vw,2.3rem)] font-semibold tracking-tight text-slate-950">
          Sunum degiskenleri
        </h1>
        <p className="mt-2 max-w-[70ch] text-sm leading-6 text-slate-500">
          Bu sayfada sunum verilerini, grafik tiplerini ve tum demo icerigini tek ekrandan
          duzenleyebilirsiniz. Yaptiginiz degisiklikler anlik uygulanir.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {years.map((year) => {
            const isActive = year.id === activeYearId;

            return (
              <button
                key={year.id}
                type="button"
                onClick={() => onSelectYear(year.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  isActive
                    ? "bg-brand-blue text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-brand-lime hover:text-brand-navy"
                }`}
              >
                {year.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={onAddYear}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand-blue hover:text-brand-blue"
          >
            + Yil Ekle
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-[3.5%] py-[2.4%]">
        <div className="grid gap-5 xl:grid-cols-[1.05fr_1fr]">
          <div className="space-y-5">
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
                  className={`${inputClassName} min-h-[96px] resize-y`}
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
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-500">
                Slide 2 artik sabit bir sektor karsilastirma sayfasi olarak tasarlandi.
              </div>
            </Section>

            <Section title="Comparison Settings">
              <ComparisonResult
                stackedData={data.stackedData}
                settings={data.comparisonSettings}
                onSettingsChange={onComparisonSettingsChange}
                compact
              />
            </Section>
          </div>

          <div className="space-y-5">
            <Section title="Stacked Bar Data">
              {data.stackedData.map((item, index) => (
                <div
                  key={`${item.label}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
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
                className={`${actionButtonClassName} w-full`}
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

            <Section title="Pie Data">
              {data.pieData.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
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
                className={`${actionButtonClassName} w-full`}
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

            <Section title="Area Data">
              {data.areaData.map((item, index) => (
                <div
                  key={`${item.label}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
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
                className={`${actionButtonClassName} w-full`}
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

            <button
              type="button"
              onClick={onReset}
              className="w-full rounded-2xl border border-[#E84D4D]/30 bg-[#E84D4D] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c83d3d]"
            >
              Reset Demo Data
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
