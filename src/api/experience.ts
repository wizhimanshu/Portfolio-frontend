import api from './axios'

export const getExperience = () => api.get('/experience').then(r => r.data)
export const createExperience = (data: any) => api.post('/experience', data).then(r => r.data)
export const updateExperience = (id: string, data: any) => api.put(`/experience/${id}`, data).then(r => r.data)
export const deleteExperience = (id: string) => api.delete(`/experience/${id}`).then(r => r.data)