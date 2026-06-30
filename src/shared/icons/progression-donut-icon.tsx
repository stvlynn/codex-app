// Restored from ref/webview/assets/progression-donut-BTBWT-Q8.js
// SVG progress donut component for showing completion percentage.

import clsx from "clsx";
export interface ProgressionDonutProps {
  className?: string;
  animateOnMount?: boolean;
  animateOnMountDelayMs?: number;
  percent: number;
  reducedMotion?: boolean;
  size?: number;
  strokeWidth?: number;
  transitionDurationMs?: number;
}
const DEFAULT_SIZE = 12;
const DEFAULT_STROKE_WIDTH = 2;
const DEFAULT_TRANSITION_MS = 120;
const MIN_PERCENT = 0;
const MAX_PERCENT = 100;
function clampPercent(value: number): number {
  if (!Number.isFinite(value) || value < MIN_PERCENT) return MIN_PERCENT;
  if (value > MAX_PERCENT) return MAX_PERCENT;
  return value;
}
export function ProgressionDonut(props: ProgressionDonutProps): JSX.Element {
  const {
    className,
    animateOnMount = false,
    animateOnMountDelayMs = 0,
    percent,
    reducedMotion = false,
    size = DEFAULT_SIZE,
    strokeWidth = DEFAULT_STROKE_WIDTH,
    transitionDurationMs = DEFAULT_TRANSITION_MS,
  } = props;
  const radius = (size - strokeWidth) / 2;
  const clampedPercent = clampPercent(percent);
  const dashOffset = MAX_PERCENT - clampedPercent;
  const viewBox = `0 0 ${size} ${size}`;
  const classNameResult = clsx("shrink-0", className);
  const shouldAnimateOnMount = animateOnMount && !reducedMotion;
  const fillClassName = clsx(shouldAnimateOnMount && "_fillOnMount_9hstz_1");
  const animationDelay = shouldAnimateOnMount
    ? `${animateOnMountDelayMs}ms`
    : undefined;
  const transition = reducedMotion
    ? "none"
    : `stroke-dashoffset ${transitionDurationMs}ms ease-out, opacity ${transitionDurationMs}ms ease-out`;
  const transform = `rotate(-90 ${size / 2} ${size / 2})`;
  const progressOpacity = clampedPercent === MIN_PERCENT ? 0 : 1;
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox={viewBox}
      className={classNameResult}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        opacity={0.16}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        opacity={progressOpacity}
        strokeLinecap="round"
        fill="none"
        pathLength={MAX_PERCENT}
        strokeDasharray={MAX_PERCENT}
        strokeDashoffset={dashOffset}
        className={fillClassName}
        style={{
          animationDelay,
          transition,
        }}
        transform={transform}
      />
    </svg>
  );
}
