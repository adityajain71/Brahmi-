import { LearningCard } from "@/components/ui/LearningCard";

export function LearningStats() {
    const stats = [
        { icon: "🔥", label: "Day Streak", value: "2" },
        { icon: "📜", label: "Letters Learned", value: "5" },
        { icon: "🏆", label: "Current Rank", value: "Scholar" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto px-4 mb-12">
            {stats.map((stat) => (
                <LearningCard key={stat.label} className="flex items-center space-x-4 p-4 py-3 md:py-4 border-2 border-learning-bg/5 hover:border-learning-gold/30 transition-colors">
                    <span className="text-2xl">{stat.icon}</span>
                    <div className="flex flex-col text-left">
                        <span className="text-xs uppercase tracking-wider opacity-70 font-bold">{stat.label}</span>
                        <span className="text-lg font-serif font-bold text-learning-gold">{stat.value}</span>
                    </div>
                </LearningCard>
            ))}
        </div>
    );
}
