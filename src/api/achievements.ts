import api from './axios'

export const getAchievements = () => api.get('/achievements').then(r => r.data)
export const createAchievement = (data: any) => api.post('/achievements', data).then(r => r.data)
export const updateAchievement = (id: string, data: any) => api.put(`/achievements/${id}`, data).then(r => r.data)
export const deleteAchievement = (id: string) => api.delete(`/achievements/${id}`).then(r => r.data)