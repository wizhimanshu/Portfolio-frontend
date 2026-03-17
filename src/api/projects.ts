import api from './axios'

export const getProjects = (categoryId?: string) =>
  api.get('/projects', { params: { categoryId } }).then(r => r.data)

export const getFeaturedProjects = () =>
  api.get('/projects/featured').then(r => r.data)

export const getMonthlyAnalytics = () =>
  api.get('/projects/analytics/monthly').then(r => r.data)

export const getProject = (id: string) =>
  api.get(`/projects/${id}`).then(r => r.data)

export const createProject = (data: any) =>
  api.post('/projects', data).then(r => r.data)

export const updateProject = (id: string, data: any) =>
  api.put(`/projects/${id}`, data).then(r => r.data)

export const deleteProject = (id: string) =>
  api.delete(`/projects/${id}`).then(r => r.data)