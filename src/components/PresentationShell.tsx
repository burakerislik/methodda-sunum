"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Menu,
  Presentation,
  RotateCcw,
  Settings2,
  X
} from "lucide-react";

import { BlankLogoSlide } from "@/components/BlankLogoSlide";
import { SlideOne } from "@/components/SlideOne";
import { SlideTwo } from "@/components/SlideTwo";
import { VariablesPage } from "@/components/VariablesPage";
import {
  clonePresentationData,
  createDefaultPresentationWorkspace,
  createDefaultPresentationData,
  createPresentationYear,
  ensureComparisonSettings
} from "@/lib/defaultData";
import {
  clearPresentationData,
  loadPresentationWorkspace,
  savePresentationWorkspace
} from "@/lib/storage";
import { exportSlidesToPdf } from "@/lib/exportSlides";
import {
  AreaDatum,
  ComparisonSettings,
  PieDatum,
  PresentationData,
  PresentationWorkspace,
  StackedDatum
} from "@/types/presentation";

function isInteractiveElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();
  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    target.isContentEditable
  );
}

export function PresentationShell() {
  const TOTAL_SLIDES = 20;
  const COLLAPSED_SIDEBAR_WIDTH = 56;
  const EXPANDED_SIDEBAR_WIDTH = 256;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isVariablesView, setIsVariablesView] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isPptxNoticeOpen, setIsPptxNoticeOpen] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<"pdf" | "pptx" | null>(null);
  const [exportViewportSize, setExportViewportSize] = useState({ width: 1920, height: 1080 });
  const [presentationWorkspace, setPresentationWorkspace] = useState<PresentationWorkspace>(
    createDefaultPresentationWorkspace
  );
  const exportSlideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const presentationViewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedWorkspace = loadPresentationWorkspace();
    if (storedWorkspace) {
      setPresentationWorkspace(storedWorkspace);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    savePresentationWorkspace(presentationWorkspace);
  }, [isHydrated, presentationWorkspace]);

  useEffect(() => {
    const node = presentationViewportRef.current;

    if (!node) {
      return;
    }

    const updateExportViewportSize = () => {
      const rect = node.getBoundingClientRect();

      if (rect.width > 0 && rect.height > 0) {
        setExportViewportSize({
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        });
      }
    };

    updateExportViewportSize();

    const resizeObserver = new ResizeObserver(() => {
      updateExportViewportSize();
    });

    resizeObserver.observe(node);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isInteractiveElement(event.target)) {
        return;
      }

      if (event.key === "ArrowRight") {
        if (!isVariablesView) {
          setCurrentSlide((prev) => Math.min(prev + 1, TOTAL_SLIDES - 1));
        }
      }

      if (event.key === "ArrowLeft") {
        if (!isVariablesView) {
          setCurrentSlide((prev) => Math.max(prev - 1, 0));
        }
      }

      if (event.key === "Escape") {
        setIsSidebarOpen(false);
        setIsExportMenuOpen(false);
        setIsPptxNoticeOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [TOTAL_SLIDES, isVariablesView]);

  const updateTextField = (
    field: "mainTitle" | "subtitle" | "averageResponseTime",
    value: string
  ) => {
    setPresentationWorkspace((prev) => ({
      ...prev,
      years: prev.years.map((year) =>
        year.id === prev.activeYearId
          ? {
              ...year,
              data: { ...year.data, [field]: value }
            }
          : year
      )
    }));
  };

  const updateNumberField = (
    field:
      | "totalRequests"
      | "activeRequests"
      | "completedRequests"
      | "satisfactionRate",
    value: number
  ) => {
    setPresentationWorkspace((prev) => ({
      ...prev,
      years: prev.years.map((year) =>
        year.id === prev.activeYearId
          ? {
              ...year,
              data: { ...year.data, [field]: value }
            }
          : year
      )
    }));
  };

  const updateStackedData = (nextData: StackedDatum[]) => {
    setPresentationWorkspace((prev) => ({
      ...prev,
      years: prev.years.map((year) =>
        year.id === prev.activeYearId
          ? {
              ...year,
              data: {
                ...year.data,
                stackedData: nextData,
                comparisonSettings: ensureComparisonSettings(
                  nextData,
                  year.data.comparisonSettings
                )
              }
            }
          : year
      )
    }));
  };

  const updatePieData = (nextData: PieDatum[]) => {
    setPresentationWorkspace((prev) => ({
      ...prev,
      years: prev.years.map((year) =>
        year.id === prev.activeYearId
          ? {
              ...year,
              data: { ...year.data, pieData: nextData }
            }
          : year
      )
    }));
  };

  const updateAreaData = (nextData: AreaDatum[]) => {
    setPresentationWorkspace((prev) => ({
      ...prev,
      years: prev.years.map((year) =>
        year.id === prev.activeYearId
          ? {
              ...year,
              data: { ...year.data, areaData: nextData }
            }
          : year
      )
    }));
  };

  const updateComparisonSettings = (nextSettings: ComparisonSettings) => {
    setPresentationWorkspace((prev) => ({
      ...prev,
      years: prev.years.map((year) =>
        year.id === prev.activeYearId
          ? {
              ...year,
              data: {
                ...year.data,
                comparisonSettings: ensureComparisonSettings(
                  year.data.stackedData,
                  nextSettings
                )
              }
            }
          : year
      )
    }));
  };

  const resetDemoData = () => {
    clearPresentationData();
    setPresentationWorkspace(createDefaultPresentationWorkspace());
  };

  const activeYear =
    presentationWorkspace.years.find((year) => year.id === presentationWorkspace.activeYearId) ??
    presentationWorkspace.years[0];
  const presentationData = activeYear.data;

  const handleSelectYear = (yearId: string) => {
    setPresentationWorkspace((prev) => ({
      ...prev,
      activeYearId: yearId
    }));
  };

  const handleAddYear = () => {
    setPresentationWorkspace((prev) => {
      const numericYears = prev.years
        .map((year) => Number.parseInt(year.label, 10))
        .filter((year) => Number.isFinite(year));
      const nextYearLabel = String(
        numericYears.length > 0 ? Math.max(...numericYears) + 1 : new Date().getFullYear() + 1
      );
      const sourceYear =
        prev.years.find((year) => year.id === prev.activeYearId) ?? prev.years[0];
      const newYear = createPresentationYear(nextYearLabel, clonePresentationData(sourceYear.data));

      return {
        activeYearId: newYear.id,
        years: [...prev.years, newYear]
      };
    });
  };

  const handleExport = async (format: "pdf" | "pptx") => {
    if (format === "pptx") {
      setIsPptxNoticeOpen(true);
      setIsExportMenuOpen(false);
      return;
    }

    const exportNodes = exportSlideRefs.current.slice(0, TOTAL_SLIDES).filter(
      (node): node is HTMLDivElement => node !== null
    );

    if (exportNodes.length !== TOTAL_SLIDES) {
      window.alert("Export icin slaytlar henuz hazir degil.");
      return;
    }

    try {
      setExportingFormat(format);
      await exportSlidesToPdf(exportNodes);
    } catch (error) {
      console.error("Export error:", error);
      window.alert("Export sirasinda bir hata olustu. Lutfen tekrar deneyin.");
    } finally {
      setExportingFormat(null);
      setIsExportMenuOpen(false);
    }
  };

  const slideNavItems = [
    {
      id: 0,
      title: "Slide 01",
      subtitle: "Genel performans ozeti"
    },
    {
      id: 1,
      title: "Slide 02",
      subtitle: "Detayli analiz gorunumu"
    },
    ...Array.from({ length: TOTAL_SLIDES - 2 }, (_, index) => ({
      id: index + 2,
      title: `Slide ${String(index + 3).padStart(2, "0")}`,
      subtitle: "Bos slayt"
    }))
  ];
  const isCollapsed = !isSidebarOpen;
  const railOffset = COLLAPSED_SIDEBAR_WIDTH;

  const renderSlideByIndex = (slideIndex: number, exportMode = false) => {
    if (slideIndex === 0) {
      return (
        <SlideOne
          data={presentationData}
          onChartTypeChange={
            exportMode
              ? () => undefined
              : (value) =>
                  setPresentationWorkspace((prev) => ({
                    ...prev,
                    years: prev.years.map((year) =>
                      year.id === prev.activeYearId
                        ? {
                            ...year,
                            data: { ...year.data, slideOneChartType: value }
                          }
                        : year
                    )
                  }))
          }
          onComparisonSettingsChange={
            exportMode ? () => undefined : updateComparisonSettings
          }
        />
      );
    }

    if (slideIndex === 1) {
      return (
        <SlideTwo
          data={presentationData}
          onChartTypeChange={
            exportMode
              ? () => undefined
              : (value) =>
                  setPresentationWorkspace((prev) => ({
                    ...prev,
                    years: prev.years.map((year) =>
                      year.id === prev.activeYearId
                        ? {
                            ...year,
                            data: { ...year.data, slideTwoChartType: value }
                          }
                        : year
                    )
                  }))
          }
          onComparisonSettingsChange={
            exportMode ? () => undefined : updateComparisonSettings
          }
        />
      );
    }

    return <BlankLogoSlide slideNumber={slideIndex + 1} />;
  };

  return (
    <main className="relative flex h-screen w-screen items-center justify-start overflow-hidden bg-slate-950 bg-mesh-grid text-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,42,0.86),rgba(2,6,23,0.98))]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:84px_84px]" />

      <div
        className={`absolute inset-0 z-20 bg-slate-950/30 transition ${
          isSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside
        className="fixed left-0 top-0 z-50 isolate flex h-screen flex-col overflow-x-hidden border-r border-[#D7E3EE] bg-white shadow-[8px_0_40px_-14px_rgba(15,23,42,0.12)] transition-all duration-300"
        style={{ width: isCollapsed ? `${COLLAPSED_SIDEBAR_WIDTH}px` : `${EXPANDED_SIDEBAR_WIDTH}px` }}
      >
        <div className="p-3 flex-shrink-0">
          <div className="space-y-2">
            <div
              className={`flex ${isCollapsed ? "flex-col items-center gap-2.5" : "items-center space-x-2.5"}`}
            >
              {!isCollapsed ? (
                <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-semibold text-[#104B7D]">
                    {presentationData.mainTitle}
                  </div>
                  <div className="mt-0.5 truncate text-xs font-medium text-[#64748B]">
                    Interactive Demo
                  </div>
                </div>
              ) : null}

              <div className="flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen((prev) => !prev)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#05529A] text-white transition hover:bg-[#00A450]"
                  aria-label={isSidebarOpen ? "Sidebar kapat" : "Sidebar ac"}
                >
                  {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-[#D7E3EE]" />

        <nav className="flex min-h-0 flex-1 flex-col p-3">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="space-y-1.5">
              {slideNavItems.map((item) => {
                const isActive = currentSlide === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCurrentSlide(item.id);
                      setIsVariablesView(false);
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all ${
                      !isVariablesView && isActive
                        ? "bg-[#05529A] text-white hover:bg-[#05529A] hover:text-white"
                        : "text-[#104B7D] hover:bg-[#92D051] hover:text-[#104B7D]"
                    } ${isCollapsed ? "justify-center px-2" : "justify-start"}`}
                    title={isCollapsed ? `Sayfa ${item.id + 1}` : undefined}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                        !isVariablesView && isActive
                          ? "bg-white/20 text-white"
                          : "bg-[#EAF1F7] text-[#05529A]"
                      }`}
                    >
                      {item.id + 1}
                    </span>
                    {!isCollapsed ? (
                      <span className="flex-1 text-left">{`Sayfa ${item.id + 1}`}</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <div className="mb-2 h-px bg-[#D7E3EE]" />

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  if (isCollapsed) {
                    setIsSidebarOpen(true);
                    setIsExportMenuOpen(true);
                    return;
                  }
                  setIsExportMenuOpen((prev) => !prev);
                }}
                className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all text-[#104B7D] hover:bg-[#92D051] hover:text-[#104B7D] ${
                  isCollapsed ? "justify-center px-2" : "justify-between"
                }`}
                title={isCollapsed ? "Export" : undefined}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 shrink-0" />
                  {!isCollapsed ? <span className="text-left">Export</span> : null}
                </div>
                {!isCollapsed ? (
                  isExportMenuOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />
                ) : null}
              </button>

              {!isCollapsed && isExportMenuOpen ? (
                <div className="ml-5 mt-1 space-y-1">
                  <button
                    type="button"
                    onClick={() => void handleExport("pdf")}
                    disabled={exportingFormat !== null}
                    className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs font-semibold transition-all disabled:opacity-60 ${
                      exportingFormat === "pdf"
                        ? "bg-[#F8FAFC] text-[#05529A]"
                        : "bg-transparent text-[#104B7D] hover:bg-[#92D051] hover:text-[#104B7D]"
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5 shrink-0" />
                    <span className="flex-1 text-left">
                      {exportingFormat === "pdf" ? "PDF hazirlaniyor..." : "PDF"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleExport("pptx")}
                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs font-semibold text-[#104B7D] transition-all hover:bg-[#92D051] hover:text-[#104B7D]"
                  >
                    <Presentation className="h-3.5 w-3.5 shrink-0" />
                    <span className="flex-1 text-left">PPTX</span>
                  </button>
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => setIsVariablesView((prev) => !prev)}
                className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all ${
                  isVariablesView
                    ? "bg-[#00A450] text-white"
                    : "text-[#104B7D] hover:bg-[#92D051] hover:text-[#104B7D]"
                } ${isCollapsed ? "justify-center px-2" : "justify-start"}`}
                title={isCollapsed ? "Variables" : undefined}
              >
                <Settings2 className="h-4 w-4 shrink-0" />
                {!isCollapsed ? <span className="flex-1 text-left">Variables</span> : null}
              </button>

              <button
                type="button"
                onClick={resetDemoData}
                className={`flex w-full items-center gap-2.5 rounded-md bg-[#E84D4D] px-2.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-[#c83d3d] ${
                  isCollapsed ? "justify-center px-2" : "justify-start"
                }`}
                title={isCollapsed ? "Reset Demo Data" : undefined}
              >
                <RotateCcw className="h-4 w-4 shrink-0" />
                {!isCollapsed ? <span className="flex-1 text-left">Reset Demo Data</span> : null}
              </button>
            </div>
          </div>
        </nav>

        <div className="flex-shrink-0">
          <div className="border-t border-[#D7E3EE] p-3">
            <button
              type="button"
              onClick={() => {
                setCurrentSlide(0);
                setIsVariablesView(false);
              }}
              className="flex h-10 w-full items-center justify-center rounded-md bg-[#F8FAFC] text-[#104B7D] transition-all hover:bg-[#EAF6EE]"
              title={isCollapsed ? "Ana Sayfa" : undefined}
            >
              {isCollapsed ? (
                <img src="/icon.svg" alt="Methodda" className="h-6 w-6 object-contain" />
              ) : (
                <img src="/logo.svg" alt="Methodda" className="h-8 w-[108px] object-contain" />
              )}
            </button>
          </div>
        </div>
      </aside>

      <div
        ref={presentationViewportRef}
        className="relative z-10 aspect-video overflow-hidden bg-slate-50"
        style={{
          marginLeft: `${railOffset}px`,
          width: `min(calc(100vw - ${railOffset}px), 177.78vh)`
        }}
      >
        {isVariablesView ? (
          <VariablesPage
            years={presentationWorkspace.years}
            activeYearId={presentationWorkspace.activeYearId}
            data={presentationData}
            onSelectYear={handleSelectYear}
            onAddYear={handleAddYear}
            onTextFieldChange={updateTextField}
            onNumberFieldChange={updateNumberField}
            onSlideOneChartTypeChange={(value) =>
              setPresentationWorkspace((prev) => ({
                ...prev,
                years: prev.years.map((year) =>
                  year.id === prev.activeYearId
                    ? {
                        ...year,
                        data: { ...year.data, slideOneChartType: value }
                      }
                    : year
                )
              }))
            }
            onSlideTwoChartTypeChange={(value) =>
              setPresentationWorkspace((prev) => ({
                ...prev,
                years: prev.years.map((year) =>
                  year.id === prev.activeYearId
                    ? {
                        ...year,
                        data: { ...year.data, slideTwoChartType: value }
                      }
                    : year
                )
              }))
            }
            onStackedDataChange={updateStackedData}
            onPieDataChange={updatePieData}
            onAreaDataChange={updateAreaData}
            onComparisonSettingsChange={updateComparisonSettings}
            onReset={resetDemoData}
          />
        ) : (
          <>
            <div
              className="flex h-full transition-transform duration-500 ease-out"
              style={{
                width: `${TOTAL_SLIDES * 100}%`,
                transform: `translateX(-${currentSlide * (100 / TOTAL_SLIDES)}%)`
              }}
            >
              {slideNavItems.map((item) => (
                <div
                  key={`visible-slide-${item.id}`}
                  className="h-full shrink-0"
                  style={{ width: `${100 / TOTAL_SLIDES}%` }}
                >
                  {renderSlideByIndex(item.id)}
                </div>
              ))}
            </div>

            <div className="absolute right-4 top-4 z-20 flex items-center justify-end">
              <div className="flex items-center gap-2 rounded-full border border-slate-200/40 bg-white/45 px-3 py-1.5 text-slate-500 opacity-55 shadow-soft backdrop-blur transition duration-200 hover:border-slate-200/80 hover:bg-white/90 hover:text-slate-700 hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/60 text-sm text-current transition hover:border-brand-blue hover:text-brand-blue disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={currentSlide === 0}
                  aria-label="Onceki sayfa"
                >
                  ←
                </button>
                <span className="min-w-[46px] text-center text-xs font-semibold text-current">
                  {currentSlide + 1} / {TOTAL_SLIDES}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, TOTAL_SLIDES - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/60 text-sm text-current transition hover:border-brand-blue hover:text-brand-blue disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={currentSlide === TOTAL_SLIDES - 1}
                  aria-label="Sonraki sayfa"
                >
                  →
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {isHydrated ? (
        <div className="pointer-events-none fixed left-[-10000px] top-0 z-[-1]" aria-hidden="true">
          {slideNavItems.map((item, index) => (
            <div
              key={`export-slide-${item.id}`}
              ref={(node) => {
                exportSlideRefs.current[index] = node;
              }}
              className={`${index > 0 ? "mt-8" : ""} overflow-hidden bg-white`}
              style={{
                width: `${exportViewportSize.width}px`,
                height: `${exportViewportSize.height}px`
              }}
            >
              {renderSlideByIndex(item.id, true)}
            </div>
          ))}
        </div>
      ) : null}

      {isPptxNoticeOpen ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          onClick={() => setIsPptxNoticeOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.22)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pptx-notice-title"
            onClick={(event) => event.stopPropagation()}
          >
            <p
              id="pptx-notice-title"
              className="text-sm font-semibold uppercase tracking-[0.24em] text-[#05529A]"
            >
              PPTX Export
            </p>
            <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
              Gelistirme asamasinda
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              PPTX export su anda hazirlaniyor. Simdilik PDF export kullanabilirsiniz.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPptxNoticeOpen(false)}
                className="rounded-xl bg-[#05529A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#104B7D]"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      ) : null}

    </main>
  );
}
