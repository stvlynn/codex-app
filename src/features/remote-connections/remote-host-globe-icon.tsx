// Restored from ref/webview/assets/remote-host-globe-icon-CG8BOH-9.js
// remote-host-globe-icon-CG8BOH-9 chunk restored from the Codex webview bundle.
import { S as useStoreValue } from "../../shared/boundaries/tanstack-query/vscode.ts";
import { J as persistedSignal } from "../../shared/utils/persisted-signal.tsx";
import { GlobeIcon } from "../../shared/icons/globe-icon.tsx";
interface HueRange {
  start: number;
  end: number;
}
interface ColorConfig {
  chroma: number;
  hue: number;
}
const hostColorMapSignal = persistedSignal<Record<string, string> | undefined>(
  "remote-host-globe-color-by-host-id",
  undefined,
);
const DEFAULT_FORBIDDEN_RANGES: HueRange[] = [
  {
    start: 330,
    end: 45,
  },
  {
    start: 95,
    end: 165,
  },
];
function assignHostColors(
  hostIds: string[],
  { forbiddenHueRanges = [] as HueRange[] } = {},
): Record<string, number> {
  const sortedIds = [...new Set(hostIds)].sort((a, b) => a.localeCompare(b));
  const availableRanges = computeAvailableRanges(forbiddenHueRanges);
  const totalRange = availableRanges.reduce(
    (sum, range) => sum + (range.end - range.start),
    0,
  );
  if (totalRange === 0) return {};
  const colorAssignments: Record<string, number> = {};
  sortedIds.forEach((id, index) => {
    colorAssignments[id] = mapHueToRange(
      ((index + 0.5) * totalRange) / sortedIds.length,
      availableRanges,
    );
  });
  return colorAssignments;
}
function computeAvailableRanges(forbiddenRanges: HueRange[]): HueRange[] {
  const normalized = forbiddenRanges
    .flatMap((range) => {
      const start = ((range.start % 360) + 360) % 360;
      const end = ((range.end % 360) + 360) % 360;
      return start <= end
        ? [
            {
              start,
              end,
            },
          ]
        : [
            {
              start,
              end: 360,
            },
            {
              start: 0,
              end,
            },
          ];
    })
    .sort((a, b) => a.start - b.start);
  if (normalized.length === 0)
    return [
      {
        start: 0,
        end: 360,
      },
    ];
  const merged: HueRange[] = [];
  normalized.forEach((range) => {
    const last = merged[merged.length - 1];
    if (!last || range.start > last.end) {
      merged.push(range);
      return;
    }
    last.end = Math.max(last.end, range.end);
  });
  const available: HueRange[] = [];
  let current = 0;
  merged.forEach((range) => {
    if (range.start > current) {
      available.push({
        start: current,
        end: range.start,
      });
    }
    current = range.end;
  });
  if (current < 360) {
    available.push({
      start: current,
      end: 360,
    });
  }
  return available;
}
function mapHueToRange(offset: number, ranges: HueRange[]): number {
  let remaining = offset;
  for (const range of ranges) {
    const size = range.end - range.start;
    if (remaining <= size) return range.start + remaining;
    remaining -= size;
  }
  return ranges[ranges.length - 1]?.end ?? 0;
}
function oklchToHex({ chroma, hue }: ColorConfig): string {
  const hueRad = (hue * Math.PI) / 180;
  const a = chroma * Math.cos(hueRad);
  const b = chroma * Math.sin(hueRad);
  const l = 0.74 + 0.3963377774 * a + 0.2158037573 * b;
  const m = 0.74 - 0.1055613458 * a - 0.0638541728 * b;
  const s = 0.74 - 0.0894841775 * a - 1.291485548 * b;
  const l3 = l ** 3;
  const m3 = m ** 3;
  const s3 = s ** 3;
  return `#${[4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3, -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3, -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3].map(toHexChannel).join("")}`;
}
function computeChroma({
  hostCount,
  hostIndex,
}: {
  hostCount: number;
  hostIndex: number;
}): number {
  return hostCount <= 1 ? 0.135 : 0.09 + (0.09 / (hostCount - 1)) * hostIndex;
}
export function buildHostColorMap(
  hostIds: string[],
  storedColors?: Record<string, string>,
): Record<string, string> {
  const hueAssignments = assignHostColors(hostIds, {
    forbiddenHueRanges: DEFAULT_FORBIDDEN_RANGES,
  });
  const sortedIds = Object.keys(hueAssignments).sort((a, b) =>
    a.localeCompare(b),
  );
  return Object.fromEntries(
    sortedIds.map((id, index) => [
      id,
      storedColors?.[id] ??
        oklchToHex({
          chroma: computeChroma({
            hostCount: sortedIds.length,
            hostIndex: index,
          }),
          hue: hueAssignments[id],
        }),
    ]),
  );
}
function toHexChannel(value: number): string {
  const gamma =
    value <= 0.0031308
      ? value * 12.92
      : 1.055 * value ** 0.4166666666666667 - 0.055;
  return Math.round(Math.min(1, Math.max(0, gamma)) * 255)
    .toString(16)
    .padStart(2, "0");
}
export interface RemoteHostGlobeIconProps {
  className?: string;
  hostId: string;
  hostIdsForColorAssignment: string[];
}
export function RemoteHostGlobeIcon({
  className,
  hostId,
  hostIdsForColorAssignment,
}: RemoteHostGlobeIconProps): JSX.Element {
  const storedColors = useStoreValue(hostColorMapSignal);
  const allHostIds = hostIdsForColorAssignment.includes(hostId)
    ? hostIdsForColorAssignment
    : [hostId, ...hostIdsForColorAssignment];
  const colorMap = buildHostColorMap(allHostIds, storedColors);
  const color = colorMap[hostId];
  return (
    <GlobeIcon
      className={className}
      style={{
        color,
      }}
    />
  );
}
export { buildHostColorMap as computeHostColorMap, hostColorMapSignal };
