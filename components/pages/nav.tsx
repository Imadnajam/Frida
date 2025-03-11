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
import { cn } from '@/lib/utils';

const Navbar = () => {
    // Menu items with their sub-items
    const menuItems = [
        {
            href: '/features',
            label: 'Features',
            hasDropdown: true,
            dropdownContent: [
                { href: '/features/core', label: 'Core Features', description: 'Explore our essential features' },
                { href: '/features/premium', label: 'Premium', description: 'Advanced capabilities for power users' },
                { href: '/features/integrations', label: 'Integrations', description: 'Connect with your favorite tools' }
            ]
        },
        {
            href: '/pricing',
            label: 'Pricing',
            hasDropdown: false
        },
        {
            href: '/about',
            label: 'About Us',
            hasDropdown: true,
            dropdownContent: [
                { href: '/about/team', label: 'Our Team', description: 'Meet the people behind Frida' },
                { href: '/about/mission', label: 'Our Mission', description: 'What drives us forward' }
            ]
        },
        {
            href: '/contact',
            label: 'Contact',
            hasDropdown: false
        },
    ];

    return (
        <nav className="relative z-50 py-4">
            {/* Custom background shape */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-b-3xl h-full w-full -z-10"></div>

            <div className="container mx-auto">
                <div className="flex items-center justify-between">
                    {/* Logo section */}
                    <div className="flex items-center space-x-2">
                       
                        <h1 className="text-2xl font-bold">Frida</h1>
                    </div>

                    {/* Desktop Navigation - Centered */}
                    <div className="hidden md:flex justify-center flex-1">
                        <div className="bg-background/80 backdrop-blur-sm border border-border/20 rounded-full px-2 shadow-lg">
                            <NavigationMenu>
                                <NavigationMenuList className="flex">
                                    {menuItems.map((item) => (
                                        <NavigationMenuItem key={item.href}>
                                            {item.hasDropdown ? (
                                                <>
                                                    <NavigationMenuTrigger className="px-4 rounded-full data-[state=open]:bg-primary/10">
                                                        {item.label}
                                                    </NavigationMenuTrigger>
                                                    <NavigationMenuContent>
                                                        <ul className="grid gap-3 p-6 w-[400px] md:w-[500px] lg:w-[600px] grid-cols-2">
                                                            {item.dropdownContent && item.dropdownContent.map((subItem) => (
                                                                <li key={subItem.href} className="row-span-1">
                                                                    <NavigationMenuLink asChild>
                                                                        <Link
                                                                            href={subItem.href}
                                                                            className="flex flex-col space-y-1 p-4 rounded-md hover:bg-accent"
                                                                        >
                                                                            <div className="text-sm font-medium">{subItem.label}</div>
                                                                            <p className="text-xs text-muted-foreground">{subItem.description}</p>
                                                                        </Link>
                                                                    </NavigationMenuLink>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </NavigationMenuContent>
                                                </>
                                            ) : (
                                                <Link href={item.href} legacyBehavior passHref>
                                                    <NavigationMenuLink className={cn(
                                                        navigationMenuTriggerStyle(),
                                                        "px-4 rounded-full hover:bg-primary/10"
                                                    )}>
                                                        {item.label}
                                                    </NavigationMenuLink>
                                                </Link>
                                            )}
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    </div>

                    {/* Theme toggle and mobile menu - Right aligned */}
                    <div className="flex items-center gap-3">
                        <ThemeModeToggle
                            messages={{
                                dark: 'Dark',
                                light: 'Light',
                                system: 'System',
                            }}
                        />

                        {/* Mobile menu button */}
                        <Sheet>
                            <SheetTrigger asChild className="md:hidden">
                                <Button variant="neutral" size="icon" className="h-9 w-9 rounded-full">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] pr-0">
                                <div className="flex flex-col mt-8 mr-6">
                                    {menuItems.map((item) => (
                                        <div key={item.href} className="mb-1">
                                            <Link
                                                href={item.href}
                                                className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-primary/10 transition-colors"
                                            >
                                                <span className="text-lg font-medium">{item.label}</span>
                                            </Link>

                                            {item.hasDropdown && (
                                                <div className="ml-4 border-l border-border pl-4 py-2 mt-1 mb-3">
                                                    {item.dropdownContent?.map((subItem) => (
                                                        <Link
                                                            key={subItem.href}
                                                            href={subItem.href}
                                                            className="block py-2 px-3 text-sm hover:bg-accent rounded-md transition-colors"
                                                        >
                                                            {subItem.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <div className="mt-6 pt-6 border-t border-border">
                                        <div className="flex justify-center">
                                            <ThemeModeToggle
                                                messages={{
                                                    dark: 'Dark',
                                                    light: 'Light',
                                                    system: 'System',
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;