"use client";

import { useState } from 'react';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { Trophy, Users, User, BarChart3, Menu, X, LogIn, LogOut } from 'lucide-react';

import { useUser } from "@stackframe/stack";

import { Button } from '@/components/ui/button';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const user = useUser();

    const baseNavigation = [
        { name: 'Dashboard', href: '/', icon: BarChart3 },
        { name: 'My Teams', href: '/teams', icon: Users },
        { name: 'My Leagues', href: '/leagues', icon: Trophy },
        { name: 'Players', href: '/players', icon: User },
    ];

    const navigation = user
        ? [...baseNavigation, { name: 'Log Out', href: '/handler/sign-out', icon: LogOut }]
        : [...baseNavigation, { name: 'Log In', href: '/handler/sign-in', icon: LogIn }];

    const isActive = (href: string) => pathname === href;

    return (
        <nav className="bg-card border-b border-border border-gray-800 sticky top-0 z-50 backdrop-blur-lg bg-card/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
            <div className="flex items-center">
                <Link href="/" className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-primary-green rounded-lg flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="ml-2 text-xl font-bold text-white">FantasyPro</span>
                </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
                {navigation.map((item) => {
                const Icon = item.icon;
                return (
                    <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        isActive(item.href)
                        ? 'text-primary-green bg-[#152624]'
                        : 'text-[#94A4B8] hover:text-[#16A149]'
                    }`}
                    >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                    </Link>
                );
                })}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
                <Button
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
            <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-800">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive(item.href)
                            ? 'text-primary-green bg-[#152624]'
                            : 'text-[#94A4B8] hover:text-[#16A149]'
                        }`}
                        onClick={() => setIsOpen(false)}
                    >
                        <Icon className="h-5 w-5 mr-3" />
                        {item.name}
                    </Link>
                    );
                })}
                </div>
            </div>
            )}
        </div>
        </nav>
    );
}

export default Navbar;
