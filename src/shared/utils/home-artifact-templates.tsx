// Restored from ref/webview/assets/home-artifact-templates-BqtjKj4m.js
// home-artifact-templates-BqtjKj4m chunk restored from the Codex webview bundle.
import React from "react";
import { O, T } from "../boundaries/tanstack-query";
import { l, r, s } from "../boundaries/intl-messageformat";
import clsx from "clsx";
import { toastApiAtom } from "../ui/ui/toast-signal.tsx";
import {
  HomeRowIcon,
  HomeRowLabel,
  HomeRowLayout,
} from "../../app/home-row-layout-dgl-qh-cvz.tsx";
import { ArrowLeftIcon } from "../icons/arrow-left-icon";
import { n, t } from "../utils/use-composer-controller";
const budgetPlannerXlsx = new URL(
  "budget-planner-B_xX3PJl.xlsx",
  import.meta.url,
).href;
const contentCalendarXlsx = new URL(
  "content-calendar-D2hO7r4o.xlsx",
  import.meta.url,
).href;
const designReviewPptx = new URL("design-review-DfDJVwWu.pptx", import.meta.url)
  .href;
const meetingNotesDocx = new URL("meeting-notes-hfgk-Kdr.docx", import.meta.url)
  .href;
const monthlyBusinessReviewPptx = new URL(
  "monthly-business-review-CqJbQRLF.pptx",
  import.meta.url,
).href;
const budgetPlannerPng = new URL("budget-planner-DdzCe8wU.png", import.meta.url)
  .href;
const contentCalendarPng = new URL(
  "content-calendar-Ct37j4gK.png",
  import.meta.url,
).href;
const designReviewPng = new URL("design-review-D5ZTsvgZ.png", import.meta.url)
  .href;
const meetingNotesPng = new URL("meeting-notes-HtllKJ8V.png", import.meta.url)
  .href;
const monthlyBusinessReviewPng = new URL(
  "monthly-business-review-iy1-PqJc.png",
  import.meta.url,
).href;
const projectBriefPng = new URL("project-brief-bL95n3Ke.png", import.meta.url)
  .href;
const projectTrackerPng = new URL(
  "project-tracker-BsrXHgJI.png",
  import.meta.url,
).href;
const reportOutlinePng = new URL("report-outline-CQViP9Z5.png", import.meta.url)
  .href;
const salesDiscoveryPng = new URL(
  "sales-discovery-CFt_AKqR.png",
  import.meta.url,
).href;
const projectBriefDocx = new URL("project-brief-Dgi4V0mX.docx", import.meta.url)
  .href;
