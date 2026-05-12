"use client";

import { Building2, Percent, RefreshCcw } from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";

import { MethoddaLogo } from "@/components/MethoddaLogo";
import { ComparisonSettings, PresentationData } from "@/types/presentation";

interface SlideOneProps {
  data: PresentationData;
  onChartTypeChange: (value: PresentationData["slideOneChartType"]) => void;
  onComparisonSettingsChange: (value: ComparisonSettings) => void;
}

export function SlideOne({
  data,
  onChartTypeChange: _onChartTypeChange,
  onComparisonSettingsChange: _onComparisonSettingsChange
}: SlideOneProps) {
  const CENTER_X = "50%";
  const CENTER_Y = "50%";
  const CONNECTOR_RADIUS = 228;
  const ICON_RADIUS = 28;
  const TEXT_WIDTH = 180;
  const TEXT_GAP = 18;
  const pieItems =
    data.pieData.length > 0
      ? data.pieData
      : [
          { name: "Label 1", value: 60 },
          { name: "Label 2", value: 20 },
          { name: "Label 3", value: 20 }
        ];
  const totalValue = pieItems.reduce((sum, item) => sum + item.value, 0);
  const donutColors = ["#1F7AA5", "#3A9BD5", "#2EC0A7", "#92D051"];
  const totalForAngles = Math.max(totalValue, 1);

  let currentAngle = 90;
  const sliceAnchors = pieItems.map((item) => {
    const sliceAngle = (item.value / totalForAngles) * 360;
    const midAngle = currentAngle - sliceAngle / 2;
    currentAngle -= sliceAngle;

    const radians = (-midAngle * Math.PI) / 180;

    return {
      title: item.name,
      value: item.value,
      anchorX: Math.cos(radians) * CONNECTOR_RADIUS,
      anchorY: Math.sin(radians) * CONNECTOR_RADIUS
    };
  });

  const leftSlices = sliceAnchors
    .filter((item) => item.anchorX < 0)
    .sort((a, b) => a.anchorY - b.anchorY);
  const rightSlices = sliceAnchors
    .filter((item) => item.anchorX >= 0)
    .sort((a, b) => a.anchorY - b.anchorY);
  const fallbackSlices = [...sliceAnchors].sort((a, b) => a.anchorY - b.anchorY);

  const leftTopSlice = leftSlices[0] ?? fallbackSlices[0];
  const leftBottomSlice = leftSlices[1] ?? fallbackSlices[1] ?? fallbackSlices[0];
  const rightSlice = rightSlices[0] ?? fallbackSlices[fallbackSlices.length - 1];

  const calloutItems = [
    {
      key: "left-top",
      title: leftTopSlice.title,
      value: leftTopSlice.value,
      icon: RefreshCcw,
      align: "left" as const,
      iconCenterX: -336,
      iconCenterY: -176,
      anchorX: leftTopSlice.anchorX,
      anchorY: leftTopSlice.anchorY
    },
    {
      key: "left-bottom",
      title: leftBottomSlice.title,
      value: leftBottomSlice.value,
      icon: Percent,
      align: "left" as const,
      iconCenterX: -322,
      iconCenterY: 146,
      anchorX: leftBottomSlice.anchorX,
      anchorY: leftBottomSlice.anchorY
    },
    {
      key: "right",
      title: rightSlice.title,
      value: rightSlice.value,
      icon: Building2,
      align: "right" as const,
      iconCenterX: 322,
      iconCenterY: -18,
      anchorX: rightSlice.anchorX,
      anchorY: rightSlice.anchorY
    }
  ];

  const getConnectorStyle = (
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) => {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const length = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

    return {
      left: `calc(${CENTER_X} + ${startX}px)`,
      top: `calc(${CENTER_Y} + ${startY - 1}px)`,
      width: `${length}px`,
      transform: `rotate(${angle}deg)`
    };
  };

  const getConnectorEnd = (item: (typeof calloutItems)[number]) => ({
    x: item.align === "left" ? item.iconCenterX + ICON_RADIUS : item.iconCenterX - ICON_RADIUS,
    y: item.iconCenterY
  });

  const getConnectorJoint = (item: (typeof calloutItems)[number]) => {
    const end = getConnectorEnd(item);

    return {
      x: item.align === "left" ? end.x + 72 : end.x - 72,
      y: end.y
    };
  };

  const getIconStyle = (item: (typeof calloutItems)[number]) => ({
    left: `calc(${CENTER_X} + ${item.iconCenterX - ICON_RADIUS}px)`,
    top: `calc(${CENTER_Y} + ${item.iconCenterY - ICON_RADIUS}px)`
  });

  const getTextStyle = (item: (typeof calloutItems)[number]) => ({
    left:
      item.align === "left"
        ? `calc(${CENTER_X} + ${item.iconCenterX - ICON_RADIUS - TEXT_GAP - TEXT_WIDTH}px)`
        : `calc(${CENTER_X} + ${item.iconCenterX + ICON_RADIUS + TEXT_GAP}px)`,
    top: `calc(${CENTER_Y} + ${item.iconCenterY - 40}px)`,
    width: `${TEXT_WIDTH}px`
  });

  return (
    <section className="relative h-full overflow-hidden bg-[radial-gradient(circle_at_top,rgba(5,82,154,0.06),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] px-[2.1%] py-[1.5%]">
      <div className="relative h-full">
        <div className="absolute inset-x-0 top-0 text-center">
          <p className="text-[clamp(0.72rem,0.9vw,0.95rem)] font-medium text-slate-500">
            Lorem ipsum dolor sit amet
          </p>
          <h1 className="mt-2 text-[clamp(2.2rem,3vw,3.5rem)] font-semibold tracking-tight text-brand-green">
            {data.mainTitle}
          </h1>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(5,82,154,0.12),transparent_60%)] blur-2xl" />
            <div className="relative">
              <PieChart width={560} height={560}>
                <Pie
                  data={pieItems}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={135}
                  outerRadius={210}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  {pieItems.map((entry, index) => (
                    <Cell
                      key={`${entry.name}-${index}`}
                      fill={donutColors[index % donutColors.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
              <div className="absolute left-1/2 top-1/2 flex h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-white text-center shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                <p className="text-[1.1rem] font-semibold tracking-[0.02em] text-brand-navy">
                  TOPLAM
                </p>
                <p className="mt-2 text-[4rem] font-semibold leading-none tracking-tight text-brand-green">
                  %{totalValue}
                </p>
              </div>
            </div>
          </div>
        </div>

        {calloutItems.map((item) => {
          const joint = getConnectorJoint(item);
          const end = getConnectorEnd(item);

          return (
            <div key={`${item.key}-connector`}>
              <div
                className="absolute z-[1] h-[2px] origin-left bg-[#8AA4BC]"
                style={getConnectorStyle(item.anchorX, item.anchorY, joint.x, joint.y)}
              />
              <div
                className="absolute z-[1] h-[2px] origin-left bg-[#8AA4BC]"
                style={getConnectorStyle(joint.x, joint.y, end.x, end.y)}
              />
              <div
                className="absolute z-[1] h-[7px] w-[7px] rounded-full bg-[#8AA4BC]"
                style={{
                  left: `calc(${CENTER_X} + ${item.anchorX - 3.5}px)`,
                  top: `calc(${CENTER_Y} + ${item.anchorY - 3.5}px)`
                }}
              />
            </div>
          );
        })}

        {calloutItems.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.key}>
              <div
                className="absolute z-[2] flex h-14 w-14 items-center justify-center rounded-full border border-[#D7E3EE] bg-white text-brand-navy"
                style={getIconStyle(item)}
              >
                <Icon className="h-7 w-7 stroke-[1.7]" />
              </div>
              <div
                className={`absolute z-[2] ${item.align === "left" ? "text-right" : "text-left"}`}
                style={getTextStyle(item)}
              >
                <p className="text-[clamp(1.1rem,1.25vw,1.35rem)] font-semibold leading-tight text-brand-navy">
                  {item.title}
                </p>
                <p className="mt-4 text-[clamp(1.9rem,2.6vw,3rem)] font-semibold leading-none tracking-tight text-brand-green">
                  %{item.value}
                </p>
              </div>
            </div>
          );
        })}

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 text-[9px] leading-4 text-slate-500">
          <div>
            <p>Kaynak: Lorem ipsum dolor sit amet</p>
          </div>
          <div className="flex items-center gap-3">
            <MethoddaLogo title="Methodda logo" className="h-7 w-auto object-contain" />
            <span className="text-base font-semibold text-brand-navy">01</span>
          </div>
        </div>
      </div>
    </section>
  );
}
