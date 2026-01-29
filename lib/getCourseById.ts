import fs from 'fs'
import path from 'path'
import { Course } from './getCourses'

export async function getCourseById(courseId: string): Promise<Course | null> {
  const coursesDir = path.join(process.cwd(), 'content', 'courses')
  const filePath = path.join(coursesDir, `${courseId}.json`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(fileContent) as Course
  } catch {
    return null
  }
}

export async function getLessonById(courseId: string, lessonId: string) {
  const course = await getCourseById(courseId)
  if (!course) return null

  for (const module of course.modules) {
    const lesson = module.lessons.find((l) => l.lessonId === lessonId)
    if (lesson) {
      return { lesson, module, course }
    }
  }

  return null
}
