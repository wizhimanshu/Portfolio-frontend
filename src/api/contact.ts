import api from './axios'

export const sendContactMessage = (data: { name: string; email: string; message: string }) =>
    api.post('/contact', data).then(r => r.data)