import type { SpeechBubble as SpeechBubbleData } from "@voicecomics/types";
import { INK, PAPER } from "../../assets/svg/sketchFilter";
import { wrapText } from "./textWrap";

const PANEL_W = 400;
const LINE_HEIGHT = 20;
const MAX_CHARS_PER_LINE = 28;
const PAD_X = 18;
const PAD_Y = 14;
const BUBBLE_TOP = 26;

const BUBBLE_STYLE: Record<SpeechBubbleData["bubble_type"], { rx: number; dash?: string; strokeWidth: number }> = {
  STANDARD_ROUND: { rx: 18, strokeWidth: 2.5 },
  SHARP_ANNOYED: { rx: 4, strokeWidth: 3 },
  HESITANT_WAVY: { rx: 18, dash: "5 4", strokeWidth: 2.2 },
};

export function SpeechBubble({ bubble }: { bubble: SpeechBubbleData }) {
  const lines = wrapText(bubble.text, MAX_CHARS_PER_LINE);
  const longestLine = Math.max(...lines.map((l) => l.length), 8);
  const width = Math.min(PANEL_W - 40, Math.max(140, longestLine * 8.2 + PAD_X * 2));
  const height = lines.length * LINE_HEIGHT + PAD_Y * 2;
  const x = (PANEL_W - width) / 2;
  const y = BUBBLE_TOP;

  const style = BUBBLE_STYLE[bubble.bubble_type] ?? BUBBLE_STYLE.STANDARD_ROUND;
  const tailTargetX = bubble.tail_anchor.x * PANEL_W;
  const tailTargetY = bubble.tail_anchor.y * 500;
  const tailBaseX = Math.min(Math.max(tailTargetX, x + 24), x + width - 24);
  const tailBaseY = y + height;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={style.rx}
        fill={PAPER}
        stroke={INK}
        strokeWidth={style.strokeWidth}
        strokeDasharray={style.dash}
        filter="url(#sketchy)"
      />
      <path
        d={`M${tailBaseX - 10},${tailBaseY - 2} L${tailTargetX},${tailTargetY} L${tailBaseX + 10},${tailBaseY - 2} Z`}
        fill={PAPER}
        stroke={INK}
        strokeWidth={style.strokeWidth}
        filter="url(#sketchy)"
      />
      <text x={x + width / 2} y={y + PAD_Y + 4} textAnchor="middle" className="font-sketch" fontSize={13} fill={INK}>
        <tspan x={x + width / 2} dy={0} fontWeight={700} fontSize={10} opacity={0.65}>
          {bubble.speaker.toUpperCase()}
        </tspan>
        {lines.map((line, i) => (
          <tspan key={i} x={x + width / 2} dy={i === 0 ? 16 : LINE_HEIGHT}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}
