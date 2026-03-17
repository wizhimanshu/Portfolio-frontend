import api from './axios'

export const getHero = () => api.get('/hero').then(r => r.data)
export const updateHero = (data: any) => api.put('/hero', data).then(r => r.data)