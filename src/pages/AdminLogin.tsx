import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../api/axios'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', { email, password })
      login(res.data.accessToken, res.data.admin)
      navigate('/admin')
    } catch {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '0 24px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#0a0a0a', fontWeight: '800', fontSize: '20px' }}>H</div>
          <h1 style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700', margin: 0 }}>Admin Login</h1>
          <p style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '8px' }}>Sign in to manage your portfolio</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: '#a1a1aa', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="yourid.dev"
              required
              style={{ width: '100%', padding: '12px 16px', backgroundColor: '#111111', border: '1px solid #27272a', borderRadius: '10px', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => (e.currentTarget.style.borderColor = '#22c55e')}
              onBlur={e => (e.currentTarget.style.borderColor = '#27272a')}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#a1a1aa', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ width: '100%', padding: '12px 16px', backgroundColor: '#111111', border: '1px solid #27272a', borderRadius: '10px', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => (e.currentTarget.style.borderColor = '#22c55e')}
              onBlur={e => (e.currentTarget.style.borderColor = '#27272a')}
            />
          </div>

          {error && (
            <div style={{ padding: '12px 16px', backgroundColor: '#7f1d1d22', border: '1px solid #7f1d1d', borderRadius: '10px', color: '#f87171', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '13px', backgroundColor: loading ? '#166534' : '#22c55e', color: '#0a0a0a', fontWeight: '700', fontSize: '14px', border: 'none', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s', marginTop: '8px' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin