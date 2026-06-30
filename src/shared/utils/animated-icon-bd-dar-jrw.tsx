// Restored from ref/webview/assets/animated-icon-BdDarJrw.js
// AnimatedIcon chunk restored from the Codex webview bundle.

import React from "react";
import clsx from "clsx";
import { useReducedMotion } from "./use-reduced-motion";
export type AnimatedIconSize = "fill" | "xs" | "sm" | "md" | "lg";
export interface AnimatedIconProps {
  animation?: string;
  animationData?: Record<string, unknown>;
  fallbackSvg?: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  animated?: boolean;
  size?: AnimatedIconSize | number;
  color?: string;
  tokenColor?: string;
  matchTextColor?: boolean;
  loop?: boolean;
  showFallbackWhileLoading?: boolean;
  className?: string;
}
const sizeMap: Record<AnimatedIconSize, string> = {
  fill: "h-full w-full",
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};
const lottieSizeMap: Record<AnimatedIconSize, string> = {
  fill: "h-full w-full",
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};
function extractColorFromElement(element: HTMLElement): number[] | null {
  const match = getComputedStyle(element).color?.match(/\d+/g);
  if (!match) return null;
  const rgb = match.map(Number).map((v) => v / 255);
  rgb.push(1);
  return rgb;
}
const colorCache = new Map<string, number[] | null>();
const colorObservers = new Set<() => void>();
let colorMutationObserver: MutationObserver | null = null;
function getCachedColor(
  type: "color" | "tokenColor",
  value: string,
): number[] | null {
  const key = `${type}:${value}`;
  const cached = colorCache.get(key);
  if (cached !== undefined) return cached;
  const el = document.createElement("div");
  if (type === "color") {
    el.style.color = value;
  } else {
    el.className = value;
  }
  document.body.appendChild(el);
  const result = extractColorFromElement(el);
  el.remove();
  colorCache.set(key, result);
  return result;
}
function subscribeColor(callback: () => void): () => void {
  colorObservers.add(callback);
  if (!colorMutationObserver) {
    colorMutationObserver = new MutationObserver(() => {
      colorCache.clear();
      colorObservers.forEach((cb) => cb());
    });
    colorMutationObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
  }
  callback();
  return () => {
    colorObservers.delete(callback);
    if (colorObservers.size === 0) {
      colorMutationObserver?.disconnect();
      colorMutationObserver = null;
      colorCache.clear();
    }
  };
}
function applyColorToAnimationData(
  animationData: Record<string, unknown>,
  color: number[] | null,
): {
  size: {
    width: number;
    height: number;
  };
  data: Record<string, unknown>;
} {
  if (!color) {
    return {
      size: {
        width: (animationData.w as number) ?? 100,
        height: (animationData.h as number) ?? 100,
      },
      data: animationData,
    };
  }
  const cloned = structuredClone(animationData);
  const size = {
    width: (cloned.w as number) ?? 100,
    height: (cloned.h as number) ?? 100,
  };
  function applyToShape(shape: Record<string, unknown>) {
    if ((shape.ty === "fl" || shape.ty === "st") && shape.c?.k) {
      (shape.c as Record<string, unknown>).k = color;
    }
    if (Array.isArray(shape.it)) {
      shape.it.forEach(applyToShape);
    }
  }
  function applyToLayer(layer: Record<string, unknown>) {
    if (layer.ty === 4 && Array.isArray(layer.shapes)) {
      (layer.shapes as Record<string, unknown>[]).forEach(applyToShape);
    }
    if (Array.isArray(layer.layers)) {
      layer.layers.forEach(applyToLayer);
    }
  }
  applyToLayer(cloned);
  if (Array.isArray(cloned.assets)) {
    cloned.assets.forEach(applyToLayer);
  }
  return {
    size,
    data: cloned,
  };
}
export function AnimatedIcon({
  animation,
  animationData,
  fallbackSvg: FallbackSvg,
  animated = true,
  size = "md",
  color,
  tokenColor,
  matchTextColor = true,
  loop = true,
  showFallbackWhileLoading = true,
  className,
}: AnimatedIconProps): JSX.Element {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [resolvedColor, setResolvedColor] = React.useState<number[] | null>(
    null,
  );
  const [loadedAnimation, setLoadedAnimation] = React.useState<Record<
    string,
    unknown
  > | null>(null);
  const [processedAnimation, setProcessedAnimation] = React.useState<{
    size: {
      width: number;
      height: number;
    };
    data: Record<string, unknown>;
  } | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const sizeClass = typeof size === "number" ? "" : sizeMap[size];
  const lottieSizeClass = typeof size === "number" ? "" : lottieSizeMap[size];
  const inlineSize =
    typeof size === "number"
      ? {
          width: size,
          height: size,
        }
      : {};
  const wrapperClassName = clsx(
    lottieSizeClass,
    className,
    tokenColor,
    "flex items-center justify-center",
  );

  // Resolve color
  React.useEffect(() => {
    let cleanup: (() => void) | undefined;
    if (color) {
      cleanup = subscribeColor(() => {
        setResolvedColor(getCachedColor("color", color));
      });
    } else if (tokenColor) {
      cleanup = subscribeColor(() => {
        setResolvedColor(getCachedColor("tokenColor", tokenColor));
      });
    } else if (matchTextColor && containerRef.current) {
      const el = containerRef.current;
      const updateColor = () => {
        setResolvedColor(extractColorFromElement(el));
      };
      cleanup = subscribeColor(updateColor);
      const observer = new MutationObserver(updateColor);
      observer.observe(el, {
        attributes: true,
        attributeFilter: ["class", "style"],
      });
      return () => {
        cleanup?.();
        observer.disconnect();
      };
    } else {
      setResolvedColor(null);
    }
    return () => cleanup?.();
  }, [color, tokenColor, matchTextColor]);

  // Load animation data
  React.useEffect(() => {
    if (animationData) {
      setLoadedAnimation(animationData);
      return;
    }
    // Dynamic imports removed - animation data must be provided directly
    setLoadedAnimation(null);
  }, [animationData]);

  // Process animation with color
  React.useEffect(() => {
    if (!loadedAnimation) return;
    React.startTransition(() => {
      setProcessedAnimation(
        applyColorToAnimationData(loadedAnimation, resolvedColor),
      );
    });
  }, [resolvedColor, loadedAnimation]);
  const showFallback =
    prefersReducedMotion ||
    !animated ||
    (showFallbackWhileLoading && !processedAnimation);
  let fallbackElement: JSX.Element | null = null;
  if (!animated || showFallback) {
    if (!FallbackSvg) {
      throw new Error(
        "Either provide 'fallbackSvg' prop or use an 'animation' type when animated=false",
      );
    }
    const fallbackStyle: React.CSSProperties = {
      ...inlineSize,
    };
    if (color) {
      fallbackStyle.filter =
        color === "white" ? "brightness(0) invert(1)" : `hue-rotate(${color})`;
    }
    fallbackElement = (
      <div ref={containerRef} className={wrapperClassName} style={inlineSize}>
        <FallbackSvg className="h-full w-full" style={fallbackStyle} />
      </div>
    );
    if (!animated) {
      return fallbackElement;
    }
  }
  if (
    !prefersReducedMotion &&
    !processedAnimation &&
    !showFallbackWhileLoading
  ) {
    return (
      <div ref={containerRef} className={wrapperClassName} style={inlineSize} />
    );
  }
  const lottieClassName = clsx(sizeClass, "flex items-center justify-center");
  return (
    <div ref={containerRef} className={wrapperClassName} style={inlineSize}>
      <div className={lottieClassName} style={inlineSize}>
        {showFallback && fallbackElement}
        {!showFallback && processedAnimation && (
          <div
            className="pointer-events-none h-full w-full contain-[paint_style_layout_inline-size]"
            data-lottie-animation={animation}
          >
            {/* Lottie renderer placeholder - DotLottieWorkerReact integration removed */}
            <svg
              viewBox={`0 0 ${processedAnimation.size.width} ${processedAnimation.size.height}`}
              className="h-full w-full"
            >
              <rect
                width={processedAnimation.size.width}
                height={processedAnimation.size.height}
                fill="currentColor"
                opacity={0.1}
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
