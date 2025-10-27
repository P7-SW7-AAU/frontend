import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ShortcutCardProps {
    title: string;
    description: string;
    buttonText: string;
    onClick: () => void;
    icon: React.ElementType;
}

const ShortcutCard = ({ title, description, buttonText, onClick, icon: Icon }: ShortcutCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-lg text-white">
                    <Icon className="h-5 w-5 mr-2 text-primary-green" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-primary-gray font-medium mb-4">
                    {description}
                </p>
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={onClick}
                >
                    {buttonText}
                </Button>
            </CardContent>
        </Card>
    );
}

export default ShortcutCard;
