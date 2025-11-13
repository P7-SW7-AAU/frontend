"use client";

import { useTooltip } from "@/hooks/useTooltip";
import { Button } from "./ui/button";
import { Info } from "lucide-react";

interface HeaderProps {
    title: string;
    description: string;
    icon?: React.ElementType;
    buttonText?: string;
    buttonIcon?: React.ElementType;
    buttonIconSize?: string;
    onClick?: () => void;
    secondaryButtonText?: string;
    secondaryButtonIcon?: React.ElementType;
    secondaryButtonIconSize?: string;
    secondaryOnClick?: () => void;
    isLoading?: boolean;
    tooltipMessage?: string;
}

const Header = ({ title, description, icon: Icon, buttonText, buttonIcon: ButtonIcon, buttonIconSize: ButtonIconSize, onClick, secondaryButtonText, secondaryButtonIcon: SecondaryButtonIcon, secondaryButtonIconSize: SecondaryButtonIconSize, secondaryOnClick, isLoading, tooltipMessage }: HeaderProps) => {
    const { show, hide, Tooltip } = useTooltip();
    
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center gap-3 mb-4">
                {Icon && <Icon className="h-10 w-10 text-primary-green animate-pulse" />}
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold text-white">{title}</h1>
                        {tooltipMessage && (
                            <>
                                <Info
                                    className="h-5 w-5 mt-1 text-primary-gray hover:text-white cursor-pointer transition-colors"
                                    onMouseEnter={show}
                                    onMouseLeave={hide}
                                />
                                <Tooltip message={tooltipMessage} />
                            </>
                        )}
                    </div>
                    <p className="text-primary-gray font-medium mt-1">{description}</p>
                </div>
            </div>
            <div className="flex space-x-3">
                {secondaryOnClick && (
                    <Button onClick={secondaryOnClick} variant="outline" size="lg" disabled={isLoading} className="px-6.5">
                        {SecondaryButtonIcon && <SecondaryButtonIcon className={`h-${SecondaryButtonIconSize} w-${SecondaryButtonIconSize} mr-2`} />}
                        {secondaryButtonText}
                    </Button>
                )}
                {onClick && (
                    <Button onClick={onClick} variant="hero" size="lg" disabled={isLoading} className="px-6.5">
                        {ButtonIcon && <ButtonIcon className={`h-${ButtonIconSize} w-${ButtonIconSize} mr-2`} />}
                        {buttonText}
                    </Button>
                )}
            </div>
        </div>
    );
}

export default Header;
