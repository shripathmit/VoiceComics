import type { FacialExpression } from "@voicecomics/types";
import { INK } from "../sketchFilter";

const HEAD_R = 26;

function Hair({ cx, cy }: { cx: number; cy: number }) {
  return (
    <path
      d={`M${cx - HEAD_R},${cy - 4} Q${cx - HEAD_R - 2},${cy - HEAD_R - 10} ${cx},${cy - HEAD_R - 8}
          Q${cx + HEAD_R + 2},${cy - HEAD_R - 10} ${cx + HEAD_R},${cy - 4}
          Q${cx + HEAD_R - 4},${cy - HEAD_R + 2} ${cx},${cy - HEAD_R + 4}
          Q${cx - HEAD_R + 4},${cy - HEAD_R + 2} ${cx - HEAD_R},${cy - 4} Z`}
      fill={INK}
      stroke="none"
    />
  );
}

function features(expression: FacialExpression, cx: number, cy: number) {
  switch (expression) {
    case "EXPR_SUBTLE_SMILE":
      return (
        <>
          <path d={`M${cx - 10},${cy - 3} q3,-3 6,0`} />
          <path d={`M${cx + 4},${cy - 3} q3,-3 6,0`} />
          <path d={`M${cx - 9},${cy + 9} q9,7 18,0`} />
        </>
      );
    case "EXPR_SKEPTICAL":
      return (
        <>
          <line x1={cx - 12} y1={cy - 8} x2={cx - 3} y2={cy - 5} />
          <line x1={cx + 12} y1={cy - 9} x2={cx + 3} y2={cy - 10} />
          <circle cx={cx - 7} cy={cy - 1} r={1.6} fill={INK} stroke="none" />
          <circle cx={cx + 7} cy={cy - 2} r={1.6} fill={INK} stroke="none" />
          <path d={`M${cx - 8},${cy + 11} q8,1 16,-1`} />
        </>
      );
    case "EXPR_ANNOYED":
      return (
        <>
          <line x1={cx - 13} y1={cy - 4} x2={cx - 3} y2={cy - 9} />
          <line x1={cx + 13} y1={cy - 4} x2={cx + 3} y2={cy - 9} />
          <circle cx={cx - 7} cy={cy - 1} r={1.6} fill={INK} stroke="none" />
          <circle cx={cx + 7} cy={cy - 1} r={1.6} fill={INK} stroke="none" />
          <path d={`M${cx - 8},${cy + 12} q8,-4 16,0`} />
        </>
      );
    case "EXPR_SURPRISED":
      return (
        <>
          <path d={`M${cx - 12},${cy - 7} q4,-4 8,0`} />
          <path d={`M${cx + 4},${cy - 7} q4,-4 8,0`} />
          <circle cx={cx - 7} cy={cy - 1} r={2.4} fill={INK} stroke="none" />
          <circle cx={cx + 7} cy={cy - 1} r={2.4} fill={INK} stroke="none" />
          <circle cx={cx} cy={cy + 11} r={3.5} />
        </>
      );
    case "EXPR_NEUTRAL":
    default:
      return (
        <>
          <line x1={cx - 12} y1={cy - 6} x2={cx - 3} y2={cy - 6} />
          <line x1={cx + 12} y1={cy - 6} x2={cx + 3} y2={cy - 6} />
          <circle cx={cx - 7} cy={cy - 1} r={1.6} fill={INK} stroke="none" />
          <circle cx={cx + 7} cy={cy - 1} r={1.6} fill={INK} stroke="none" />
          <line x1={cx - 6} y1={cy + 11} x2={cx + 6} y2={cy + 11} />
        </>
      );
  }
}

export function Face({
  center,
  expression,
}: {
  center: { x: number; y: number };
  expression: FacialExpression;
}) {
  return (
    <g filter="url(#sketchy)" stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round">
      <circle cx={center.x} cy={center.y} r={HEAD_R} />
      <Hair cx={center.x} cy={center.y} />
      {features(expression, center.x, center.y)}
    </g>
  );
}
