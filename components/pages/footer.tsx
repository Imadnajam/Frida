'use client';

import * as React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Twitter, Github, AtSign } from 'lucide-react';
import { COMPANY_DETAILS } from '@/utils/constants';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-background border-t">
            <div className="container mx-auto py-12 px-4">
                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">{COMPANY_DETAILS.name}</h2>
                        <p className="text-muted-foreground mb-4">
                            {COMPANY_DETAILS.mission}
                        </p>
                        <div className="flex space-x-4">
                            <a href={COMPANY_DETAILS.socialMedia.twitter} aria-label="Twitter" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href={COMPANY_DETAILS.socialMedia.github} aria-label="GitHub" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Github size={20} />
                            </a>
                            <a href={COMPANY_DETAILS.socialMedia.discord} aria-label="Discord" className="text-muted-foreground hover:text-foreground transition-colors">
                                <AtSign size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Features */}
                    <div>
                        <h3 className="font-semibold mb-4">Features</h3>
                        <ul className="space-y-2">
                            {COMPANY_DETAILS.features.map((feature, index) => (
                                <li key={index}>
                                    <span className="text-muted-foreground">
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <MapPin size={20} className="mr-2 mt-0.5 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                    {COMPANY_DETAILS.address.street}, {COMPANY_DETAILS.address.city}, {COMPANY_DETAILS.address.state} {COMPANY_DETAILS.address.zip}, {COMPANY_DETAILS.address.country}
                                </span>
                            </li>
                            <li className="flex items-center">
                                <Phone size={20} className="mr-2 text-muted-foreground" />
                                <a href={`tel:${COMPANY_DETAILS.phone}`} className="text-muted-foreground hover:text-foreground transition-colors">
                                    {COMPANY_DETAILS.phone}
                                </a>
                            </li>
                            <li className="flex items-center">
                                <Mail size={20} className="mr-2 text-muted-foreground" />
                                <a href={`mailto:${COMPANY_DETAILS.email}`} className="text-muted-foreground hover:text-foreground transition-colors">
                                    {COMPANY_DETAILS.email}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                

                
            </div>
        </footer>
    );
};

export default Footer;