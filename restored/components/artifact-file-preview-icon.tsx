// Restored from ref/webview/assets/artifact-file-preview-icon-LMyZNsDA.js
// ArtifactFilePreviewIcon component restored from the Codex webview bundle.
import clsx from "clsx";
import { getFileIcon } from "../utils/get-file-icon";
export interface ArtifactFilePreviewIconProps {
  getImagePreviewSrc?: (path: string) => string | null;
  iconClassName?: string;
  imageClassName?: string;
  path: string;
}
export function ArtifactFilePreviewIcon({
  getImagePreviewSrc,
  iconClassName,
  imageClassName,
  path,
}: ArtifactFilePreviewIconProps) {
  const imagePreviewSrc = getImagePreviewSrc?.(path) ?? null;
  if (imagePreviewSrc != null) {
    return (
      <img
        alt=""
        className={clsx("shrink-0 object-cover", imageClassName)}
        src={imagePreviewSrc}
      />
    );
  }
  const FileIcon = getFileIcon(path);
  return <FileIcon className={clsx("shrink-0", iconClassName)} />;
}
