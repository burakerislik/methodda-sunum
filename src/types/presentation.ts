export type ChartType = "stackedBar" | "pie" | "area";

export type ComparisonMetric =
  | "primaryValue"
  | "secondaryValue"
  | "tertiaryValue";

export interface StackedDatum {
  label: string;
  primaryValue: number;
  secondaryValue: number;
  tertiaryValue: number;
}

export interface PieDatum {
  name: string;
  value: number;
}

export interface AreaDatum {
  label: string;
  value: number;
}

export interface ComparisonSettings {
  columnA: string;
  columnB: string;
  metric: ComparisonMetric;
}

export interface PresentationData {
  mainTitle: string;
  subtitle: string;
  totalRequests: number;
  activeRequests: number;
  completedRequests: number;
  averageResponseTime: string;
  satisfactionRate: number;
  slideOneChartType: ChartType;
  slideTwoChartType: ChartType;
  stackedData: StackedDatum[];
  pieData: PieDatum[];
  areaData: AreaDatum[];
  comparisonSettings: ComparisonSettings;
}

export interface PresentationYear {
  id: string;
  label: string;
  data: PresentationData;
}

export interface PresentationWorkspace {
  activeYearId: string;
  years: PresentationYear[];
}
