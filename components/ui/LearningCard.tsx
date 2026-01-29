import * as React from "react"
import { cn } from "@/lib/utils"

const LearningCard = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-2xl border-4 border-learning-bg/5 bg-learning-surface text-learning-bg shadow-xl",
            "p-6 md:p-10",
            className
        )}
        {...props}
    />
))
LearningCard.displayName = "LearningCard"

export { LearningCard }
