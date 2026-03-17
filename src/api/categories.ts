import api from './axios'

export const getCategories = () => api.get('/categories').then(r => r.data)
export const createCategory = (data: any) => api.post('/categories', data).then(r => r.data)
export const updateCategory = (id: string, data: any) => api.put(`/categories/${id}`, data).then(r => r.data)
export const deleteCategory = (id: string) => api.delete(`/categories/${id}`).then(r => r.data)