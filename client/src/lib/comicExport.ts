const PANEL_W = 400;
const PANEL_H = 500;
const CELL_GAP = 12;
const TITLE_HEIGHT = 60;
const MAX_COLS = 3;

function svgToDataUrl(svg: SVGSVGElement): string {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("width", String(PANEL_W));
  clone.setAttribute("height", String(PANEL_H));
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const markup = new XMLSerializer().serializeToString(clone);
  const encoded = btoa(unescape(encodeURIComponent(markup)));
  return `data:image/svg+xml;base64,${encoded}`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Composites the given panel SVG elements into a single comic-strip PNG,
 * using only built-in browser APIs (XMLSerializer + canvas) — no library.
 */
export async function exportComicStripPng(svgElements: SVGSVGElement[], title: string): Promise<string> {
  const cols = Math.min(MAX_COLS, Math.max(1, svgElements.length));
  const rows = Math.ceil(svgElements.length / cols);

  const canvas = document.createElement("canvas");
  canvas.width = cols * PANEL_W + (cols + 1) * CELL_GAP;
  canvas.height = TITLE_HEIGHT + rows * PANEL_H + (rows + 1) * CELL_GAP;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  ctx.fillStyle = "#f5f1e6";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#1c1c1c";
  ctx.font = "bold 28px 'Comic Sans MS', 'Chalkboard SE', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(title, canvas.width / 2, 40);

  const images = await Promise.all(svgElements.map((el) => loadImage(svgToDataUrl(el))));

  images.forEach((img, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = CELL_GAP + col * (PANEL_W + CELL_GAP);
    const y = TITLE_HEIGHT + CELL_GAP + row * (PANEL_H + CELL_GAP);
    ctx.drawImage(img, x, y, PANEL_W, PANEL_H);
  });

  return canvas.toDataURL("image/png");
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
