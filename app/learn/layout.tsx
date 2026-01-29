import { ReactNode } from "react";

export default function LearningLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen bg-learning-bg text-learning-surface font-sans selection:bg-learning-gold selection:text-learning-bg">
            {/* 
              Grain texture is inherited from global body but background color is overridden.
              We ensure the main shell is Indigo Night.
            */}
            <main className="relative z-10 w-full">
                {children}
            </main>
        </div>
    );
}
