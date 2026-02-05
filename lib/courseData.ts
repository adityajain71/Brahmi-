export type CourseModule = {
    id: string
    title: string
    subtitle: string
    route: string
    icon: string
    iconType: 'text' | 'emoji' // Helper to style emoji vs text differently if needed
    order: number
}

export const COURSE_MODULES: CourseModule[] = [
    {
        id: 'module-intro',
        title: 'Introduction',
        subtitle: 'History of Brahmi',
        route: '#', // Placeholder
        icon: '📜',
        iconType: 'emoji',
        order: 1
    },
    {
        id: 'module-swar',
        title: 'Swar (Vowels)',
        subtitle: 'The Soul of Script',
        route: '/letters', // Connected to existing vowels page
        icon: 'अ',
        iconType: 'text',
        order: 2
    },
    {
        id: 'module-vyanjan',
        title: 'Vyanjan (Consonants)',
        subtitle: 'The Body of Script',
        route: '/consonants', // Connected to consonants journey page
        icon: 'क',
        iconType: 'text',
        order: 3
    },
    {
        id: 'module-matra',
        title: 'Mātrā / Barakhadi',
        subtitle: 'The Art of Combination',
        route: '#', // Placeholder
        icon: 'का',
        iconType: 'text',
        order: 4
    }
]
