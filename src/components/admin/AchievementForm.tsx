import React, { useEffect, useState } from 'react'
import { getAchievements, createAchievement, updateAchievement, deleteAchievement } from '../../api/achievements'
import { uploadImage } from '../../api/upload'
import { Achievement } from '../../types'
import { Trash2, Pencil, Plus, X, ExternalLink } from 'lucide-react'

const emptyForm = {
    title: '',
    description: '',
    type: 'certificate',
    organization: '',
    date: new Date().toISOString().slice(0, 10),
    imageUrl: '',
    driveLink: '',
    isFeatured: false,
}

const AchievementForm = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([])
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [filter, setFilter] = useState('all')

    const fetchAll = () => getAchievements().then(setAchievements).catch(() => { })

    useEffect(() => { fetchAll() }, [])

    const handleEdit = (a: Achievement) => {
        setEditingId(a.id)

        // Try to parse existing date, fallback to today
        let dateValue = new Date().toISOString().slice(0, 10)
        if (a.date) {
            const parsed = new Date(a.date)
            if (!isNaN(parsed.getTime())) {
                dateValue = parsed.toISOString().slice(0, 10)
            }
        }

        setForm({
            title: a.title,
            description: a.description,
            type: a.type,
            organization: a.organization,
            date: dateValue,
            imageUrl: a.imageUrl || '',
            driveLink: a.driveLink || '',
            isFeatured: a.isFeatured,
        })
        setShowForm(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleCancel = () => {
        setShowForm(false)
        setEditingId(null)
        setForm(emptyForm)
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(true)
        try {
            const res = await uploadImage(file)
            setForm(f => ({ ...f, imageUrl: res.url }))
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async () => {
        if (!form.title || !form.organization || !form.date) return
        setLoading(true)
        try {
            if (editingId) {
                await updateAchievement(editingId, form)
            } else {
                await createAchievement(form)
            }
            handleCancel()
            fetchAll()
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this achievement?')) return
        await deleteAchievement(id)
        fetchAll()
    }

    const filtered = filter === 'all' ? achievements : achievements.filter(a => a.type === filter)

    const inputStyle = { width: '100%', padding: '11px 14px', backgroundColor: '#0a0a0a', border: '1px solid #27272a', borderRadius: '8px', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const }
    const focusStyle = (e: React.FocusEvent<any>) => (e.currentTarget.style.borderColor = '#22c55e')
    const blurStyle = (e: React.FocusEvent<any>) => (e.currentTarget.style.borderColor = '#27272a')

    const typeColors: Record<string, string> = {
        hackathon: '#f59e0b',
        certificate: '#3b82f6',
        award: '#22c55e',
    }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700', margin: 0 }}>Achievements</h2>
                    <p style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '4px', marginBottom: 0 }}>{achievements.length} total achievements</p>
                </div>
                {!showForm && (
                    <button onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', backgroundColor: '#22c55e', color: '#0a0a0a', fontWeight: '700', fontSize: '14px', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
                        <Plus size={16} /> Add Achievement
                    </button>
                )}
            </div>

            {/* Form */}
            {showForm && (
                <div style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '28px', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '700', margin: 0 }}>{editingId ? 'Edit Achievement' : 'New Achievement'}</h3>
                        <button onClick={handleCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b4b4b4', display: 'flex' }}>
                            <X size={20} />
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>Title *</label>
                            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. First Place - HackIndia 2024" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                        </div>

                        <div>
                            <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>Type</label>
                            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                                <option value="certificate">Certificate</option>
                                <option value="hackathon">Hackathon</option>
                                <option value="award">Award</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>Organization *</label>
                            <input value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} placeholder="e.g. Google, HackIndia..." style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                        </div>

                        <div>
                            <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>Date *</label>
                            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                        </div>

                        <div>
                            <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>Drive Link (PDF/Certificate)</label>
                            <input value={form.driveLink} onChange={e => setForm(f => ({ ...f, driveLink: e.target.value }))} placeholder="https://drive.google.com/..." style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>Description</label>
                            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description of this achievement..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={focusStyle} onBlur={blurStyle} />
                        </div>

                        {/* Image Upload */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>Preview Image</label>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                {form.imageUrl && (
                                    <div style={{ position: 'relative', width: '120px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #27272a', flexShrink: 0 }}>
                                        <img src={form.imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button onClick={() => setForm(f => ({ ...f, imageUrl: '' }))} style={{ position: 'absolute', top: '4px', right: '4px', background: '#0a0a0a', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#f87171', display: 'flex', padding: '2px' }}>
                                            <X size={12} />
                                        </button>
                                    </div>
                                )}
                                <label style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backgroundColor: '#0a0a0a', border: '1px dashed #27272a', borderRadius: '8px', cursor: 'pointer', color: '#b4b4b4', fontSize: '13px', minHeight: '80px' }}>
                                    {uploading ? 'Uploading...' : form.imageUrl ? 'Change Image' : '+ Upload Image'}
                                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                </label>
                            </div>
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} style={{ width: '16px', height: '16px', accentColor: '#22c55e' }} />
                                <span style={{ color: '#a1a1aa', fontSize: '14px' }}>Mark as featured</span>
                            </label>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button onClick={handleSubmit} disabled={loading} style={{ padding: '11px 28px', backgroundColor: '#22c55e', color: '#0a0a0a', fontWeight: '700', fontSize: '14px', border: 'none', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer' }}>
                            {loading ? 'Saving...' : editingId ? 'Update' : 'Add Achievement'}
                        </button>
                        <button onClick={handleCancel} style={{ padding: '11px 20px', backgroundColor: 'transparent', color: '#b4b4b4', fontWeight: '600', fontSize: '14px', border: '1px solid #27272a', borderRadius: '10px', cursor: 'pointer' }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Filter */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {['all', 'certificate', 'hackathon', 'award'].map(type => (
                    <button key={type} onClick={() => setFilter(type)} style={{ padding: '6px 16px', borderRadius: '999px', border: '1px solid', borderColor: filter === type ? '#22c55e' : '#27272a', backgroundColor: filter === type ? '#22c55e11' : 'transparent', color: filter === type ? '#22c55e' : '#b4b4b4', fontSize: '13px', cursor: 'pointer', textTransform: 'capitalize' }}>
                        {type === 'all' ? `All (${achievements.length})` : `${type} (${achievements.filter(a => a.type === type).length})`}
                    </button>
                ))}
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#71717a' }}>
                        <p>No achievements yet. Click "Add Achievement" to get started.</p>
                    </div>
                ) : (
                    filtered.map(a => (
                        <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#111111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '16px' }}>
                            {a.imageUrl ? (
                                <img src={a.imageUrl} alt={a.title} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                            ) : (
                                <div style={{ width: '80px', height: '60px', backgroundColor: '#1a1a1a', borderRadius: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ color: '#71717a', fontSize: '11px' }}>No img</span>
                                </div>
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <h3 style={{ color: '#ffffff', fontSize: '15px', fontWeight: '600', margin: 0 }}>{a.title}</h3>
                                    <span style={{ padding: '2px 8px', backgroundColor: `${typeColors[a.type] || '#22c55e'}22`, border: `1px solid ${typeColors[a.type] || '#22c55e'}44`, borderRadius: '999px', color: typeColors[a.type] || '#22c55e', fontSize: '11px', textTransform: 'capitalize' }}>{a.type}</span>
                                </div>
                                <p style={{ color: '#a1a1aa', fontSize: '13px', margin: '4px 0 0' }}>{a.organization} · {a.date}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                {a.driveLink && <a href={a.driveLink} target="_blank" rel="noopener noreferrer" style={{ padding: '8px', backgroundColor: '#1a1a1a', border: '1px solid #27272a', borderRadius: '8px', cursor: 'pointer', color: '#a1a1aa', display: 'flex', textDecoration: 'none' }}><ExternalLink size={14} /></a>}
                                <button onClick={() => handleEdit(a)} style={{ padding: '8px', backgroundColor: '#1a1a1a', border: '1px solid #27272a', borderRadius: '8px', cursor: 'pointer', color: '#a1a1aa', display: 'flex' }}><Pencil size={14} /></button>
                                <button onClick={() => handleDelete(a.id)} style={{ padding: '8px', backgroundColor: '#1a1a1a', border: '1px solid #27272a', borderRadius: '8px', cursor: 'pointer', color: '#a1a1aa', display: 'flex' }} onMouseEnter={e => (e.currentTarget.style.color = '#f87171')} onMouseLeave={e => (e.currentTarget.style.color = '#a1a1aa')}><Trash2 size={14} /></button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default AchievementForm