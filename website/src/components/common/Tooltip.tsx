"use client";

import { useState, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";

interface MouseTooltipProps {
    children: ReactNode;
    content: ReactNode;
}

export function MouseTooltip({ children, content }: MouseTooltipProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [mounted, setMounted] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isHovered) {
                x.set(e.clientX + 12);
                y.set(e.clientY + 12);
            }
        };

        if (isHovered) {
            window.addEventListener("mousemove", handleMouseMove);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [isHovered, x, y]);

    const handleMouseEnter = (e: React.MouseEvent) => {
        const targetX = e.clientX + 12;
        const targetY = e.clientY + 12;
        x.set(targetX);
        y.set(targetY);
        setIsHovered(true);
    };

    const tooltip = (
        <AnimatePresence>
            {isHovered && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        x,
                        y,
                        zIndex: 99999,
                        pointerEvents: "none",
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-[#0d0e12]/5 backdrop-blur-xs border border-white/[0.08] shadow-xl text-[11px] font-medium text-white tracking-wide select-none"
                >
                    {content}
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            <span
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setIsHovered(false)}
                className="cursor-help inline-flex"
            >
                {children}
            </span>
            {mounted && createPortal(tooltip, document.body)}
        </>
    );
}
