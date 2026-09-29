import { useState } from "react";

type AlertDialogOptions = {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void | Promise<void>;
};

export function useConfirmDialog() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [options, setOptions] = useState<AlertDialogOptions>({
        title: "",
        message: "",
    });

    const alert = (options: AlertDialogOptions) => {
        setOptions(options);
        setOpen(true);
    };

    const close = () => {

        if(isLoading){
            return
        }

        setOpen(false);
    };

    const confirm = () => {
        options.onConfirm?.();
        close();
    };

    const handleConfirm = async () => {
        if (!options?.onConfirm) {
            return;
        }

        try {
            setIsLoading(true);

            await options.onConfirm();

            setOpen(false);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        open,
        isLoading,
        options,
        alert,
        close,
        confirm,
        handleConfirm
    };
}