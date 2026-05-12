"use client";

import { useEffect, useId, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import {
  AreaDatum,
  ChartType,
  PieDatum,
  StackedDatum
} from "@/types/presentation";

interface DynamicChartProps {
  chartType: ChartType;
  stackedData: StackedDatum[];
  pieData: PieDatum[];
  areaData: AreaDatum[];
}

const pieColors = ["#05529A", "#00A450", "#104B7D", "#92D051"];

const tooltipStyle = {
  borderRadius: "16px",
  border: "1px solid rgba(148, 163, 184, 0.24)",
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
  backgroundColor: "rgba(255, 255, 255, 0.96)"
};

export function DynamicChart({
  chartType,
  stackedData,
  pieData,
  areaData
}: DynamicChartProps) {
  const gradientId = useId().replace(/:/g, "");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-full min-h-[280px] w-full items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-white text-sm text-slate-400">
        Grafik yukleniyor...
      </div>
    );
  }

  return (
    <div className="h-full min-h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "stackedBar" ? (
          <BarChart data={stackedData} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#dbe5ef" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#64748B", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748B", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            <Bar
              dataKey="primaryValue"
              stackId="total"
              name="Primary Value"
              fill="#05529A"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="secondaryValue"
              stackId="total"
              name="Secondary Value"
              fill="#00A450"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="tertiaryValue"
              stackId="total"
              name="Tertiary Value"
              fill="#104B7D"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        ) : chartType === "pie" ? (
          <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="48%"
              outerRadius="72%"
              innerRadius="42%"
              paddingAngle={3}
              label={({ name, percent }) =>
                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {pieData.map((entry, index) => (
                <Cell key={`${entry.name}-${index}`} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
          </PieChart>
        ) : (
          <AreaChart data={areaData} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#05529A" stopOpacity={0.36} />
                <stop offset="100%" stopColor="#05529A" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#dbe5ef" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#64748B", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748B", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#05529A"
              strokeWidth={3}
              fill={`url(#${gradientId})`}
              activeDot={{ r: 6, fill: "#00A450", stroke: "#ffffff", strokeWidth: 2 }}
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
