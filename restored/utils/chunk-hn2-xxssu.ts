// Restored from ref/webview/assets/chunk-HN2XXSSU-dadJeUL1.js
// Mermaid diagram line geometry utilities — arrow offsets and
// line-position functions with arrow-head compensation.

interface Point {
  x: number;
  y: number;
}
interface DeltaAndAngle {
  angle: number;
  deltaX: number;
  deltaY: number;
}
interface ArrowConfig {
  arrowTypeStart: string;
  arrowTypeEnd: string;
}
interface LineFunctions {
  x: (point: Point | number[], index: number, points: Point[]) => number;
  y: (point: Point | number[], index: number, points: Point[]) => number;
}

/**
 * Offsets (in pixels) applied to line ends for each arrow-head type.
 * These values compensate for the visual size of the arrow head so the
 * line stops at the correct visual boundary.
 */
export const arrowTypeOffsets: Record<string, number> = {
  aggregation: 17.25,
  extension: 17.25,
  composition: 17.25,
  dependency: 6,
  lollipop: 13.5,
  arrow_point: 4,
};

/**
 * Lengths (in pixels) of various arrow-head styles.
 */
export const arrowHeadLengths: Record<string, number> = {
  arrow_point: 9,
  arrow_cross: 12.5,
  arrow_circle: 12.5,
};

/**
 * Normalises a point that may be supplied as either a `[x, y]` tuple or
 * a `{x, y}` object.
 */
function normalisePoint(point: Point | number[]): Point {
  return Array.isArray(point)
    ? {
        x: point[0],
        y: point[1],
      }
    : point;
}

/**
 * Calculates the angle and delta between two points.
 */
function calculateDeltaAndAngle(
  start: Point | number[],
  end: Point | number[],
): DeltaAndAngle {
  if (start === undefined || end === undefined) {
    return {
      angle: 0,
      deltaX: 0,
      deltaY: 0,
    };
  }
  const startPoint = normalisePoint(start);
  const endPoint = normalisePoint(end);
  const deltaX = endPoint.x - startPoint.x;
  const deltaY = endPoint.y - startPoint.y;
  return {
    angle: Math.atan(deltaY / deltaX),
    deltaX,
    deltaY,
  };
}

/**
 * Returns a direction string ("left" / "right" or "up" / "down")
 * based on the ordering of the first and last points in a polyline.
 */
function getHorizontalDirection(points: Point[]): "left" | "right" {
  return normalisePoint(points[0]).x <
    normalisePoint(points[points.length - 1]).x
    ? "left"
    : "right";
}
function getVerticalDirection(points: Point[]): "up" | "down" {
  return normalisePoint(points[0]).y <
    normalisePoint(points[points.length - 1]).y
    ? "down"
    : "up";
}

/**
 * Builds x/y accessor functions for a line that account for arrow-head
 * offsets at the start and end points.
 */
export function getLineFunctionsWithOffset(config: ArrowConfig): LineFunctions {
  return {
    x(point: Point | number[], index: number, points: Point[]): number {
      let offset = 0;
      const direction = getHorizontalDirection(points);
      if (
        index === 0 &&
        Object.hasOwn(arrowTypeOffsets, config.arrowTypeStart)
      ) {
        const { angle, deltaX } = calculateDeltaAndAngle(points[0], points[1]);
        offset =
          arrowTypeOffsets[config.arrowTypeStart] *
          Math.cos(angle) *
          (deltaX >= 0 ? 1 : -1);
      } else if (
        index === points.length - 1 &&
        Object.hasOwn(arrowTypeOffsets, config.arrowTypeEnd)
      ) {
        const { angle, deltaX } = calculateDeltaAndAngle(
          points[points.length - 1],
          points[points.length - 2],
        );
        offset =
          arrowTypeOffsets[config.arrowTypeEnd] *
          Math.cos(angle) *
          (deltaX >= 0 ? 1 : -1);
      }
      const targetPoint = normalisePoint(point);
      const endPoint = normalisePoint(points[points.length - 1]);
      const startPoint = normalisePoint(points[0]);
      const distToEndX = Math.abs(targetPoint.x - endPoint.x);
      const distToEndY = Math.abs(targetPoint.y - endPoint.y);
      const distToStartX = Math.abs(targetPoint.x - startPoint.x);
      const distToStartY = Math.abs(targetPoint.y - startPoint.y);
      const startOffset = arrowTypeOffsets[config.arrowTypeStart];
      const endOffset = arrowTypeOffsets[config.arrowTypeEnd];
      if (distToEndX < endOffset && distToEndX > 0 && distToEndY < endOffset) {
        const adjustment = endOffset + 1 - distToEndX;
        offset -= adjustment * (direction === "right" ? -1 : 1);
      }
      if (
        distToStartX < startOffset &&
        distToStartX > 0 &&
        distToStartY < startOffset
      ) {
        const adjustment = startOffset + 1 - distToStartX;
        offset += adjustment * (direction === "right" ? -1 : 1);
      }
      return targetPoint.x + offset;
    },
    y(point: Point | number[], index: number, points: Point[]): number {
      let offset = 0;
      const direction = getVerticalDirection(points);
      if (
        index === 0 &&
        Object.hasOwn(arrowTypeOffsets, config.arrowTypeStart)
      ) {
        const { angle, deltaY } = calculateDeltaAndAngle(points[0], points[1]);
        offset =
          arrowTypeOffsets[config.arrowTypeStart] *
          Math.abs(Math.sin(angle)) *
          (deltaY >= 0 ? 1 : -1);
      } else if (
        index === points.length - 1 &&
        Object.hasOwn(arrowTypeOffsets, config.arrowTypeEnd)
      ) {
        const { angle, deltaY } = calculateDeltaAndAngle(
          points[points.length - 1],
          points[points.length - 2],
        );
        offset =
          arrowTypeOffsets[config.arrowTypeEnd] *
          Math.abs(Math.sin(angle)) *
          (deltaY >= 0 ? 1 : -1);
      }
      const targetPoint = normalisePoint(point);
      const endPoint = normalisePoint(points[points.length - 1]);
      const startPoint = normalisePoint(points[0]);
      const distToEndY = Math.abs(targetPoint.y - endPoint.y);
      const distToEndX = Math.abs(targetPoint.x - endPoint.x);
      const distToStartY = Math.abs(targetPoint.y - startPoint.y);
      const distToStartX = Math.abs(targetPoint.x - startPoint.x);
      const startOffset = arrowTypeOffsets[config.arrowTypeStart];
      const endOffset = arrowTypeOffsets[config.arrowTypeEnd];
      if (distToEndY < endOffset && distToEndY > 0 && distToEndX < endOffset) {
        const adjustment = endOffset + 1 - distToEndY;
        offset -= adjustment * (direction === "up" ? -1 : 1);
      }
      if (
        distToStartY < startOffset &&
        distToStartY > 0 &&
        distToStartX < startOffset
      ) {
        const adjustment = startOffset + 1 - distToStartY;
        offset += adjustment * (direction === "up" ? -1 : 1);
      }
      return targetPoint.y + offset;
    },
  };
}
