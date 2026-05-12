import {
  AreaDatum,
  ChartType,
  ComparisonMetric,
  ComparisonSettings,
  PieDatum,
  PresentationData,
  PresentationWorkspace,
  PresentationYear,
  StackedDatum
} from "@/types/presentation";
import {
  DEFAULT_YEAR_LABELS,
  clonePresentationData,
  createDefaultPresentationWorkspace,
  createPresentationYear,
  createDefaultPresentationData,
  ensureComparisonSettings
} from "@/lib/defaultData";

export const STORAGE_KEY = "interactive-presentation-demo-data";

function isChartType(value: unknown): value is ChartType {
  return value === "stackedBar" || value === "pie" || value === "area";
}

function isMetric(value: unknown): value is ComparisonMetric {
  return (
    value === "primaryValue" ||
    value === "secondaryValue" ||
    value === "tertiaryValue"
  );
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function normalizeStackedData(value: unknown, fallback: StackedDatum[]): StackedDatum[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const normalized = value
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const candidate = item as Partial<StackedDatum>;

      return {
        label: asString(candidate.label, `Donem ${index + 1}`),
        primaryValue: asNumber(candidate.primaryValue, 0),
        secondaryValue: asNumber(candidate.secondaryValue, 0),
        tertiaryValue: asNumber(candidate.tertiaryValue, 0)
      };
    })
    .filter((item): item is StackedDatum => item !== null);

  return normalized.length > 0 ? normalized : fallback;
}

function normalizePieData(value: unknown, fallback: PieDatum[]): PieDatum[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const normalized = value
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const candidate = item as Partial<PieDatum>;

      return {
        name: asString(candidate.name, `Kategori ${index + 1}`),
        value: asNumber(candidate.value, 0)
      };
    })
    .filter((item): item is PieDatum => item !== null);

  if (normalized.length === 0) {
    return fallback;
  }

  const legacyLabelMap: Record<string, string> = {
    "Tamamlanan": "Label 1",
    "Devam Eden": "Label 2",
    "Bekleyen": "Label 3"
  };

  return normalized.map((item) => ({
    ...item,
    name: legacyLabelMap[item.name] ?? item.name
  }));
}

function normalizeAreaData(value: unknown, fallback: AreaDatum[]): AreaDatum[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const normalized = value
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const candidate = item as Partial<AreaDatum>;

      return {
        label: asString(candidate.label, `Donem ${index + 1}`),
        value: asNumber(candidate.value, 0)
      };
    })
    .filter((item): item is AreaDatum => item !== null);

  return normalized.length > 0 ? normalized : fallback;
}

function normalizeComparisonSettings(
  value: unknown,
  fallback: ComparisonSettings
): ComparisonSettings {
  if (!value || typeof value !== "object") {
    return fallback;
  }

  const candidate = value as Partial<ComparisonSettings>;

  return {
    columnA: asString(candidate.columnA, fallback.columnA),
    columnB: asString(candidate.columnB, fallback.columnB),
    metric: isMetric(candidate.metric) ? candidate.metric : fallback.metric
  };
}

export function normalizePresentationData(value: unknown): PresentationData {
  const fallback = createDefaultPresentationData();

  if (!value || typeof value !== "object") {
    return fallback;
  }

  const candidate = value as Partial<PresentationData>;
  const stackedData = normalizeStackedData(candidate.stackedData, fallback.stackedData);
  const comparisonSettings = ensureComparisonSettings(
    stackedData,
    normalizeComparisonSettings(candidate.comparisonSettings, fallback.comparisonSettings)
  );
  const normalizedMainTitle = (() => {
    const title = asString(candidate.mainTitle, fallback.mainTitle);
    const legacyTitleMap: Record<string, string> = {
      "Operasyon Performans Sunumu": "Sunum Baslik",
      "Demo Sunum": "Sunum Baslik"
    };

    return legacyTitleMap[title] ?? title;
  })();

  return {
    mainTitle: normalizedMainTitle,
    subtitle: asString(candidate.subtitle, fallback.subtitle),
    totalRequests: asNumber(candidate.totalRequests, fallback.totalRequests),
    activeRequests: asNumber(candidate.activeRequests, fallback.activeRequests),
    completedRequests: asNumber(candidate.completedRequests, fallback.completedRequests),
    averageResponseTime: asString(
      candidate.averageResponseTime,
      fallback.averageResponseTime
    ),
    satisfactionRate: asNumber(candidate.satisfactionRate, fallback.satisfactionRate),
    slideOneChartType: isChartType(candidate.slideOneChartType)
      ? candidate.slideOneChartType
      : fallback.slideOneChartType,
    slideTwoChartType: isChartType(candidate.slideTwoChartType)
      ? candidate.slideTwoChartType
      : fallback.slideTwoChartType,
    stackedData,
    pieData: normalizePieData(candidate.pieData, fallback.pieData),
    areaData: normalizeAreaData(candidate.areaData, fallback.areaData),
    comparisonSettings
  };
}

function normalizePresentationYear(value: unknown, fallbackLabel: string): PresentationYear | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<PresentationYear>;
  const label = asString(candidate.label, fallbackLabel);
  const data = normalizePresentationData(candidate.data);

  return {
    id: asString(candidate.id, `year-${label}`),
    label,
    data: clonePresentationData(data)
  };
}

function ensureWorkspaceYears(
  years: PresentationYear[],
  activeYearId: string
): PresentationWorkspace {
  const sourceYear = years.find((year) => year.id === activeYearId) ?? years[0];

  const requiredYears = DEFAULT_YEAR_LABELS.map((label) => {
    const existing = years.find((year) => year.label === label);
    return existing ?? createPresentationYear(label, clonePresentationData(sourceYear.data));
  });

  const extraYears = years.filter((year) => !DEFAULT_YEAR_LABELS.includes(year.label as never));
  const mergedYears = [...requiredYears, ...extraYears];
  const nextActiveYearId = mergedYears.some((year) => year.id === activeYearId)
    ? activeYearId
    : requiredYears[0].id;

  return {
    activeYearId: nextActiveYearId,
    years: mergedYears
  };
}

export function normalizePresentationWorkspace(value: unknown): PresentationWorkspace {
  const fallback = createDefaultPresentationWorkspace();

  if (!value || typeof value !== "object") {
    return fallback;
  }

  const candidate = value as Partial<PresentationWorkspace> & {
    years?: unknown;
  };

  if (!Array.isArray(candidate.years)) {
    const legacyData = normalizePresentationData(value);
    const legacyYear = createPresentationYear(DEFAULT_YEAR_LABELS[0], legacyData);

    return ensureWorkspaceYears([legacyYear], legacyYear.id);
  }

  const years = candidate.years
    .map((year, index) => normalizePresentationYear(year, String(2025 + index)))
    .filter((year): year is PresentationYear => year !== null);

  if (years.length === 0) {
    return fallback;
  }

  const activeYearId = years.some((year) => year.id === candidate.activeYearId)
    ? (candidate.activeYearId as string)
    : years[0].id;

  return ensureWorkspaceYears(years, activeYearId);
}

export function loadPresentationWorkspace(): PresentationWorkspace | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    return normalizePresentationWorkspace(JSON.parse(rawValue));
  } catch {
    return null;
  }
}

export function savePresentationWorkspace(data: PresentationWorkspace): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearPresentationData(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
