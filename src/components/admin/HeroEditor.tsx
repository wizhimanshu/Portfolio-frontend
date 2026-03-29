import React, { useEffect, useState } from 'react'
import { getHero, updateHero } from '../../api/hero'
import { uploadImage } from '../../api/upload'

const HeroEditor = () => {
  const [form, setForm] = useState({ name: '', tagline: '', description: '', cvUrl: '' })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getHero().then(data => {
      setForm({ name: data.name, tagline: data.tagline, description: data.description, cvUrl: data.cvUrl || '' })
    }).finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSuccess(false)
    try {
      await updateHero(form)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadImage(file)
      setForm(f => ({ ...f, cvUrl: res.url }))
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <div style={{ color: '#b4b4b4' }}>Loading...</div>

  return (
    <div>
      <h2 style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Hero Section</h2>
      <p style={{ color: '#a1a1aa', fontSize: '14px', marginBottom: '32px' }}>Edit your hero section content</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
        <div>
          <label style={{ display: 'block', color: '#a1a1aa', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Full Name</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ width: '100%', padding: '12px 16px', backgroundColor: '#111111', border: '1px solid #27272a', borderRadius: '10px', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} onFocus={e => (e.currentTarget.style.borderColor = '#22c55e')} onBlur={e => (e.currentTarget.style.borderColor = '#27272a')} />
        </div>

        <div>
          <label style={{ display: 'block', color: '#a1a1aa', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Tagline (badge text)</label>
          <input value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} style={{ width: '100%', padding: '12px 16px', backgroundColor: '#111111', border: '1px solid #27272a', borderRadius: '10px', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} onFocus={e => (e.currentTarget.style.borderColor = '#22c55e')} onBlur={e => (e.currentTarget.style.borderColor = '#27272a')} />
        </div>

        <div>
          <label style={{ display: 'block', color: '#a1a1aa', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Description</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} style={{ width: '100%', padding: '12px 16px', backgroundColor: '#111111', border: '1px solid #27272a', borderRadius: '10px', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} onFocus={e => (e.currentTarget.style.borderColor = '#22c55e')} onBlur={e => (e.currentTarget.style.borderColor = '#27272a')} />
        </div>

        <div>
          <label style={{ display: 'block', color: '#a1a1aa', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>CV / Resume Link</label>
          <input
            value={form.cvUrl}
            onChange={e => setForm(f => ({ ...f, cvUrl: e.target.value }))}
            placeholder="https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing"
            style={{ width: '100%', padding: '12px 16px', backgroundColor: '#111111', border: '1px solid #27272a', borderRadius: '10px', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const }}
            onFocus={e => (e.currentTarget.style.borderColor = '#22c55e')}
            onBlur={e => (e.currentTarget.style.borderColor = '#27272a')}
          />
          <p style={{ color: '#71717a', fontSize: '12px', marginTop: '6px' }}>Paste your Google Drive shareable link — visitors can preview and download from there</p>
        </div>

        <button onClick={handleSave} disabled={saving} style={{ padding: '13px 28px', backgroundColor: saving ? '#166534' : '#22c55e', color: '#0a0a0a', fontWeight: '700', fontSize: '14px', border: 'none', borderRadius: '10px', cursor: saving ? 'not-allowed' : 'pointer', width: 'fit-content', transition: 'background-color 0.2s' }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>

        {success && <p style={{ color: '#22c55e', fontSize: '13px' }}>✓ Changes saved successfully!</p>}
      </div>
    </div>
  )
}

export default HeroEditor