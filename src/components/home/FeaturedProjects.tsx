import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Github, ExternalLink, ArrowRight } from 'lucide-react'
import { getFeaturedProjects } from '../../api/projects'
import { Project } from '../../types'
import { useBreakpoint } from '../../hooks/useBreakpoint'


const FeaturedProjects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const { isMobile, isTablet } = useBreakpoint()

  useEffect(() => {
    getFeaturedProjects()
      .then(setProjects)
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section style={{
      backgroundColor: '#0a0a0a',
      padding: isMobile ? '40px 24px' : '40px 64px',

      margin: '0 auto',
      borderTop: '1px solid #27272a',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '12px' : '0',
        marginBottom: '48px',
      }}>
        <div>
          <h2 style={{ color: '#ffffff', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>
            Featured Projects
          </h2>
        </div>
        <Link to="/projects" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', color: '#b4b4b4', fontSize: '14px', fontWeight: '500', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={e => (e.currentTarget.style.color = '#b4b4b4')}
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div style={{ display: 'flex', gap: '24px' , gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',}}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              flex: 1,
              height: '320px',
              backgroundColor: '#111111',
              borderRadius: '16px',
              border: '1px solid #1a1a1a',
              animation: 'pulse 2s infinite',
            }} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 0',
          color: '#71717a',
        }}>
          <p style={{ fontSize: '16px' }}>No featured projects yet.</p>
          <p style={{ fontSize: '13px', marginTop: '8px' }}>Add projects from the admin panel and mark them as featured.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: '24px',
        }}>
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  )
}

const ProjectCard = ({ project }: { project: Project }) => {
  const [expanded, setExpanded] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: '#111111',
        borderRadius: '16px',
        border: `1px solid ${hovered ? '#27272a' : '#1a1a1a'}`,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.2s, transform 0.2s',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      {/* Image */}
      {project.imageUrl ? (
        <div style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
          <img
            src={project.imageUrl}
            alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
          />
        </div>
      ) : (
        <div style={{
          width: '100%',
          height: '200px',
          backgroundColor: '#1a1a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ color: '#71717a', fontSize: '13px' }}>No preview</span>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {/* Category */}
        {project.category && (
          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#22c55e',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            {project.category.name}
          </span>
        )}

        {/* Title */}
        <h3 style={{
          color: '#ffffff',
          fontSize: '18px',
          fontWeight: '700',
          margin: '8px 0',
          letterSpacing: '-0.01em',
        }}>
          {project.title}
        </h3>

        {/* Description */}
        <p style={{
          color: '#b4b4b4',
          fontSize: '14px',
          lineHeight: '1.6',
          margin: 0,
          display: expanded ? 'block' : '-webkit-box',
          WebkitLineClamp: expanded ? 'unset' : 2,
          WebkitBoxOrient: 'vertical',
          overflow: expanded ? 'visible' : 'hidden',
        }}>
          {project.description}
        </p>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
            {project.tags.map(tag => (
              <span key={tag} style={{
                padding: '3px 10px',
                borderRadius: '999px',
                backgroundColor: '#1a1a1a',
                border: '1px solid #27272a',
                color: '#a1a1aa',
                fontSize: '11px',
                fontWeight: '500',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #1a1a1a' }}>
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b4b4b4', fontSize: '13px', textDecoration: 'none' }}>
              <Github size={14} /> GitHub
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b4b4b4', fontSize: '13px', textDecoration: 'none' }}>
              <ExternalLink size={14} /> Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default FeaturedProjects