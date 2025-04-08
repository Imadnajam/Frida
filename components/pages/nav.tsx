'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import Logo from '@/components/Frida.png';

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
            {/* Custom background with elegant gradient and subtle patterns */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-primary/5 to-background/80 rounded-b-3xl h-full w-full -z-10">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_30%_20%,_#fff_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
            </div>

            <div className="container mx-auto">
                <div className="flex items-center justify-between">
                    {/* Logo section - using the imported Logo image */}
                    <div className="flex items-center space-x-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                            {/* Using the imported Logo */}
                            <Image
                                src={Logo}
                                alt="Frida Logo"
                                className="object-contain"
                                priority
                                width={40}
                                height={40}
                            />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Frida</h1>
                           
                        </div>
                    </div>

                    {/* Desktop Navigation - Centered with enhanced design */}
                    <div className="hidden md:flex justify-center flex-1">
                        <div className="bg-background/70 backdrop-blur-md border border-border/30 rounded-full px-2 shadow-lg">
                            <NavigationMenu>
                                <NavigationMenuList className="flex">
                                    {menuItems.map((item) => (
                                        <NavigationMenuItem key={item.href}>
                                            {item.hasDropdown ? (
                                                <>
                                                    <NavigationMenuTrigger className="px-4 rounded-full data-[state=open]:bg-primary/10 font-medium">
                                                        {item.label}
                                                    </NavigationMenuTrigger>
                                                    <NavigationMenuContent>
                                                        <ul className="grid gap-3 p-6 w-[400px] md:w-[500px] lg:w-[600px] grid-cols-2">
                                                            {item.dropdownContent && item.dropdownContent.map((subItem) => (
                                                                <li key={subItem.href} className="row-span-1">
                                                                    <NavigationMenuLink asChild>
                                                                        <Link
                                                                            href={subItem.href}
                                                                            className="flex flex-col space-y-1 p-4 rounded-lg hover:bg-accent group transition-all duration-200"
                                                                        >
                                                                            <div className="text-sm font-medium group-hover:text-primary transition-colors">{subItem.label}</div>
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
                                                        "px-4 rounded-full hover:bg-primary/10 font-medium"
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

                    {/* Theme toggle and CTA buttons - Right aligned */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:block">
                            <Button variant="default" size="sm" className="rounded-full px-4 border-primary/20 hover:border-primary">
                                Login
                            </Button>
                        </div>
                        <Button size="sm" className="rounded-full px-4 hidden sm:flex">
                            Get Started
                        </Button>
                        <ThemeModeToggle
                            messages={{
                                dark: 'Dark',
                                light: 'Light',
                                system: 'System',
                            }}
                        />

                        {/* Mobile menu button with enhanced styling */}
                        <Sheet>
                            <SheetTrigger asChild className="md:hidden">
                                <Button variant="default" size="icon" className="h-9 w-9 rounded-full border-primary/20">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] pr-0">
                                <div className="flex flex-col mt-8 mr-6">
                                    {/* Logo in mobile menu */}
                                    <div className="flex items-center space-x-3 mb-8 px-4">
                                        <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                                            {/* Same logo in mobile menu */}
                                            <Image
                                                src={Logo}
                                                alt="Frida Logo"
                                                className="object-contain"
                                                width={32}
                                                height={32}
                                            />
                                        </div>
                                        <h1 className="text-xl font-bold">Frida</h1>
                                    </div>

                                    {menuItems.map((item) => (
                                        <div key={item.href} className="mb-1">
                                            <Link
                                                href={item.href}
                                                className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-primary/10 transition-colors"
                                            >
                                                <span className="text-lg font-medium">{item.label}</span>
                                            </Link>

                                            {item.hasDropdown && (
                                                <div className="ml-4 border-l border-primary/20 pl-4 py-2 mt-1 mb-3">
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
                                        {/* Login and signup buttons in mobile menu */}
                                        <div className="flex flex-col gap-2 px-4 mb-4">
                                            <Button variant="default" className="w-full justify-center">Login</Button>
                                            <Button className="w-full justify-center">Get Started</Button>
                                        </div>

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