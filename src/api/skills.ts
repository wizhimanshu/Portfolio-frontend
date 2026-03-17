import api from './axios'

export const getSkills = () => api.get('/skills').then(r => r.data)
export const createSkill = (data: any) => api.post('/skills', data).then(r => r.data)
export const updateSkill = (id: string, data: any) => api.put(`/skills/${id}`, data).then(r => r.data)
export const deleteSkill = (id: string) => api.delete(`/skills/${id}`).then(r => r.data)