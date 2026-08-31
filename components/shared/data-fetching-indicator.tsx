import { Loader2Icon } from "lucide-react";

type DataFetchingIndicatorProps = {
    title: string,
    description: string
}

export default function DataFetchingIndicator({ title, description } : DataFetchingIndicatorProps) {
    return (
        <div className="flex items-center justify-center rounded-lg border bg-muted/30 p-8">
            <div className="flex flex-col items-center gap-3 text-center">
                <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
                <div className="space-y-1">
                    <p className="text-sm font-medium">
                        {title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    )
}