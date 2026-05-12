"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PptxGenJS from "pptxgenjs";

const SLIDE_WIDTH = 1920;
const SLIDE_HEIGHT = 1080;
const PPTX_WIDTH = 13.333;
const PPTX_HEIGHT = 7.5;

async function waitForRender(): Promise<void> {
  if (typeof document !== "undefined" && "fonts" in document) {
    await document.fonts.ready;
  }

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

async function captureSlide(node: HTMLElement): Promise<string> {
  await waitForRender();

  const rect = node.getBoundingClientRect();
  const captureWidth = Math.max(Math.round(rect.width || node.offsetWidth || SLIDE_WIDTH), 1);
  const captureHeight = Math.max(Math.round(rect.height || node.offsetHeight || SLIDE_HEIGHT), 1);
  const scale = Math.max(SLIDE_WIDTH / captureWidth, SLIDE_HEIGHT / captureHeight, 2);

  const canvas = await html2canvas(node, {
    scale,
    useCORS: true,
    backgroundColor: "#ffffff",
    width: captureWidth,
    height: captureHeight
  });

  return canvas.toDataURL("image/png", 1);
}

async function captureSlides(nodes: HTMLElement[]): Promise<string[]> {
  const images: string[] = [];

  for (const node of nodes) {
    images.push(await captureSlide(node));
  }

  return images;
}

export async function exportSlidesToPdf(nodes: HTMLElement[]): Promise<void> {
  const images = await captureSlides(nodes);
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [SLIDE_WIDTH, SLIDE_HEIGHT],
    compress: true
  });

  images.forEach((image, index) => {
    if (index > 0) {
      pdf.addPage([SLIDE_WIDTH, SLIDE_HEIGHT], "landscape");
    }

    pdf.addImage(image, "PNG", 0, 0, SLIDE_WIDTH, SLIDE_HEIGHT, undefined, "FAST");
  });

  pdf.save("methodda-interactive-presentation.pdf");
}

export async function exportSlidesToPptx(nodes: HTMLElement[]): Promise<void> {
  const images = await captureSlides(nodes);
  const pptx = new PptxGenJS();

  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Cursor";
  pptx.company = "Methodda";
  pptx.subject = "Interactive presentation export";
  pptx.title = "Methodda Interactive Presentation";

  images.forEach((image) => {
    const slide = pptx.addSlide();
    slide.background = { color: "FFFFFF" };
    slide.addImage({
      data: image,
      x: 0,
      y: 0,
      w: PPTX_WIDTH,
      h: PPTX_HEIGHT
    });
  });

  await pptx.writeFile({ fileName: "methodda-interactive-presentation.pptx" });
}
