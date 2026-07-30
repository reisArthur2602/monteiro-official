'use client';

import type { LucideIcon } from 'lucide-react';
import { CalendarClock, LayoutDashboard, ScrollText, Users, UsersRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';

import type { SessionUser } from '../types/session-user';
import { SidebarUser } from './sidebar-user';

type NavItem = {
    title: string;
    href: string;
    icon: LucideIcon;
};

type NavGroup = {
    label: string;
    items: NavItem[];
};

const navGroups: NavGroup[] = [
    {
        label: 'Escritório',
        items: [
            { title: 'Visão geral', href: '/', icon: LayoutDashboard },
            { title: 'Clientes', href: '/clients', icon: Users },

            { title: 'Agenda', href: '/schedule', icon: CalendarClock },
        ],
    },
    {
        label: 'Administração',
        items: [
            { title: 'Usuários', href: '/users', icon: UsersRound },

            { title: 'Modelos', href: '/templates', icon: ScrollText },
        ],
    },
];

const isItemActive = (pathname: string, href: string) => {
    if (href === '/') {
        return pathname === '/';
    }

    return pathname === href || pathname.startsWith(`${href}/`);
};

type AppSidebarProps = {
    user: SessionUser;
};

export const AppSidebar = ({ user }: AppSidebarProps) => {
    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <span className="grid size-8 shrink-0 place-items-center rounded-md border border-sidebar-border bg-sidebar-primary/20 font-heading text-lg font-semibold">
                                    §
                                </span>

                                <div className="grid flex-1 text-left leading-tight">
                                    <span className="truncate font-heading text-base font-semibold">
                                        Monteiro
                                    </span>
                                    <span className="truncate font-mono text-[10px] tracking-wider text-sidebar-foreground/60 uppercase">
                                        Gestão jurídica
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {navGroups.map((group) => (
                    <SidebarGroup key={group.label}>
                        <SidebarGroupLabel>{group.label}</SidebarGroupLabel>

                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isItemActive(pathname, item.href)}
                                            tooltip={item.title}
                                        >
                                            <Link href={item.href}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter>
                <SidebarUser user={user} />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
};
