import {
  ComparisonMetric,
  ComparisonSettings,
  PresentationData,
  PresentationWorkspace,
  PresentationYear,
  StackedDatum
} from "@/types/presentation";

const DEFAULT_STACKED_DATA: StackedDatum[] = [
  { label: "Ocak", primaryValue: 120, secondaryValue: 45, tertiaryValue: 20 },
  { label: "Subat", primaryValue: 160, secondaryValue: 35, tertiaryValue: 18 },
  { label: "Mart", primaryValue: 140, secondaryValue: 50, tertiaryValue: 25 },
  { label: "Nisan", primaryValue: 190, secondaryValue: 42, tertiaryValue: 30 }
];

const DEFAULT_COMPARISON: ComparisonSettings = {
  columnA: "Ocak",
  columnB: "Subat",
  metric: "primaryValue"
};

export const metricLabels: Record<ComparisonMetric, string> = {
  primaryValue: "Birincil Metrik",
  secondaryValue: "Ikincil Metrik",
  tertiaryValue: "Ucuncul Metrik"
};

export const chartTypeLabels = {
  stackedBar: "Stacked Bar Chart",
  pie: "Pie Chart",
  area: "Area Chart"
} as const;

export const DEFAULT_YEAR_LABELS = ["2023", "2024", "2025", "2026"] as const;

function createYearId(label: string): string {
  return `year-${label}`;
}

export function createDefaultPresentationData(): PresentationData {
  return {
    mainTitle: "Sunum Baslik",
    subtitle: "Canli duzenlenebilir interaktif demo dashboard",
    totalRequests: 1248,
    activeRequests: 86,
    completedRequests: 1162,
    averageResponseTime: "18 dk",
    satisfactionRate: 92,
    slideOneChartType: "stackedBar",
    slideTwoChartType: "pie",
    stackedData: DEFAULT_STACKED_DATA.map((item) => ({ ...item })),
    pieData: [
      { name: "Label 1", value: 64 },
      { name: "Label 2", value: 24 },
      { name: "Label 3", value: 12 }
    ],
    areaData: [
      { label: "Ocak", value: 120 },
      { label: "Subat", value: 160 },
      { label: "Mart", value: 145 },
      { label: "Nisan", value: 210 }
    ],
    comparisonSettings: { ...DEFAULT_COMPARISON }
  };
}

export function clonePresentationData(data: PresentationData): PresentationData {
  return {
    ...data,
    stackedData: data.stackedData.map((item) => ({ ...item })),
    pieData: data.pieData.map((item) => ({ ...item })),
    areaData: data.areaData.map((item) => ({ ...item })),
    comparisonSettings: { ...data.comparisonSettings }
  };
}

export function createPresentationYear(
  label: string,
  data: PresentationData = createDefaultPresentationData()
): PresentationYear {
  return {
    id: createYearId(label),
    label,
    data: clonePresentationData(data)
  };
}

export function createDefaultPresentationWorkspace(): PresentationWorkspace {
  const years = DEFAULT_YEAR_LABELS.map((label) => createPresentationYear(label));

  return {
    activeYearId: years[0].id,
    years
  };
}

export function ensureComparisonSettings(
  stackedData: StackedDatum[],
  comparisonSettings: ComparisonSettings
): ComparisonSettings {
  const fallbackLabels = stackedData.map((item) => item.label).filter(Boolean);
  const firstLabel = fallbackLabels[0] ?? "Veri 1";
  const secondLabel = fallbackLabels[1] ?? firstLabel;

  return {
    columnA: fallbackLabels.includes(comparisonSettings.columnA)
      ? comparisonSettings.columnA
      : firstLabel,
    columnB: fallbackLabels.includes(comparisonSettings.columnB)
      ? comparisonSettings.columnB
      : secondLabel,
    metric: comparisonSettings.metric ?? "primaryValue"
  };
}
