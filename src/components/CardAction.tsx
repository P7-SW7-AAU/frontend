import { Card, CardContent } from "./ui/card";

interface CardActionProps {
    title: string;
    description: string;
    onClick: () => void;
    icon: React.ElementType;
    iconColor: string;
    iconBgColor: string;
    hoverColor: string;
}

const CardAction = ({ title, description, onClick, icon: Icon, iconColor, iconBgColor, hoverColor }: CardActionProps) => {
    return (
        <Card className={`border-dashed border-2 transition-colors cursor-pointer ${hoverColor}`} onClick={onClick}>
            <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className={`rounded-full p-6 ${iconBgColor}`}>
                <Icon className={`h-8 w-8 ${iconColor}`} />
            </div>
            <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-white">
                    {title}
                </h3>
                <p className="text-sm font-medium text-primary-gray max-w-xs">
                    {description}
                </p>
            </div>
            </CardContent>
        </Card>
    );
}

export default CardAction;
