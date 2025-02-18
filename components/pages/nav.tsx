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

const Navbar = () => {
    return (
        <nav className="p-4">
            <div className="container mx-auto flex justify-between items-center">
              
                <h1 className="text-2xl font-bold mr-6">
                    <Link href="/">Frida</Link>
                </h1>

                <NavigationMenu>
                    <NavigationMenuList className="flex gap-8">
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                                <Link href="/features">Features</Link>
                            </NavigationMenuTrigger>
                            <NavigationMenuContent />
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                                <Link href="/pricing">Pricing</Link>
                            </NavigationMenuTrigger>
                            <NavigationMenuContent />
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                                <Link href="/about">About Us</Link>
                            </NavigationMenuTrigger>
                            <NavigationMenuContent />
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                                <Link href="/contact">Contact</Link>
                            </NavigationMenuTrigger>
                            <NavigationMenuContent />
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <div className="ml-6">
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