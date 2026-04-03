import React, { useEffect, useState } from 'react'
import { Github, ExternalLink } from 'lucide-react'
import { getProjects } from '../api/projects'
import { getCategories } from '../api/categories'
import { Project, Category } from '../types'
import { useBreakpoint } from '../hooks/useBreakpoint'

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const { isMobile, isTablet } = useBreakpoint()

  useEffect(() => {
    getCategories().then(setCategories).catch(() => { })
    getProjects()
      .then(setProjects)
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeCategory
    ? projects.filter(p => p.categoryId === activeCategory)
    : projects

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', padding: isMobile ? '40px 20px' : '60px 64px' }}>
      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <p style={{ color: '#22c55e', fontSize: '13px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Work</p>
        <h1 style={{ color: '#ffffff', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>All Projects</h1>
        <p style={{ color: '#a1a1aa', fontSize: '15px', marginTop: '12px' }}>{projects.length} projects across {categories.length} Domains</p>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: isMobile? '6px' : '8px', flexWrap: 'wrap', marginBottom: '40px' }}>
        <button onClick={() => setActiveCategory('')} style={{ padding: '8px 20px', borderRadius: '999px', border: '1px solid', borderColor: activeCategory === '' ? '#22c55e' : '#27272a', backgroundColor: activeCategory === '' ? '#22c55e11' : 'transparent', color: activeCategory === '' ? '#22c55e' : '#b4b4b4', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s' }}>
          All ({projects.length})
        </button>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{ padding: '8px 20px', borderRadius: '999px', border: '1px solid', borderColor: activeCategory === cat.id ? '#22c55e' : '#27272a', backgroundColor: activeCategory === cat.id ? '#22c55e11' : 'transparent', color: activeCategory === cat.id ? '#22c55e' : '#b4b4b4', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s' }}>
            {cat.name} ({cat._count?.projects || 0})
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} style={{ height: '320px', backgroundColor: '#111111', borderRadius: '16px', border: '1px solid #1a1a1a' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px 0', color: '#71717a' }}>
          <p style={{ fontSize: '16px' }}>No projects in this domain yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {filtered.map(project => (
            <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  )
}

const ProjectCard = ({ project, onClick }: { project: Project, onClick: () => void }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ backgroundColor: '#111111', borderRadius: '16px', border: `1px solid ${hovered ? '#27272a' : '#1a1a1a'}`, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', transform: hovered ? 'translateY(-4px)' : 'translateY(0)' }}>
      {project.imageUrl ? (
        <div style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
          <img src={project.imageUrl} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s', transform: hovered ? 'scale(1.05)' : 'scale(1)' }} />
        </div>
      ) : (
        <div style={{ width: '100%', height: '200px', backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#71717a', fontSize: '13px' }}>No preview</span>
        </div>
      )}
      <div style={{ padding: '20px' }}>
        {project.category && <span style={{ fontSize: '11px', fontWeight: '600', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{project.category.name}</span>}
        <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '700', margin: '8px 0', letterSpacing: '-0.01em' }}>{project.title}</h3>
        <p style={{ color: '#b4b4b4', fontSize: '14px', lineHeight: '1.6', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{project.description}</p>
        {project.tags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
            {project.tags.slice(0, 3).map(tag => (
              <span key={tag} style={{ padding: '3px 10px', borderRadius: '999px', backgroundColor: '#1a1a1a', border: '1px solid #27272a', color: '#a1a1aa', fontSize: '11px' }}>{tag}</span>
            ))}
            {project.tags.length > 3 && <span style={{ padding: '3px 10px', borderRadius: '999px', backgroundColor: '#1a1a1a', border: '1px solid #27272a', color: '#a1a1aa', fontSize: '11px' }}>+{project.tags.length - 3}</span>}
          </div>
        )}
      </div>
    </div>
  )
}

const ProjectModal = ({ project, onClose }: { project: Project, onClose: () => void }) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: '#000000cc', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#111111', borderRadius: '20px', border: '1px solid #27272a', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}>
        {project.imageUrl && (
          <div style={{ width: '100%', height: '300px', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
            <img src={project.imageUrl} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
            <div>
              {project.category && <span style={{ fontSize: '11px', fontWeight: '600', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{project.category.name}</span>}
              <h2 style={{ color: '#ffffff', fontSize: '28px', fontWeight: '800', margin: '6px 0 0', letterSpacing: '-0.02em' }}>{project.title}</h2>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: '1px solid #27272a', borderRadius: '8px', cursor: 'pointer', color: '#b4b4b4', padding: '6px 10px', fontSize: '13px', flexShrink: 0 }}>ESC</button>
          </div>
          <p style={{ color: '#a1a1aa', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>{project.description}</p>
          {project.tags?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {project.tags.map(tag => (
                <span key={tag} style={{ padding: '4px 12px', borderRadius: '999px', backgroundColor: '#1a1a1a', border: '1px solid #27272a', color: '#a1a1aa', fontSize: '12px' }}>{tag}</span>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: '12px', paddingTop: '24px', borderTop: '1px solid #1a1a1a' }}>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#1a1a1a', border: '1px solid #27272a', borderRadius: '10px', color: '#ffffff', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
                <Github size={16} /> GitHub
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#22c55e', border: 'none', borderRadius: '10px', color: '#0a0a0a', fontSize: '14px', fontWeight: '700', textDecoration: 'none' }}>
                <ExternalLink size={16} /> Live Demo
              </a>
            )}
            <span style={{ marginLeft: 'auto', color: '#71717a', fontSize: '12px', alignSelf: 'center' }}>
              {new Date(project.projectDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Projects