const projectTrackerXlsx = new URL(
  "project-tracker-BL3pNzWv.xlsx",
  import.meta.url,
).href;
const reportOutlineDocx = new URL(
  "report-outline-DUfNp9Wv.docx",
  import.meta.url,
).href;
const salesDiscoveryPptx = new URL(
  "sales-discovery-DI8H6s1v.pptx",
  import.meta.url,
).href;
interface ArtifactTemplate {
  id: string;
  kind: "document" | "presentation" | "spreadsheet";
  title: {
    id: string;
    defaultMessage: string;
    description: string;
  };
  filename: string;
  assetUrl: string;
  previewUrl: string;
}
const ARTIFACT_TEMPLATES: ArtifactTemplate[] = [
  {
    id: "project-brief",
    kind: "document",
    title: r({
      id: "home.artifactTemplates.projectBrief",
      defaultMessage: "Project brief",
      description: "Title for a document template card",
    }),
    filename: "project-brief.docx",
    assetUrl: projectBriefDocx,
    previewUrl: projectBriefPng,
  },
  {
    id: "meeting-notes",
    kind: "document",
    title: r({
      id: "home.artifactTemplates.meetingNotes",
      defaultMessage: "Meeting notes",
      description: "Title for a document template card",
    }),
    filename: "meeting-notes.docx",
    assetUrl: meetingNotesDocx,
    previewUrl: meetingNotesPng,
  },
  {
    id: "report-outline",
    kind: "document",
    title: r({
      id: "home.artifactTemplates.reportOutline",
      defaultMessage: "Report outline",
      description: "Title for a document template card",
    }),
    filename: "report-outline.docx",
    assetUrl: reportOutlineDocx,
    previewUrl: reportOutlinePng,
  },
  {
    id: "monthly-business-review",
    kind: "presentation",
    title: r({
      id: "home.artifactTemplates.monthlyBusinessReview",
      defaultMessage: "Monthly Business Review",
      description: "Title for a presentation template card",
    }),
    filename: "monthly-business-review.pptx",
    assetUrl: monthlyBusinessReviewPptx,
    previewUrl: monthlyBusinessReviewPng,
  },
  {
    id: "sales-discovery",
    kind: "presentation",
    title: r({
      id: "home.artifactTemplates.salesDiscovery",
      defaultMessage: "Sales discovery",
      description: "Title for a presentation template card",
    }),
    filename: "sales-discovery.pptx",
    assetUrl: salesDiscoveryPptx,
    previewUrl: salesDiscoveryPng,
  },
  {
    id: "design-review",
    kind: "presentation",
    title: r({
      id: "home.artifactTemplates.designReview",
      defaultMessage: "Design review",
      description: "Title for a presentation template card",
    }),
    filename: "design-review.pptx",
    assetUrl: designReviewPptx,
    previewUrl: designReviewPng,
  },
  {
    id: "project-tracker",
    kind: "spreadsheet",
    title: r({
      id: "home.artifactTemplates.projectTracker",
      defaultMessage: "Project tracker",
      description: "Title for a spreadsheet template card",
    }),
    filename: "project-tracker.xlsx",
    assetUrl: projectTrackerXlsx,
    previewUrl: projectTrackerPng,
  },
  {
    id: "budget-planner",
    kind: "spreadsheet",
    title: r({
      id: "home.artifactTemplates.budgetPlanner",
      defaultMessage: "Budget planner",
      description: "Title for a spreadsheet template card",
    }),
    filename: "budget-planner.xlsx",
    assetUrl: budgetPlannerXlsx,
    previewUrl: budgetPlannerPng,
  },
  {
    id: "content-calendar",
    kind: "spreadsheet",
    title: r({
      id: "home.artifactTemplates.contentCalendar",
      defaultMessage: "Content calendar",
      description: "Title for a spreadsheet template card",
    }),
    filename: "content-calendar.xlsx",
    assetUrl: contentCalendarXlsx,
    previewUrl: contentCalendarPng,
  },
];
function getTemplatesByKind(kind: string): ArtifactTemplate[] {
  return ARTIFACT_TEMPLATES.filter((item) => item.kind === kind);
}
interface ProseMirrorNode {
  type: {
    name: string;
  };
  attrs: {
    path?: unknown;
  };
  descendants: (callback: (node: ProseMirrorNode) => boolean) => void;
}
function detectTemplateKindFromDoc(doc: ProseMirrorNode): string | null {
  let detectedKind: string | null = null;
  doc.descendants((node) => {
    if (
      detectedKind != null ||
      (node.type.name !== "skillMention" && node.type.name !== "pluginMention")
    )
      return true;
    const kind = extractTemplateKind(
      typeof node.attrs.path === "string" ? node.attrs.path : "",
    );
    if (kind != null) {
      detectedKind = kind;
    }
    return true;
  });
  return detectedKind;
}
function extractTemplateKind(path: string): string | null {
  const normalized = path.toLowerCase().replaceAll("\\", "/");
  if (normalized.startsWith("plugin://"))
    return mapPluginNameToKind(normalized.slice(9).split("@")[0]);
  const skillName = normalized.match(
    /(?:^|\/)skills\/([^/]+)\/skill\.md$/,
  )?.[1];
  return skillName == null ? null : mapPluginNameToKind(skillName);
}
function mapPluginNameToKind(name: string): string | null {
  return name === "documents"
    ? "document"
    : name === "presentations"
      ? "presentation"
      : name === "spreadsheets"
        ? "spreadsheet"
        : null;
}
interface HomeArtifactTemplatesProps {
  backPrompt?: string | null;
  canUseTemplateAttachments: boolean;
  onAddFileAssetAttachment: (attachment: {
    assetUrl: string;
    label: string;
  }) => Promise<unknown>;
}
export function HomeArtifactTemplates({
  backPrompt,
  canUseTemplateAttachments,
  onAddFileAssetAttachment,
}: HomeArtifactTemplatesProps) {
  const store = O(T);
  const composerController = t();
  const intl = l();
  const detectedKind = n(composerController, (state) =>
    detectTemplateKindFromDoc(state.view.state.doc as ProseMirrorNode),
  );
  const templates =
    detectedKind == null ? null : getTemplatesByKind(detectedKind);
  const [attachingId, setAttachingId] = React.useState<string | null>(null);
  const isAttaching = attachingId != null;
  if (!canUseTemplateAttachments || templates == null || templates.length === 0)
    return null;
  const isDocument = detectedKind === "document";
  const handleAttach = async (template: ArtifactTemplate) => {
    setAttachingId(template.id);
    try {
      await onAddFileAssetAttachment({
        assetUrl: template.assetUrl,
        label: template.filename,
      });
      composerController.focus();
    } catch {
      store.get(toastApiAtom).danger(
        intl.formatMessage({
          id: "home.artifactTemplates.attachError",
          defaultMessage: "Unable to attach template",
          description:
            "Toast shown when attaching a document, presentation, or spreadsheet template fails",
        }),
      );
    } finally {
      setAttachingId(null);
    }
  };
  return (
    <section
      data-home-artifact-templates={true}
      className="mx-auto mt-0.5 flex w-full max-w-3xl min-w-0 flex-col gap-1 pb-1"
    >
      <div className="flex min-w-0 items-center py-1.5">
        <div className="flex min-w-0 flex-1 py-row-y pr-1 pl-3.5 text-left">
          <HomeRowLayout>
            <HomeRowLabel className="font-medium text-token-text-primary">
              <s
                id="home.artifactTemplates.title"
                defaultMessage="Start with a template"
                description="Section title for document, presentation, and spreadsheet template cards under the home composer"
              />
            </HomeRowLabel>
          </HomeRowLayout>
        </div>
      </div>
      <div
        className={clsx(
          "grid grid-cols-1 gap-4 px-3",
          isDocument ? "sm:grid-cols-4" : "sm:grid-cols-3",
        )}
      >
        {templates.map((item, index) => {
          const isAttachingThis = attachingId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={clsx(
                "group relative -m-1 flex min-w-0 cursor-interaction flex-col gap-2 rounded-2xl p-1 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-token-focus-border disabled:cursor-default disabled:opacity-70",
              )}
              style={{
                animationDelay: `calc(var(--transition-duration-basic) + ${index * 25}ms)`,
              }}
              aria-label={intl.formatMessage(
                {
                  id: "home.artifactTemplates.attach",
                  defaultMessage: "Attach {title}",
                  description:
                    "Accessible label for selecting a document, presentation, or spreadsheet template",
                },
                {
                  title: intl.formatMessage(item.title),
                },
              )}
              disabled={isAttaching}
              onClick={() => {
                handleAttach(item);
              }}
            >
              <div
                className={clsx(
                  "overflow-hidden rounded-xl border border-token-border bg-token-main-surface-primary shadow-sm ring-4 ring-transparent group-hover:ring-token-border-light group-focus-visible:ring-token-focus-border",
                  isDocument ? "aspect-[4/5]" : "aspect-video",
                )}
              >
                <img
                  src={item.previewUrl}
                  alt=""
                  className={clsx(
                    "h-full w-full object-top",
                    isDocument ? "object-contain" : "object-cover",
                    isAttachingThis && "motion-safe:animate-pulse",
                  )}
                  draggable={false}
                />
              </div>
              <div className="min-w-0 -translate-y-0.5 truncate pr-2 pb-1 pl-0.5 text-sm leading-5 font-normal tracking-normal text-token-text-secondary group-hover:text-token-text-primary group-focus-visible:text-token-text-primary">
                <s {...item.title} />
              </div>
            </button>
          );
        })}
      </div>
      {backPrompt == null ? null : (
        <button
          type="button"
          className="flex w-fit min-w-0 cursor-interaction py-row-y text-left text-token-description-foreground outline-hidden enabled:hover:text-token-foreground enabled:focus:text-token-foreground disabled:cursor-default disabled:opacity-70"
          disabled={isAttaching}
          onClick={() => {
            composerController.setText(backPrompt);
            composerController.focus();
          }}
        >
          <HomeRowLayout>
            <HomeRowIcon aria-hidden="true">
              <ArrowLeftIcon className="icon-xs shrink-0" />
            </HomeRowIcon>
            <HomeRowLabel>
              <s
                id="home.artifactTemplates.back"
                defaultMessage="Back"
                description="Button label for returning from artifact template cards to new chat suggestions"
              />
            </HomeRowLabel>
          </HomeRowLayout>
        </button>
      )}
    </section>
  );
}
