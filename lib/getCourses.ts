import fs from 'fs'
import path from 'path'

export type Course = {
  courseId: string
  title: string
  description: string
  modules: Module[]
}

export type Module = {
  moduleId: string
  title: string
  lessons: Lesson[]
}

export type Lesson =
  | {
    lessonId: string
    type: 'lesson'
    title: string
    content: any[]
  }
  | {
    lessonId: string
    type: 'quiz'
    title: string
    questions: any[]
  }
  | {
    lessonId: string
    type: 'canvas'
    title: string
    config: Record<string, any>
  }

export async function getCourses(): Promise<Course[]> {
  const coursesDir = path.join(process.cwd(), 'content', 'courses')

  if (!fs.existsSync(coursesDir)) {
    return []
  }

  const files = fs.readdirSync(coursesDir).filter((file) => file.endsWith('.json'))

  const courses: Course[] = files.map((file) => {
    const filePath = path.join(coursesDir, file)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(fileContent) as Course
  })

  return courses
}
