// Restored from ref/webview/assets/code-snippet-5cGi4tCG.js

import { memo } from "react";
import { svgToDataUrl } from "../../utils/data-url-from-svg";
export function WordWrapIcon(
  props: React.SVGProps<SVGSVGElement>,
): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="currentColor"
      viewBox="0 0 20 20"
      {...props}
    >
      <path d="M10.33 12.668c.367 0 .665.298.665.665l.002 3.333a.665.665 0 0 1-1.33.001l-.002-3.334c0-.367.298-.665.665-.665Zm3.364-5.639a.665.665 0 0 1 .94 0l2.5 2.5c.26.26.26.682 0 .942l-2.5 2.5a.666.666 0 0 1-.94-.942l1.365-1.364H3.33a.665.665 0 1 1 0-1.33h11.728l-1.365-1.364a.666.666 0 0 1 0-.942ZM10.33 2.668c.367 0 .665.298.665.665l.002 3.333a.665.665 0 0 1-1.33.001l-.002-3.334c0-.367.298-.665.665-.665Z" />
    </svg>
  );
}
export function UnwrapIcon(props: React.SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="currentColor"
      viewBox="0 0 20 20"
      {...props}
    >
      <path d="M15.672 2.668c.367 0 .665.298.665.665l-.002 13.333a.665.665 0 0 1-1.33 0l.002-13.333c0-.367.298-.665.665-.665ZM9.586 6.002a3.582 3.582 0 0 1 0 7.163H5.777l.949.948a.665.665 0 1 1-.94.94l-2.084-2.082a.667.667 0 0 1 0-.94l2.083-2.085a.666.666 0 0 1 .94.942l-.947.947h3.808a2.251 2.251 0 0 0 0-4.503H4.169a.666.666 0 0 1 0-1.33h5.417Z" />
    </svg>
  );
}
export const HtmlSpan = memo(function HtmlSpan({
  html,
}: {
  html: string;
}): JSX.Element {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
});
export function SvgImage({
  svgString,
  ...rest
}: {
  svgString: string;
} & React.ImgHTMLAttributes<HTMLImageElement>): JSX.Element | null {
  if (typeof document === "undefined") {
    throw new Error("SvgImage is not supported in SSR");
  }
  const template = document.createElement("template");
  template.innerHTML = svgString;
  const sanitized = template.innerHTML;
  if (!sanitized) return null;
  return <img src={svgToDataUrl(sanitized)} {...rest} />;
}
