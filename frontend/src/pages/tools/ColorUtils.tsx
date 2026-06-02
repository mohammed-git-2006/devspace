import { useEffect, useState } from "react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface ColorFormats {
  hex: string;
  rgb: string;
  hsl: string;
  hsv: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function getComplementary(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
}

function generateTriadic(hex: string): string[] {
  const rgb = hexToRgb(hex);
  if (!rgb) return [hex];
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return [
    hex,
    hslToHex(((hsl.h + 120) % 360), hsl.s, hsl.l),
    hslToHex(((hsl.h + 240) % 360), hsl.s, hsl.l)
  ];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function getRelativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function generatePalette(hex: string): string[] {
  const rgb = hexToRgb(hex);
  if (!rgb) return [hex];
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const palette = [];
  for (let i = 1; i <= 9; i++) {
    const lightness = Math.max(5, Math.min(95, (i * 10)));
    palette.push(hslToHex(hsl.h, hsl.s, lightness));
  }
  return palette;
}

export default function ColorUtils() {
  const [color, setColor] = useState('#6A0DAD');
  const [formats, setFormats] = useState<ColorFormats>({
    hex: '#6A0DAD',
    rgb: 'rgb(106, 13, 173)',
    hsl: 'hsl(267, 86%, 36%)',
    hsv: 'hsv(267, 92%, 68%)'
  });
  const [palette, setPalette] = useState<string[]>([]);
  const [harmony, setHarmony] = useState<string[]>([]);
  const [contrast, setContrast] = useState(0);
  const [compareColor, setCompareColor] = useState('#FFFFFF');

  useEffect(() => {
    const rgb = hexToRgb(color);
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      setFormats({
        hex: color,
        rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
        hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`
      });
      setPalette(generatePalette(color));
      setHarmony(generateTriadic(color));
      setContrast(getContrastRatio(color, compareColor));
    }
  }, [color, compareColor]);

  const wcagAAScore = contrast >= 4.5;
  const wcagAAAScore = contrast >= 7;

  const outputData = {
    color: formats.hex,
    formats,
    contrast: contrast.toFixed(2),
    wcagAA: wcagAAScore ? 'PASS ✓' : 'FAIL ✗',
    wcagAAA: wcagAAAScore ? 'PASS ✓' : 'FAIL ✗',
    palette: palette.slice(2, 8),
    triadic: harmony
  };

  return (
    <div className="w-full h-full grid grid-cols-2 gap-5">
      
      {/* Output Section */}
      <div className="flex flex-col gap-2 max-h-[800px] overflow-y-scroll scrollbar-hide">
        <span className="font-bold td">
          <span>Color Information: </span>
        </span>

        <div className="flex flex-row gap-3">
          <div className="w-24 h-24 rounded-lg border-2 border-white/25" style={{ backgroundColor: color }}></div>
          <div className="flex flex-col gap-2 flex-1">
            <div className="text-sm">
              <span className="tl">Hex: </span>
              <span className="text-green-500 font-bold">{formats.hex}</span>
            </div>
            <div className="text-sm">
              <span className="tl">RGB: </span>
              <span className="text-green-500 font-bold">{formats.rgb}</span>
            </div>
            <div className="text-sm">
              <span className="tl">HSL: </span>
              <span className="text-green-500 font-bold">{formats.hsl}</span>
            </div>
            <div className="text-sm">
              <span className="tl">HSV: </span>
              <span className="text-green-500 font-bold">{formats.hsv}</span>
            </div>
          </div>
        </div>

        {/* Palette */}
        <div className="flex flex-col gap-2">
          <span className="text-sm tl font-semibold">Color Palette:</span>
          <div className="grid grid-cols-6 gap-2">
            {palette.map((c, i) => (
              <div
                key={i}
                onClick={() => setColor(c)}
                className="h-16 rounded-lg border border-white/25 cursor-pointer hover:border-white/50 transition"
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>

        {/* Harmony */}
        <div className="flex flex-col gap-2">
          <span className="text-sm tl font-semibold">Triadic Harmony:</span>
          <div className="flex flex-row gap-3">
            {harmony.map((c, i) => (
              <div
                key={i}
                onClick={() => setColor(c)}
                className="flex-1 h-20 rounded-lg border border-white/25 cursor-pointer hover:border-white/50 transition flex items-end justify-center pb-1 text-xs"
                style={{ backgroundColor: c }}
                title={c}
              >
                {c}
              </div>
            ))}
          </div>
        </div>

        {/* Contrast Checker */}
        <div className="flex flex-col gap-2">
          <span className="text-sm tl font-semibold">Contrast Ratio (WCAG):</span>
          <div className="bg-black/50 p-3 rounded-lg border border-white/25">
            <div className="text-sm mb-2">
              <span className="tl">Ratio: </span>
              <span className={contrast >= 7 ? 'text-green-500' : contrast >= 4.5 ? 'text-yellow-500' : 'text-red-500'}>
                {contrast.toFixed(2)}:1
              </span>
            </div>
            <div className="text-sm mb-2">
              <span className="tl">AA: </span>
              <span className={wcagAAScore ? 'text-green-500' : 'text-red-500'}>{wcagAAScore ? 'PASS ✓' : 'FAIL ✗'}</span>
            </div>
            <div className="text-sm">
              <span className="tl">AAA: </span>
              <span className={wcagAAAScore ? 'text-green-500' : 'text-red-500'}>{wcagAAAScore ? 'PASS ✓' : 'FAIL ✗'}</span>
            </div>
          </div>
        </div>

        <SyntaxHighlighter
          language="json"
          style={atomDark}
          customStyle={{ borderRadius: '0.5rem', padding: '0.5rem', maxHeight: '200px' }}
        >
          {JSON.stringify(outputData, null, 2)}
        </SyntaxHighlighter>
      </div>

      {/* Input Section */}
      <div className="flex flex-col gap-3 max-h-[800px] overflow-y-scroll scrollbar-hide">
        <span className="font-bold td">Color Tools:</span>

        {/* Main Color Picker */}
        <div className="flex flex-col gap-2">
          <label className="text-sm tl font-semibold">Primary Color:</label>
          <div className="flex flex-row gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-10 rounded-lg cursor-pointer border border-white/25"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => {
                if (e.target.value.startsWith('#')) setColor(e.target.value);
              }}
              className="flex-1 p-2 bg-black/80 rounded-lg border border-white/25 focus:outline-none td text-sm font-mono"
              placeholder="#000000"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(color);
              }}
              className="px-3 py-2 bg-[var(--accent)]/30 hover:bg-[var(--accent)]/50 rounded-lg text-[var(--accent)] transition text-sm font-semibold"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Compare Color */}
        <div className="flex flex-col gap-2">
          <label className="text-sm tl font-semibold">Compare Color (WCAG):</label>
          <div className="flex flex-row gap-2">
            <input
              type="color"
              value={compareColor}
              onChange={(e) => setCompareColor(e.target.value)}
              className="w-12 h-10 rounded-lg cursor-pointer border border-white/25"
            />
            <input
              type="text"
              value={compareColor}
              onChange={(e) => {
                if (e.target.value.startsWith('#')) setCompareColor(e.target.value);
              }}
              className="flex-1 p-2 bg-black/80 rounded-lg border border-white/25 focus:outline-none td text-sm font-mono"
              placeholder="#FFFFFF"
            />
          </div>
        </div>

        {/* Color Conversions */}
        <div className="flex flex-col gap-2">
          <label className="text-sm tl font-semibold">Conversions:</label>
          <div className="flex flex-col gap-2 bg-black/50 p-3 rounded-lg border border-white/25">
            <div className="flex flex-row justify-between items-center">
              <span className="text-xs tl">HEX:</span>
              <span
                onClick={() => navigator.clipboard.writeText(formats.hex)}
                className="text-xs text-green-500 cursor-pointer hover:text-green-400"
              >
                {formats.hex}
              </span>
            </div>
            <div className="flex flex-row justify-between items-center">
              <span className="text-xs tl">RGB:</span>
              <span
                onClick={() => navigator.clipboard.writeText(formats.rgb)}
                className="text-xs text-green-500 cursor-pointer hover:text-green-400"
              >
                {formats.rgb}
              </span>
            </div>
            <div className="flex flex-row justify-between items-center">
              <span className="text-xs tl">HSL:</span>
              <span
                onClick={() => navigator.clipboard.writeText(formats.hsl)}
                className="text-xs text-green-500 cursor-pointer hover:text-green-400"
              >
                {formats.hsl}
              </span>
            </div>
            <div className="flex flex-row justify-between items-center">
              <span className="text-xs tl">HSV:</span>
              <span
                onClick={() => navigator.clipboard.writeText(formats.hsv)}
                className="text-xs text-green-500 cursor-pointer hover:text-green-400"
              >
                {formats.hsv}
              </span>
            </div>
          </div>
        </div>

        {/* Generated Colors */}
        <div className="flex flex-col gap-2">
          <label className="text-sm tl font-semibold">Generated Colors:</label>
          <div className="bg-black/50 p-3 rounded-lg border border-white/25">
            <div className="mb-2">
              <span className="text-xs tl">Complementary:</span>
              <div
                className="mt-1 h-10 rounded border border-white/25 cursor-pointer flex items-center justify-center text-xs"
                style={{ backgroundColor: getComplementary(color) }}
                onClick={() => setColor(getComplementary(color))}
              >
                {getComplementary(color)}
              </div>
            </div>
            <div>
              <span className="text-xs tl">Shades (Light → Dark):</span>
              <div className="mt-1 flex flex-row gap-1">
                {generatePalette(color).slice(0, 5).map((c, i) => (
                  <div
                    key={i}
                    className="flex-1 h-6 rounded border border-white/25 cursor-pointer hover:border-white/50"
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-2">
          <label className="text-sm tl font-semibold">Quick Actions:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setColor('#FFFFFF')}
              className="px-2 py-2 bg-gray-700/50 hover:bg-gray-700 rounded text-xs td transition"
            >
              White
            </button>
            <button
              onClick={() => setColor('#000000')}
              className="px-2 py-2 bg-gray-700/50 hover:bg-gray-700 rounded text-xs td transition"
            >
              Black
            </button>
            <button
              onClick={() => setColor('#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase())}
              className="px-2 py-2 bg-gray-700/50 hover:bg-gray-700 rounded text-xs td transition"
            >
              Random
            </button>
            <button
              onClick={() => setColor('#6A0DAD')}
              className="px-2 py-2 bg-gray-700/50 hover:bg-gray-700 rounded text-xs td transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
