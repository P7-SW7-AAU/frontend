"use client";

import { useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ModalProps {
    isOpen?: boolean;
    onClose: () => void;
    onSubmit: () => void;
    body?: React.ReactElement;
    footer?: React.ReactElement;
    actionLabel: string;
    disabled?: boolean;
    secondaryAction?: () => void;
    secondaryActionLabel?: string;
}

const Modal = ({ isOpen, onClose, onSubmit, body, footer, actionLabel, disabled, secondaryAction, secondaryActionLabel }: ModalProps) => {
    const pathname = usePathname();
    
    useEffect(() => {
    if (isOpen) onClose();
    }, [pathname]);

    const handleSubmit = useCallback(() => {
        if (disabled) return;

        onSubmit();
    }, [disabled, onSubmit]);

    const handleSecondaryAction = useCallback(() => {
        if (disabled || !secondaryAction) return;

        secondaryAction();
    }, [disabled, secondaryAction]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)]">
            <div className="modal-pop-in bg-[#131920] rounded-xl border border-gray-800 shadow-sm w-full max-w-lg mx-4 relative">
                <button
                    className="absolute top-4 right-4 text-[#94A4B8] hover:text-[#707882] focus:outline-none"
                    onClick={onClose}
                    disabled={disabled}
                    aria-label="Close"
                >
                    <X size={20} />
                </button>
                <div className="p-6 pb-4">
                    {body}
                </div>
                <div className="px-6 pb-6 flex flex-col gap-2">
                    <div className="flex flex-row items-center gap-4 w-full">
                        <Button
                            variant="hero"
                            onClick={handleSubmit}
                            disabled={disabled}
                            className="w-full"
                        >
                            {actionLabel}
                        </Button>
                        {secondaryAction && secondaryActionLabel && (
                            <Button
                                onClick={handleSecondaryAction}
                                disabled={disabled}
                                variant="outline"
                                className="w-full"
                            >
                                {secondaryActionLabel}
                            </Button>
                        )}
                    </div>
                    {footer}
                </div>
            </div>
        </div>
    );
}

export default Modal;
