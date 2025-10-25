import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface StatsCardProps {
    title: string;
    value: string | number;
    valueColor: string;
    description?: string;
    icon: React.ElementType;
    iconColor: string;
}

const StatsCard = ({ title, value, valueColor, description, icon: Icon, iconColor }: StatsCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-semibold text-primary-gray flex items-center">
                    <Icon className={`h-4 w-4 mr-2 ${iconColor}`} />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
                <p className="text-sm font-medium text-primary-gray">{description}</p>
            </CardContent>
        </Card>
    );
}

export default StatsCard;
