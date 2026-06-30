// Restored from ref/webview/assets/toolbar-breadcrumb-D6sZAZxC.js
// toolbar-breadcrumb-D6sZAZxC chunk restored from the Codex webview bundle.
import { useIntl } from "boundaries/intl-messageformat";
import { Button } from "ui/button";
import { ChevronRightIcon } from "icons/chevron-right-icon";
interface BreadcrumbAncestor {
  label: string;
  onClick: () => void;
}
interface ToolbarBreadcrumbProps {
  ancestors: BreadcrumbAncestor[];
  current?: React.ReactNode;
}
export function ToolbarBreadcrumb({
  ancestors,
  current,
}: ToolbarBreadcrumbProps) {
  const intl = useIntl();
  const label = intl.formatMessage({
    id: "toolbarBreadcrumb.label",
    defaultMessage: "Breadcrumb",
    description: "Accessible label for toolbar breadcrumb navigation",
  });
  const ancestorItems = ancestors.map((ancestor, index) => (
    <BreadcrumbItem key={index} ancestor={ancestor} showSeparator={index > 0} />
  ));
  const currentItem =
    current == null ? null : (
      <>
        {ancestors.length > 0 ? (
          <ChevronRightIcon aria-hidden className="icon-xs shrink-0" />
        ) : null}
        <span
          aria-current="page"
          className="flex h-token-button-composer min-w-0 items-center truncate px-2 text-token-foreground"
        >
          {current}
        </span>
      </>
    );
  return (
    <nav
      aria-label={label}
      className="flex min-w-0 items-center gap-1 text-base text-token-description-foreground"
    >
      {ancestorItems}
      {currentItem}
    </nav>
  );
}
interface BreadcrumbItemProps {
  ancestor: BreadcrumbAncestor;
  showSeparator: boolean;
}
function BreadcrumbItem({ ancestor, showSeparator }: BreadcrumbItemProps) {
  return (
    <>
      {showSeparator ? (
        <ChevronRightIcon aria-hidden className="icon-xs shrink-0" />
      ) : null}
      <Button
        className="min-w-0"
        color="ghost"
        size="toolbar"
        onClick={ancestor.onClick}
      >
        <span className="min-w-0 truncate">{ancestor.label}</span>
      </Button>
    </>
  );
}
