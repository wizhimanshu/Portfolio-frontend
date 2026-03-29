import React, { useEffect, useState } from 'react'
import { getSkills, createSkill, deleteSkill, updateSkill } from '../../api/skills'
import { Trash2, Plus } from 'lucide-react'
import { Skill } from '../../types'

const SkillForm = () => {
  const [skills, setSkills] = useState<Skill[]>([])
  const [form, setForm] = useState({ name: '', icon: '', color: '#22c55e', usageCount: 1, order: 0 })
  const [showAdd, setShowAdd] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchSkills = () => getSkills().then(setSkills).catch(() => { })

  useEffect(() => { fetchSkills() }, [])

  const handleAdd = async () => {
    if (!form.name.trim()) return
    setLoading(true)
    try {
      await createSkill(form)
      setForm({ name: '', icon: '', color: '#22c55e', usageCount: 1, order: 0 })
      setShowAdd(false)
      fetchSkills()
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return
    await deleteSkill(id)
    fetchSkills()
  }

  const handleUsageChange = async (skill: Skill, val: number) => {
    if (isNaN(val)) return
    await updateSkill(skill.id, { usageCount: val })
    fetchSkills()
  }

  const handleOrderChange = async (skill: Skill, val: number) => {
    if (isNaN(val)) return
    await updateSkill(skill.id, { order: val })
    fetchSkills()
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h2 style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700', margin: 0 }}>Skills</h2>
          <p style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '4px', marginBottom: 0 }}>Manage your tech stack — set order number to rearrange</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', backgroundColor: '#22c55e', color: '#0a0a0a', fontWeight: '700', fontSize: '14px', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '20px', marginBottom: '24px', maxWidth: '500px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Skill name (e.g. React)" style={{ padding: '10px 14px', backgroundColor: '#0a0a0a', border: '1px solid #27272a', borderRadius: '8px', color: '#ffffff', fontSize: '14px', outline: 'none' }} onFocus={e => (e.currentTarget.style.borderColor = '#22c55e')} onBlur={e => (e.currentTarget.style.borderColor = '#27272a')} />
            <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="Icon key (e.g. react, nestjs, python)" style={{ padding: '10px 14px', backgroundColor: '#0a0a0a', border: '1px solid #27272a', borderRadius: '8px', color: '#ffffff', fontSize: '14px', outline: 'none' }} onFocus={e => (e.currentTarget.style.borderColor = '#22c55e')} onBlur={e => (e.currentTarget.style.borderColor = '#27272a')} />
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#b4b4b4', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Color</label>
                <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} style={{ width: '100%', height: '40px', padding: '2px', backgroundColor: '#0a0a0a', border: '1px solid #27272a', borderRadius: '8px', cursor: 'pointer' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#b4b4b4', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Projects used in</label>
                <input type="number" value={form.usageCount} onChange={e => setForm(f => ({ ...f, usageCount: parseInt(e.target.value) }))} min={1} style={{ width: '100%', padding: '10px 14px', backgroundColor: '#0a0a0a', border: '1px solid #27272a', borderRadius: '8px', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#b4b4b4', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Order</label>
                <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) }))} min={0} style={{ width: '100%', padding: '10px 14px', backgroundColor: '#0a0a0a', border: '1px solid #27272a', borderRadius: '8px', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <button onClick={handleAdd} disabled={loading} style={{ padding: '11px', backgroundColor: '#22c55e', color: '#0a0a0a', fontWeight: '700', fontSize: '14px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              {loading ? 'Adding...' : 'Add Skill'}
            </button>
          </div>
        </div>
      )}

      {/* Skills Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
        {skills.map((skill) => (
          <div key={skill.id} style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: skill.color || '#22c55e', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600', margin: 0 }}>{skill.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#a1a1aa', fontSize: '11px' }}>Usage:</span>
                    <input type="number" value={skill.usageCount} onChange={e => handleUsageChange(skill, parseInt(e.target.value))} min={1} style={{ width: '44px', padding: '2px 6px', backgroundColor: '#0a0a0a', border: '1px solid #27272a', borderRadius: '4px', color: '#b4b4b4', fontSize: '11px', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#a1a1aa', fontSize: '11px' }}>Order:</span>
                    <input type="number" value={skill.order} onChange={e => handleOrderChange(skill, parseInt(e.target.value))} min={0} style={{ width: '44px', padding: '2px 6px', backgroundColor: '#0a0a0a', border: '1px solid #22c55e44', borderRadius: '4px', color: '#22c55e', fontSize: '11px', outline: 'none' }} />
                  </div>
                </div>
              </div>
            </div>
            <button onClick={() => handleDelete(skill.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a1a1aa', display: 'flex', padding: '4px', flexShrink: 0 }} onMouseEnter={e => (e.currentTarget.style.color = '#f87171')} onMouseLeave={e => (e.currentTarget.style.color = '#a1a1aa')}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Order hint */}
      <p style={{ color: '#71717a', fontSize: '12px', marginTop: '16px' }}>💡 Lower order number = appears first. Changes apply instantly.</p>
    </div>
  )
}

export default SkillForm