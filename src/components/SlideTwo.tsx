"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis
} from "recharts";

import { MethoddaLogo } from "@/components/MethoddaLogo";
import { ComparisonSettings, PresentationData } from "@/types/presentation";

interface SlideTwoProps {
  data: PresentationData;
  onChartTypeChange: (value: PresentationData["slideTwoChartType"]) => void;
  onComparisonSettingsChange: (value: ComparisonSettings) => void;
}

type ChartDatum = {
  year: string;
  totalLabel: string;
} & Record<string, number | string>;

interface ChartSeries {
  key: string;
  label: string;
  color: string;
  textColor?: string;
}

interface ChartCardConfig {
  title: string;
  data: ChartDatum[];
  series: ChartSeries[];
  badges: [string, string];
  valueSuffix?: string;
}

interface LabelRenderProps {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  value?: number | string | null;
}

const tooltipStyle = {
  borderRadius: "14px",
  border: "1px solid rgba(148, 163, 184, 0.24)",
  boxShadow: "0 10px 28px rgba(15, 23, 42, 0.12)",
  backgroundColor: "rgba(255, 255, 255, 0.96)"
};

const chartCards: ChartCardConfig[] = [
  {
    title: "Graph 1",
    badges: ["+41,18%", "+43,71%"],
    data: [
      { year: "2023", totalLabel: "23.553", sector: 21.512, participation: 2.041 },
      { year: "2024", totalLabel: "32.668", sector: 30.008, participation: 2.66 },
      { year: "2025", totalLabel: "46.947", sector: 42.62, participation: 4.327 }
    ],
    series: [
      { key: "sector", label: "Label A", color: "#104B7D" },
      { key: "participation", label: "Label B", color: "#00A450" }
    ]
  },
  {
    title: "Graph 2",
    badges: ["+23,06%", "+42,39%"],
    data: [
      { year: "2023", totalLabel: "620,8", sector: 567.5, participation: 53.3 },
      { year: "2024", totalLabel: "660,3", sector: 596.9, participation: 63.4 },
      { year: "2025", totalLabel: "940,2", sector: 854.6, participation: 85.6 }
    ],
    series: [
      { key: "sector", label: "Label A", color: "#104B7D" },
      { key: "participation", label: "Label B", color: "#00A450" }
    ]
  },
  {
    title: "Graph 3",
    badges: ["+41,47%", "+45,51%"],
    data: [
      { year: "2023", totalLabel: "11.987", sector: 10.956, participation: 1.031 },
      { year: "2024", totalLabel: "16.488", sector: 15.15, participation: 1.338 },
      { year: "2025", totalLabel: "23.992", sector: 21.849, participation: 2.143 }
    ],
    series: [
      { key: "sector", label: "Label A", color: "#104B7D" },
      { key: "participation", label: "Label B", color: "#00A450" }
    ]
  },
  {
    title: "Graph 4",
    badges: ["+23.394", "+14.279"],
    valueSuffix: "%",
    data: [
      {
        year: "2023",
        totalLabel: "23.553",
        deposit: 85.63,
        development: 5.71,
        participation: 8.67
      },
      {
        year: "2024",
        totalLabel: "32.668",
        deposit: 86.09,
        development: 5.76,
        participation: 8.14
      },
      {
        year: "2025",
        totalLabel: "46.947",
        deposit: 84.62,
        development: 6.16,
        participation: 9.22
      }
    ],
    series: [
      { key: "deposit", label: "Label C", color: "#104B7D" },
      { key: "development", label: "Label D", color: "#4F83BF" },
      { key: "participation", label: "Label E", color: "#7CCB5B", textColor: "#0F172A" }
    ]
  },
  {
    title: "Graph 5",
    badges: ["+12.374", "+8.323"],
    valueSuffix: "%",
    data: [
      { year: "2023", totalLabel: "14.852", deposit: 89.79, participation: 10.21 },
      { year: "2024", totalLabel: "18.903", deposit: 90.59, participation: 9.41 },
      { year: "2025", totalLabel: "27.226", deposit: 89.56, participation: 10.44 }
    ],
    series: [
      { key: "deposit", label: "Label C", color: "#104B7D" },
      { key: "participation", label: "Label E", color: "#7CCB5B", textColor: "#0F172A" }
    ]
  },
  {
    title: "Graph 6",
    badges: ["+12.005", "+7.504"],
    valueSuffix: "%",
    data: [
      {
        year: "2023",
        totalLabel: "11.987",
        deposit: 84.57,
        development: 6.82,
        participation: 8.6
      },
      {
        year: "2024",
        totalLabel: "16.488",
        deposit: 84.91,
        development: 6.97,
        participation: 8.11
      },
      {
        year: "2025",
        totalLabel: "23.992",
        deposit: 83.92,
        development: 7.14,
        participation: 8.93
      }
    ],
    series: [
      { key: "deposit", label: "Label C", color: "#104B7D" },
      { key: "development", label: "Label D", color: "#4F83BF" },
      { key: "participation", label: "Label E", color: "#7CCB5B", textColor: "#0F172A" }
    ]
  }
];

