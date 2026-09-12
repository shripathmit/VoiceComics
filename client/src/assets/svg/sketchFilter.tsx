/** Shared hand-drawn wobble filter — reused by every layer so lines read as one sketch style. */
export function SketchFilterDefs() {
  return (
    <defs>
      <filter id="sketchy" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="7" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  );
}

export const INK = "#1c1c1c";
export const PAPER = "#f5f1e6";
