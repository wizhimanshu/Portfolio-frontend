import React, { useEffect, useState } from 'react'
import { getProjects, createProject, updateProject, deleteProject } from '../../api/projects'
import { getCategories } from '../../api/categories'
import { uploadImage } from '../../api/upload'
import { Project, Category } from '../../types'
import { Trash2, Pencil, Plus, X, ExternalLink, Github } from 'lucide-react'

const emptyForm = {
  title: '',
  description: '',
  imageUrl: '',
  githubUrl: '',
  liveUrl: '',
  tags: '',
  isFeatured: false,
  projectDate: new Date().toISOString().slice(0, 10),
  categoryId: '',
}

const ProjectForm = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [filterCategory, setFilterCategory] = useState('')

  const fetchAll = () => {
    getProjects().then(setProjects).catch(() => { })
    getCategories().then(setCategories).catch(() => { })
  }

  useEffect(() => { fetchAll() }, [])

  const handleEdit = (project: Project) => {
    setEditingId(project.id)
    setForm({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl || '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      tags: project.tags.join(', '),
      isFeatured: project.isFeatured,
      projectDate: new Date(project.projectDate).toISOString().slice(0, 10),
      categoryId: project.categoryId || '',
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
    if (!form.title || !form.description) return
    setLoading(true)
    try {
      const data = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      }
      if (editingId) {
        await updateProject(editingId, data)
      } else {
        await createProject(data)
      }
      handleCancel()
      fetchAll()
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return
    await deleteProject(id)
    fetchAll()
  }

  const filteredProjects = filterCategory
    ? projects.filter(p => p.categoryId === filterCategory)
    : projects

  const inputStyle = { width: '100%', padding: '11px 14px', backgroundColor: '#0a0a0a', border: '1px solid #27272a', borderRadius: '8px', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const }
  const focusStyle = (e: React.FocusEvent<any>) => (e.currentTarget.style.borderColor = '#22c55e')
  const blurStyle = (e: React.FocusEvent<any>) => (e.currentTarget.style.borderColor = '#27272a')

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h2 style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700', margin: 0 }}>Projects</h2>
          <p style={{ color: '#52525b', fontSize: '14px', marginTop: '4px', marginBottom: 0 }}>{projects.length} total projects</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', backgroundColor: '#22c55e', color: '#0a0a0a', fontWeight: '700', fontSize: '14px', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
            <Plus size={16} /> Add Project
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '28px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '700', margin: 0 }}>{editingId ? 'Edit Project' : 'New Project'}</h3>
            <button onClick={handleCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a', display: 'flex' }}>
              <X size={20} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>Title *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Project title" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>Description *</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Project description" rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={focusStyle} onBlur={blurStyle} />
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
                <label style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backgroundColor: '#0a0a0a', border: '1px dashed #27272a', borderRadius: '8px', cursor: 'pointer', color: '#71717a', fontSize: '13px', minHeight: '80px' }}>
                  {uploading ? 'Uploading...' : form.imageUrl ? 'Change Image' : '+ Upload Image'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>GitHub URL</label>
              <input value={form.githubUrl} onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))} placeholder="https://github.com/..." style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </div>

            <div>
              <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>Live URL</label>
              <input value={form.liveUrl} onChange={e => setForm(f => ({ ...f, liveUrl: e.target.value }))} placeholder="https://..." style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </div>

            <div>
              <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>Domain</label>
              <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">No Domain</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>Project Date</label>
              <input type="date" value={form.projectDate} onChange={e => setForm(f => ({ ...f, projectDate: e.target.value }))} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>Tags (comma separated)</label>
              <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="React, NestJS, TypeScript..." style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} style={{ width: '16px', height: '16px', accentColor: '#22c55e' }} />
                <span style={{ color: '#a1a1aa', fontSize: '14px' }}>Show in Featured Projects on home page</span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button onClick={handleSubmit} disabled={loading} style={{ padding: '11px 28px', backgroundColor: '#22c55e', color: '#0a0a0a', fontWeight: '700', fontSize: '14px', border: 'none', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Saving...' : editingId ? 'Update Project' : 'Add Project'}
            </button>
            <button onClick={handleCancel} style={{ padding: '11px 20px', backgroundColor: 'transparent', color: '#71717a', fontWeight: '600', fontSize: '14px', border: '1px solid #27272a', borderRadius: '10px', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={() => setFilterCategory('')} style={{ padding: '6px 16px', borderRadius: '999px', border: '1px solid', borderColor: filterCategory === '' ? '#22c55e' : '#27272a', backgroundColor: filterCategory === '' ? '#22c55e11' : 'transparent', color: filterCategory === '' ? '#22c55e' : '#71717a', fontSize: '13px', cursor: 'pointer' }}>
          All ({projects.length})
        </button>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setFilterCategory(cat.id)} style={{ padding: '6px 16px', borderRadius: '999px', border: '1px solid', borderColor: filterCategory === cat.id ? '#22c55e' : '#27272a', backgroundColor: filterCategory === cat.id ? '#22c55e11' : 'transparent', color: filterCategory === cat.id ? '#22c55e' : '#71717a', fontSize: '13px', cursor: 'pointer' }}>
            {cat.name} ({cat._count?.projects || 0})
          </button>
        ))}
      </div>

      {/* Projects List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredProjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#3f3f46' }}>
            <p>No projects yet. Click "Add Project" to get started.</p>
          </div>
        ) : (
          filteredProjects.map(project => (
            <div key={project.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#111111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '16px' }}>
              {project.imageUrl ? (
                <img src={project.imageUrl} alt={project.title} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
              ) : (
                <div style={{ width: '80px', height: '60px', backgroundColor: '#1a1a1a', borderRadius: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#3f3f46', fontSize: '11px' }}>No img</span>
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ color: '#ffffff', fontSize: '15px', fontWeight: '600', margin: 0 }}>{project.title}</h3>
                  {project.isFeatured && <span style={{ padding: '2px 8px', backgroundColor: '#22c55e22', border: '1px solid #22c55e44', borderRadius: '999px', color: '#22c55e', fontSize: '11px' }}>Featured</span>}
                  {project.category && <span style={{ padding: '2px 8px', backgroundColor: '#27272a', borderRadius: '999px', color: '#a1a1aa', fontSize: '11px' }}>{project.category.name}</span>}
                </div>
                <p style={{ color: '#52525b', fontSize: '13px', margin: '4px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.description}</p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                  {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#52525b', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', textDecoration: 'none' }}><Github size={12} /> GitHub</a>}
                  {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#52525b', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', textDecoration: 'none' }}><ExternalLink size={12} /> Live</a>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => handleEdit(project)} style={{ padding: '8px', backgroundColor: '#1a1a1a', border: '1px solid #27272a', borderRadius: '8px', cursor: 'pointer', color: '#a1a1aa', display: 'flex' }}>
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(project.id)} style={{ padding: '8px', backgroundColor: '#1a1a1a', border: '1px solid #27272a', borderRadius: '8px', cursor: 'pointer', color: '#a1a1aa', display: 'flex' }} onMouseEnter={e => (e.currentTarget.style.color = '#f87171')} onMouseLeave={e => (e.currentTarget.style.color = '#a1a1aa')}>
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

export default ProjectForm