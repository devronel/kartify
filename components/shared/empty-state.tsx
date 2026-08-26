import { Button } from "@/components/ui/button"
import { FileX2 } from "lucide-react"

type EmptyStateProps = {
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  title = "No data found",
  description = "There is no data to display here yet.",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-75 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
        <FileX2 className="size-6 text-muted-foreground" />
      </div>

      <h3 className="text-lg font-semibold">{title}</h3>

      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>

      {action && (
        <Button className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}