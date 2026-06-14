'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Home, Wallet, Users, Categories, Gear, Logout, Squares, ChevronLeft, Role, Chat } from '../../common/Icons';

export default function Sidebar() {
    const [view, setView] = useState<'home' | 'detail'>('home');
    const [selectedServer, setSelectedServer] = useState<string | null>(null);

    useEffect(() => {
        const handleViewChange = (e: Event) => {
            const customEvent = e as CustomEvent<{ view: 'home' | 'detail'; server?: string }>;
            if (customEvent.detail) {
                setView(customEvent.detail.view);
                if (customEvent.detail.server) {
                    setSelectedServer(customEvent.detail.server);
                }
            }
        };

        window.addEventListener('panel-view-change', handleViewChange);
        return () => {
            window.removeEventListener('panel-view-change', handleViewChange);
        };
    }, []);

    const handleBackToHome = () => {
        setView('home');
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('panel-view-change', {
                detail: { view: 'home' }
            }));
        }
    };

    return (
        <aside className="w-44 flex flex-col gap-10 text-zinc-500 font-normal shrink-0 pt-4 sticky top-12 h-fit">
            <div className="flex items-center px-2">
                <a href="/">
                    <img
                        src="/logo.jpg"
                        alt="Logo"
                        className="size-9 rounded-[10px] object-cover shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                    />
                </a>
            </div>

            <nav className="flex flex-col gap-3 px-1">
                {view === 'detail' ? (
                    <>
                        <button
                            onClick={handleBackToHome}
                            className="flex items-center gap-3.5 text-zinc-500 hover:text-white transition-colors text-[13px] font-normal cursor-pointer w-full text-left"
                        >
                            <ChevronLeft className="size-[18px]" />
                            Back to home
                        </button>

                        <div className="h-px bg-white/[0.05] my-1" />

                        <button className="flex items-center gap-3.5 text-white transition-colors text-[13px] font-normal w-full text-left cursor-pointer">
                            <Squares className="size-[18px]" />
                            Overview
                        </button>

                        <button className="flex items-center gap-3.5 text-zinc-500 hover:text-white transition-colors text-[13px] font-normal w-full text-left cursor-pointer">
                            <Users className="size-[18px]" />
                            Members
                        </button>

                        <button className="flex items-center gap-3.5 text-zinc-500 hover:text-white transition-colors text-[13px] font-normal w-full text-left cursor-pointer">
                            <Chat className="size-[18px]" />
                            Responders
                        </button>

                        <button className="flex items-center gap-3.5 text-zinc-500 hover:text-white transition-colors text-[13px] font-normal w-full text-left cursor-pointer">
                            <Role className="size-[18px]" />
                            Auto Role
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/panel" className="flex items-center gap-3.5 text-white transition-colors text-[13px] font-normal">
                            <Home className="size-[18px]" />
                            Home
                        </Link>
                        <Link href="/panel" className="flex items-center gap-3.5 hover:text-white transition-colors text-[13px] text-zinc-500">
                            <Wallet className="size-[18px]" />
                            Wallet
                        </Link>
                        <Link href="/panel" className="flex items-center gap-3.5 hover:text-white transition-colors text-[13px] text-zinc-500">
                            <Users className="size-[18px]" />
                            Communities
                        </Link>
                        <Link href="/panel" className="flex items-center gap-3.5 hover:text-white transition-colors text-[13px] text-zinc-500">
                            <Categories className="size-[18px]" />
                            Categories
                        </Link>

                        <div className="h-px bg-white/[0.05] my-1" />

                        <Link href="/panel" className="flex items-center gap-3.5 hover:text-white transition-colors text-[13px] text-zinc-500">
                            <Gear className="size-[18px]" />
                            Settings
                        </Link>
                    </>
                )}

                <button
                    onClick={() => signOut({ redirectTo: '/' })}
                    className="flex items-center gap-3.5 hover:text-white transition-colors text-[13px] text-zinc-500 w-full text-left cursor-pointer mt-1"
                >
                    <Logout className="size-[18px]" />
                    Logout
                </button>
            </nav>
        </aside>
    );
}
