import { cn } from "@/lib/utils";
import React from "react";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    containerClassName?: string;
}

export function Section({ children, className, containerClassName, ...props }: SectionProps) {
    return (
        <section className={cn("py-16 md:py-24", className)} {...props}>
            <div className={cn("container mx-auto px-4 md:px-6 max-w-6xl", containerClassName)}>
                {children}
            </div>
        </section>
    );
}
