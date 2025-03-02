'use client';

import * as React from 'react';
import Link from 'next/link';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { ThemeModeToggle } from '@/components/ThemeModeToggle';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    // Menu items to avoid repetition
    const menuItems = [
        { href: '/features', label: 'Features' },
        { href: '/pricing', label: 'Pricing' },
        { href: '/about', label: 'About Us' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <nav className="p-4 border-b">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold mr-6">
                    <Link href="/">Frida</Link>
                </h1>

                {/* Desktop Navigation - Hidden on mobile */}
                <div className="hidden md:block">
                    <NavigationMenu>
                        <NavigationMenuList className="flex gap-6">
                            {menuItems.map((item) => (
                                <NavigationMenuItem key={item.href}>
                                    <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                                        <Link href={item.href}>{item.label}</Link>
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent />
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="flex items-center gap-6">
                   
                    {/* Mobile Menu Button - Visible only on mobile */}
                    <Sheet>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="default" size="icon">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-64">
                            <div className="flex flex-col space-y-6 mt-8">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="text-lg font-medium py-2 px-4 rounded-md hover:bg-accent transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                    <ThemeModeToggle
                        messages={{
                            dark: 'Dark',
                            light: 'Light',
                            system: 'System',
                        }}
                    />

                </div>
            </div>
        </nav>
    );
};

export default Navbar;