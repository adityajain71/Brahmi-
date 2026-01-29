import Link from "next/link";
import { LearningCard } from "@/components/ui/LearningCard";
import { cn } from "@/lib/utils";

const PATHS = [
    {
        id: "vowels",
        title: "Swar (Vowels)",
        icon: "𑀅",
        desc: "The soul of the script",
        color: "bg-blue-100", // Soft helper colors
        href: "/learn/lesson/swar-a",
        status: "unlocked"
    },
    {
        id: "consonants",
        title: "Vyanjan (Consonants)",
        icon: "𑀓",
        desc: "The body of the script",
        color: "bg-green-100",
        href: "/learn/lesson/consonant-ka", // Assuming exists or placeholder
        status: "locked"
    },
    {
        id: "numbers",
        title: "Anka (Numbers)",
        icon: "𑁒",
        desc: "Ancient counting",
        color: "bg-orange-100",
        href: "#",
        status: "locked"
    },
    {
        id: "practice",
        title: "Practice Zone",
        icon: "✍️",
        desc: "Master your strokes",
        color: "bg-purple-100",
        href: "#",
        status: "locked"
    }
];

export function LearningPathGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4">
            {PATHS.map((path) => (
                <Link
                    key={path.id}
                    href={path.status === 'locked' ? '#' : path.href}
                    className={path.status === 'locked' ? 'pointer-events-none opacity-80' : ''}
                >
                    <LearningCard className={cn(
                        "group hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden h-full",
                        path.status === 'locked' ? "grayscale-[0.5]" : ""
                    )}>
                        <div className="flex items-start space-x-6">
                            {/* Icon Box */}
                            <div className={cn(
                                "w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-inner",
                                path.color
                            )}>
                                {path.icon}
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 pt-1">
                                <h3 className="text-xl font-serif font-bold text-learning-bg group-hover:text-learning-gold transition-colors">
                                    {path.title}
                                </h3>
                                <p className="text-sm text-learning-bg/70 mt-1 font-medium">
                                    {path.desc}
                                </p>

                                {/* Status Indicator */}
                                <div className="mt-4 inline-flex items-center text-xs font-bold uppercase tracking-widest text-learning-info">
                                    {path.status === 'locked' ? (
                                        <span className="flex items-center gap-1">🔒 Locked</span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-learning-success">▶ Start Level</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </LearningCard>
                </Link>
            ))}
        </div>
    );
}
