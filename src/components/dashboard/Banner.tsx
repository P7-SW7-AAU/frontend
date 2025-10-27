import { Plus, Users } from "lucide-react";

import { Button } from "../ui/button";

interface BannerProps {
    title: string;
    description: string;
    onClick: () => void;
    onSecondaryClick: () => void;
}

const Banner = ({ title, description, onClick, onSecondaryClick }: BannerProps) => {
    return (
        <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(/fantasy-hero.jpg)` }}>
                <div className="absolute inset-0 bg-background/85" />
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold text-white">
                        {title}
                        <span className="block text-[#1B8143] animate-pulse-glow">
                            Command Center
                        </span>
                    </h1>
                    <p className="text-xl font-medium text-primary-gray max-w-2xl mx-auto">
                        {description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            variant="hero"
                            size="lg"
                            className="animate-float-continuous"
                            onClick={onClick}
                        >
                            <Users className="h-5 w-5 mr-2" />
                            Manage Teams
                        </Button>
                        <Button
                            variant="gold"
                            size="lg"
                            onClick={onSecondaryClick}
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Browse Players
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Banner;
