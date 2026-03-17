import React, { useEffect, useState } from 'react'
import { getExperience, createExperience, updateExperience, deleteExperience } from '../../api/experience'
import { Experience } from '../../types'
import { Trash2, Pencil, Plus, X } from 'lucide-react'

const emptyForm = {
    role: '',
    company: '',
    description: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    order: 0,
}

const ExperienceForm = () => {
    const [experiences, setExperiences] = useState<Experience[]>([])
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [loading, setLoading] = useState(false)

    const fetchAll = () => getExperience().then(setExperiences).catch(() => { })

    useEffect(() => { fetchAll() }, [])

    const handleEdit = (exp: Experience) => {
        setEditingId(exp.id)
        setForm({ role: exp.role, company: exp.company, description: exp.description, startDate: exp.startDate, endDate: exp.endDate || '', isCurrent: exp.isCurrent, order: exp.order })
        setShowForm(true)
    }

    const handleCancel = () => {
        setShowForm(false)
        setEditingId(null)
        setForm(emptyForm)
    }

    const handleSubmit = async () => {
        if (!form.role || !form.company || !form.startDate) return
        setLoading(true)
        try {
            const data = { ...form, endDate: form.isCurrent ? undefined : form.endDate }
            if (editingId) {
                await updateExperience(editingId, data)
            } else {
                await createExperience(data)
            }
            handleCancel()
            fetchAll()
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this experience?')) return
        await deleteExperience(id)
        fetchAll()
    }

    const inputStyle = { width: '100%', padding: '11px 14px', backgroundColor: '#0a0a0a', border: '1px solid #27272a', borderRadius: '8px', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const }
    const focusStyle = (e: React.FocusEvent<any>) => (e.currentTarget.style.borderColor = '#22c55e')
    const blurStyle = (e: React.FocusEvent<any>) => (e.currentTarget.style.borderColor = '#27272a')

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700', margin: 0 }}>Experience</h2>
                    <p style={{ color: '#52525b', fontSize: '14px', marginTop: '4px', marginBottom: 0 }}>Manage your professional journey</p>
                </div>
                {!showForm && (
                    <button onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', backgroundColor: '#22c55e', color: '#0a0a0a', fontWeight: '700', fontSize: '14px', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
                        <Plus size={16} /> Add Experience
                    </button>
                )}
            </div>

            {/* Form */}
            {showForm && (
                <div style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '28px', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '700', margin: 0 }}>{editingId ? 'Edit Experience' : 'New Experience'}</h3>
                        <button onClick={handleCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a', display: 'flex' }}>
                            <X size={20} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>Role / Title *</label>
                            <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. Full Stack Developer" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                        </div>

                        <div>
                            <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>Company *</label>
                            <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="e.g. Tech Solutions Inc." style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                        </div>

                        <div>
                            <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>Description *</label>
                            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What did you do there?" rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={focusStyle} onBlur={blurStyle} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>Start Date *</label>
                                <input value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} placeholder="e.g. 2022" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>End Date</label>
                                <input value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} placeholder="e.g. 2024" disabled={form.isCurrent} style={{ ...inputStyle, opacity: form.isCurrent ? 0.4 : 1 }} onFocus={focusStyle} onBlur={blurStyle} />
                            </div>
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <input type="checkbox" checked={form.isCurrent} onChange={e => setForm(f => ({ ...f, isCurrent: e.target.checked, endDate: e.target.checked ? '' : f.endDate }))} style={{ width: '16px', height: '16px', accentColor: '#22c55e' }} />
                            <span style={{ color: '#a1a1aa', fontSize: '14px' }}>I currently work here</span>
                        </label>

                        <div>
                            <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>Display Order</label>
                            <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) }))} min={0} style={{ ...inputStyle, width: '120px' }} onFocus={focusStyle} onBlur={blurStyle} />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                            <button onClick={handleSubmit} disabled={loading} style={{ padding: '11px 28px', backgroundColor: '#22c55e', color: '#0a0a0a', fontWeight: '700', fontSize: '14px', border: 'none', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer' }}>
                                {loading ? 'Saving...' : editingId ? 'Update' : 'Add Experience'}
                            </button>
                            <button onClick={handleCancel} style={{ padding: '11px 20px', backgroundColor: 'transparent', color: '#71717a', fontWeight: '600', fontSize: '14px', border: '1px solid #27272a', borderRadius: '10px', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {experiences.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#3f3f46' }}>
                        <p>No experience added yet. Click "Add Experience" to get started.</p>
                    </div>
                ) : (
                    experiences.map(exp => (
                        <div key={exp.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', backgroundColor: '#111111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '20px' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <span style={{ color: '#22c55e', fontSize: '12px', fontWeight: '600' }}>{exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}</span>
                                    {exp.isCurrent && <span style={{ padding: '2px 8px', backgroundColor: '#22c55e22', border: '1px solid #22c55e44', borderRadius: '999px', color: '#22c55e', fontSize: '11px' }}>Current</span>}
                                </div>
                                <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '700', margin: '0 0 2px' }}>{exp.role}</h3>
                                <p style={{ color: '#71717a', fontSize: '14px', margin: '0 0 8px' }}>{exp.company}</p>
                                <p style={{ color: '#52525b', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{exp.description}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                <button onClick={() => handleEdit(exp)} style={{ padding: '8px', backgroundColor: '#1a1a1a', border: '1px solid #27272a', borderRadius: '8px', cursor: 'pointer', color: '#a1a1aa', display: 'flex' }}>
                                    <Pencil size={14} />
                                </button>
                                <button onClick={() => handleDelete(exp.id)} style={{ padding: '8px', backgroundColor: '#1a1a1a', border: '1px solid #27272a', borderRadius: '8px', cursor: 'pointer', color: '#a1a1aa', display: 'flex' }} onMouseEnter={e => (e.currentTarget.style.color = '#f87171')} onMouseLeave={e => (e.currentTarget.style.color = '#a1a1aa')}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default ExperienceForm