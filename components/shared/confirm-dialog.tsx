import { Info, Send, Trash2Icon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Spinner } from "../ui/spinner";

type AlertDialogProps = {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    confirmButtonStyle?: "destructive"
    cancelText?: string;
    isLoading?: boolean,
    onConfirm: () => void;
    onCancel: () => void;
};

const alertDialogMedia = {
    'destructive': 'bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive'
}

const alertDialogMediaIcon = {
    'destructive': <Trash2Icon className="size-5" />
}

export function ConfirmDialog({
    confirmButtonStyle,
    open,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isLoading,
    onConfirm,
    onCancel,
}: AlertDialogProps) {

    if (!open) {
        return null;
    }

    return (
        <AlertDialog open={open} onOpenChange={onCancel}>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className={`size-10 ${confirmButtonStyle ? alertDialogMedia[confirmButtonStyle] : ''}`}>
                        {
                            confirmButtonStyle ? alertDialogMediaIcon[confirmButtonStyle] : <Info className="size-5" />
                        }
                    </AlertDialogMedia>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{message}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel} disabled={isLoading} className={'cursor-pointer'}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={(event) => {
                            event.preventDefault()
                            onConfirm()
                        }}
                        disabled={isLoading}
                        className={'cursor-pointer'}
                        variant={confirmButtonStyle}
                    >
                        {
                            isLoading ? <Spinner className="size-4" /> : <Send className="size-4" />
                        }
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}