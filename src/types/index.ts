export interface Hero {
  id: string
  name: string
  tagline: string
  description: string
  cvUrl?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  order: number
  _count?: { projects: number }
}

export interface Project {
  id: string
  title: string
  description: string
  imageUrl?: string
  githubUrl?: string
  liveUrl?: string
  tags: string[]
  isFeatured: boolean
  projectDate: string
  category?: Category
  categoryId?: string
  createdAt: string
}

export interface Skill {
  id: string
  name: string
  icon?: string
  color?: string
  usageCount: number
  order: number
}

export interface Experience {
  id: string
  role: string
  company: string
  description: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  order: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  type: string
  organization: string
  date: string
  imageUrl?: string
  driveLink?: string
  isFeatured: boolean
  createdAt: string
}