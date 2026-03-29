import { useEffect } from 'react'
import api from '../api/axios'

export const useWarmup = () => {
    useEffect(() => {
        api.get('/hero').catch(() => { })
    }, [])
}