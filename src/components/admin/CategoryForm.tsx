import React, { useEffect, useState } from 'react'
import { getCategories, createCategory, deleteCategory, updateCategory } from '../../api/categories'
import { Trash2 } from 'lucide-react'
import { Category } from '../../types'


const CategoryForm = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchCategories = () => {
    getCategories().then(setCategories).catch(() => { })
  }

  useEffect(() => { fetchCategories() }, [])

  const handleAdd = async () => {
    if (!name.trim()) return
    setLoading(true)
    try {
      await createCategory({ name })
      setName('')
      fetchCategories()
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return
    await deleteCategory(id)
    fetchCategories()
  }

  const handleReorder = async (cat: Category, index: number, direction: 'up' | 'down') => {
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    const swapCat = categories[swapIndex]
    await updateCategory(cat.id, { order: swapCat.order })
    await updateCategory(swapCat.id, { order: cat.order })
    fetchCategories()
  }

  return (
    <div>
      <h2 style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Domains</h2>
      <p style={{ color: '#52525b', fontSize: '14px', marginBottom: '32px' }}>Manage your project categories</p>

      {/* Add */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', maxWidth: '500px' }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Full Stack, AI/ML..." onKeyDown={e => e.key === 'Enter' && handleAdd()} style={{ flex: 1, padding: '12px 16px', backgroundColor: '#111111', border: '1px solid #27272a', borderRadius: '10px', color: '#ffffff', fontSize: '14px', outline: 'none' }} onFocus={e => (e.currentTarget.style.borderColor = '#22c55e')} onBlur={e => (e.currentTarget.style.borderColor = '#27272a')} />
        <button onClick={handleAdd} disabled={loading} style={{ padding: '12px 24px', backgroundColor: '#22c55e', color: '#0a0a0a', fontWeight: '700', fontSize: '14px', border: 'none', borderRadius: '10px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          {loading ? '...' : 'Add'}
        </button>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '500px' }}>
        {categories.map((cat, index) => (
          <div key={cat.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', backgroundColor: '#111111', border: '1px solid #1a1a1a', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <button onClick={() => handleReorder(cat, index, 'up')} disabled={index === 0} style={{ background: 'none', border: 'none', cursor: index === 0 ? 'not-allowed' : 'pointer', color: index === 0 ? '#3f3f46' : '#71717a', padding: '2px', display: 'flex' }}>▲</button>
                <button onClick={() => handleReorder(cat, index, 'down')} disabled={index === categories.length - 1} style={{ background: 'none', border: 'none', cursor: index === categories.length - 1 ? 'not-allowed' : 'pointer', color: index === categories.length - 1 ? '#3f3f46' : '#71717a', padding: '2px', display: 'flex' }}>▼</button>
              </div>
              <div>
                <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: '500', margin: 0 }}>{cat.name}</p>
                <p style={{ color: '#52525b', fontSize: '12px', margin: 0 }}>{cat._count?.projects || 0} projects</p>
              </div>
            </div>
            <button onClick={() => handleDelete(cat.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#52525b', display: 'flex', padding: '4px' }} onMouseEnter={e => (e.currentTarget.style.color = '#f87171')} onMouseLeave={e => (e.currentTarget.style.color = '#52525b')}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryForm