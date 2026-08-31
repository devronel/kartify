import { AlertCircleIcon } from "lucide-react";
import { Button } from "../ui/button";

type ErrorFetchingIndicatorProps = {
    title: string,
    description: string,
    onRetry: () => Promise<void>
}

export default function ErrorFetchingIndicator({ title, description, onRetry }: ErrorFetchingIndicatorProps){
    return (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
                <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
                    <AlertCircleIcon className="size-5 text-destructive" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-destructive">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                    className="mt-1"
                >
                    Try again
                </Button>
            </div>
        </div>
    )
}