function formatValue(value: number, suffix?: string): string {
  const isInteger = Number.isInteger(value);
  const formatted = new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: isInteger ? 0 : 1,
    maximumFractionDigits: isInteger ? 0 : 2
  }).format(value);

  return suffix ? `${formatted}${suffix}` : formatted;
}

function toChartNumber(value: number | string | undefined): number {
  return typeof value === "number" ? value : Number(value ?? 0);
}

function renderSegmentLabel(
  props: LabelRenderProps,
  suffix?: string,
  textColor = "#FFFFFF"
) {
  const x = toChartNumber(props.x);
  const y = toChartNumber(props.y);
  const width = toChartNumber(props.width);
  const height = toChartNumber(props.height);
  const { value } = props;

  if (typeof value !== "number" || height < 16 || width < 28) {
    return null;
  }

  return (
    <text
      x={x + width / 2}
      y={y + height / 2 + 3}
      fill={textColor}
      fontSize={10}
      fontWeight={700}
      textAnchor="middle"
    >
      {formatValue(value, suffix)}
    </text>
  );
}

function renderTopLabel(props: LabelRenderProps) {
  const x = toChartNumber(props.x);
  const y = toChartNumber(props.y);
  const width = toChartNumber(props.width);
  const { value } = props;

  if (typeof value !== "string" && typeof value !== "number") {
    return null;
  }

  return (
    <text
      x={x + width / 2}
      y={y - 8}
      fill="#0F172A"
      fontSize={10}
      fontWeight={700}
      textAnchor="middle"
    >
      {value}
    </text>
  );
}

function StackedChartCard({
  title,
  data,
  series,
  badges,
  valueSuffix,
  isMounted
}: ChartCardConfig & { isMounted: boolean }) {
  return (
    <article className="flex min-h-0 flex-col border border-slate-100 bg-white px-3 py-3 shadow-[0_3px_10px_rgba(15,23,42,0.03)]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[clamp(0.8rem,0.85vw,0.92rem)] font-semibold tracking-tight text-[#148272]">
          {title}
        </h3>
      </div>

      <div className="mt-2 flex items-center gap-2 text-[9px] font-semibold">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">{badges[0]}</span>
        <span className="rounded-full bg-[#148272] px-2.5 py-1 text-white">{badges[1]}</span>
      </div>

      <div className="mt-2 min-h-0 flex-1">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 24, right: 6, left: 6, bottom: 0 }} barSize={52}>
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="year"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#0F172A", fontSize: 10, fontWeight: 700 }}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) => [
                  typeof value === "number" ? formatValue(value, valueSuffix) : String(value ?? ""),
                  String(name ?? "")
                ]}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="square"
                wrapperStyle={{ fontSize: "9px", lineHeight: "12px", paddingTop: "12px" }}
                formatter={(value) => (
                  <span className="text-[9px] font-semibold text-slate-600">{value}</span>
                )}
              />

              {series.map((item, index) => (
                <Bar
                  key={item.key}
                  dataKey={item.key}
                  name={item.label}
                  stackId="chart-stack"
                  fill={item.color}
                  radius={index === series.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]}
                >
                  <LabelList
                    content={(props) =>
                      renderSegmentLabel(props as LabelRenderProps, valueSuffix, item.textColor)
                    }
                  />
                  {index === series.length - 1 ? (
                    <LabelList
                      dataKey="totalLabel"
                      content={(props) => renderTopLabel(props as LabelRenderProps)}
                    />
                  ) : null}
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full min-h-[180px] items-center justify-center border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
            Grafik yukleniyor...
          </div>
        )}
      </div>
    </article>
  );
}

export function SlideTwo({
  data: _data,
  onChartTypeChange: _onChartTypeChange,
  onComparisonSettingsChange: _onComparisonSettingsChange
}: SlideTwoProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="h-full bg-white p-4">
      <div className="flex h-full flex-col">
        <div className="inline-flex max-w-max items-center rounded-r-full bg-[linear-gradient(90deg,#104B7D_0%,#2B7D8D_45%,#EAF4F4_100%)] px-4 py-2 text-[clamp(0.88rem,0.95vw,1rem)] font-semibold text-white shadow-soft">
          Katilim Bankaciliginin Sektor Icinde Buyuyen Payi
        </div>

        <div className="mt-4 grid min-h-0 flex-1 grid-cols-3 gap-2">
          {chartCards.map((chart) => (
            <StackedChartCard key={chart.title} {...chart} isMounted={isMounted} />
          ))}
        </div>

        <div className="mt-2 flex items-end justify-between gap-6 text-[9px] leading-4 text-slate-500">
          <div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p>*Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p>Kaynak: Lorem ipsum dolor sit amet</p>
          </div>
          <div className="flex items-center gap-3">
            <MethoddaLogo title="Methodda logo" className="h-7 w-auto object-contain" />
            <span className="text-base font-semibold text-brand-navy">02</span>
          </div>
        </div>
      </div>
    </section>
  );
}
