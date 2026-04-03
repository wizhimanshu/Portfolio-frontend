import React, { useEffect, useState } from 'react'
import { getProjects } from '../api/projects'
import { getSkills } from '../api/skills'
import { getCategories } from '../api/categories'
import { getAchievements } from '../api/achievements'
import { Project, Skill, Category, Achievement } from '../types'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts'
import { Github, ExternalLink, Trophy, Award, Star } from 'lucide-react'
import { useBreakpoint } from '../hooks/useBreakpoint'

const CurrentMonthCluster = ({ projects, achievements, categories }: { projects: Project[], achievements: Achievement[], categories: Category[] }) => {
  const now = new Date()
  const currentMonth = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const [hoveredItem, setHoveredItem] = useState<any>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const { isMobile, isTablet } = useBreakpoint()

  const currentProjects = projects.filter(p => {
    const d = new Date(p.projectDate)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const currentAchievements = achievements.filter(a => {
    if (!a.date) return false
    const d = new Date(a.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const palette = ['#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b']
  const categoryColors: Record<string, string> = {}
  categories.forEach((cat, i) => { categoryColors[cat.id] = palette[i % palette.length] })
  const achievementColor = '#f59e0b'

  const allGroups = [...categories.map(c => c.id), 'achievement']
  const clusterCenters: Record<string, { cx: number, cy: number }> = {}
  allGroups.forEach((groupId, i) => {
    const angle = (i / allGroups.length) * 2 * Math.PI - Math.PI / 2
    const radius = allGroups.length <= 2 ? 60 : allGroups.length <= 4 ? 75 : 85
    clusterCenters[groupId] = { cx: 250 + radius * Math.cos(angle), cy: 130 + radius * Math.sin(angle) }
  })

  const dots: any[] = []
  currentProjects.forEach((p, i) => {
    const center = clusterCenters[p.categoryId || ''] || { cx: 250, cy: 180 }
    const sameGroup = currentProjects.filter(x => x.categoryId === p.categoryId)
    const angle = (sameGroup.findIndex(x => x.id === p.id) / Math.max(sameGroup.length, 1)) * 2 * Math.PI
    const r = 10 + (i % 3) * 8
    dots.push({ id: p.id, x: center.cx + r * Math.cos(angle), y: center.cy + r * Math.sin(angle), color: categoryColors[p.categoryId || ''] || '#22c55e', label: p.title, sublabel: p.category?.name || 'Project', type: 'project' })
  })
  currentAchievements.forEach((a, i) => {
    const center = clusterCenters['achievement'] || { cx: 250, cy: 180 }
    const angle = (i / Math.max(currentAchievements.length, 1)) * 2 * Math.PI
    const r = 10 + (i % 3) * 8
    dots.push({ id: a.id, x: center.cx + r * Math.cos(angle), y: center.cy + r * Math.sin(angle), color: achievementColor, label: a.title, sublabel: a.type, type: 'achievement' })
  })

  const hasData = dots.length > 0


  return (
    <div style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a', borderRadius: '16px', padding:  '28px', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div>
          <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '700', margin: '0 0 4px' }}>Monthly Activity</h3>
          <p style={{ color: '#a1a1aa', fontSize: '13px', margin: 0 }}>Cluster view — hover dots for details</p>
        </div>
        <span style={{ padding: '4px 12px', backgroundColor: '#22c55e11', border: '1px solid #22c55e33', borderRadius: '999px', color: '#22c55e', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>{currentMonth}</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', marginTop: '12px' }}>
        {categories.map((cat, i) => (
          <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: palette[i % palette.length] }} />
            <span style={{ color: '#b4b4b4', fontSize: '12px' }}>{cat.name}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: achievementColor }} />
          <span style={{ color: '#b4b4b4', fontSize: '12px' }}>Achievements</span>
        </div>
      </div>

      {!hasData ? (
        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
          <p style={{ color: '#71717a', fontSize: '14px', margin: 0 }}>No activity this month yet</p>
          <p style={{ color: '#27272a', fontSize: '12px', margin: 0 }}>Add projects or achievements to see clusters</p>
        </div>
      ) : (
        <div style={{ position: 'relative' }} onMouseMove={e => { const rect = e.currentTarget.getBoundingClientRect(); setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top }) }}>
          <svg width="100%" viewBox="0 0 500 260" height="220" style={{ overflow: 'visible' }}>
            {Array.from({ length: 8 }).map((_, i) => Array.from({ length: 6 }).map((_, j) => (
              <circle key={`${i}-${j}`} cx={40 + i * 60} cy={30 + j * 60} r={1.5} fill="#1a1a1a" />
            )))}
            {allGroups.map(groupId => {
              const center = clusterCenters[groupId]
              const color = groupId === 'achievement' ? achievementColor : categoryColors[groupId] || '#22c55e'
              const hasItems = groupId === 'achievement' ? currentAchievements.length > 0 : currentProjects.some(p => p.categoryId === groupId)
              if (!hasItems) return null
              return <circle key={groupId} cx={center.cx} cy={center.cy} r={55} fill={`${color}08`} stroke={`${color}15`} strokeWidth={1} strokeDasharray="4 4" />
            })}
            {dots.map((dot, i) => dots.slice(i + 1).map((other, j) => {
              if (dot.color !== other.color) return null
              const dist = Math.sqrt(Math.pow(dot.x - other.x, 2) + Math.pow(dot.y - other.y, 2))
              if (dist > 60) return null
              return <line key={`${i}-${j}`} x1={dot.x} y1={dot.y} x2={other.x} y2={other.y} stroke={dot.color} strokeWidth={0.5} strokeOpacity={0.2} />
            }))}
            {dots.map(dot => (
              <g key={dot.id} style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredItem(dot)} onMouseLeave={() => setHoveredItem(null)}>
                <circle cx={dot.x} cy={dot.y} r={hoveredItem?.id === dot.id ? 18 : 14} fill={dot.color} fillOpacity={0.15} />
                <circle cx={dot.x} cy={dot.y} r={hoveredItem?.id === dot.id ? 8 : 6} fill={dot.color} fillOpacity={0.9} stroke={dot.color} strokeWidth={1.5} />
                <circle cx={dot.x} cy={dot.y} r={2.5} fill="#ffffff" fillOpacity={0.8} />
              </g>
            ))}
            {allGroups.map(groupId => {
              const center = clusterCenters[groupId]
              const color = groupId === 'achievement' ? achievementColor : categoryColors[groupId] || '#22c55e'
              const label = groupId === 'achievement' ? 'Achievements' : categories.find(c => c.id === groupId)?.name || ''
              const hasItems = groupId === 'achievement' ? currentAchievements.length > 0 : currentProjects.some(p => p.categoryId === groupId)
              if (!hasItems) return null
              return <text key={groupId} x={center.cx} y={center.cy + 72} textAnchor="middle" fill={color} fontSize="11" fontWeight="600" opacity={0.7}>{label}</text>
            })}
          </svg>

          {hoveredItem && (
            <div style={{ position: 'absolute', left: Math.min(mousePos.x + 12, 320), top: Math.max(mousePos.y - 60, 0), backgroundColor: '#1a1a1a', border: `1px solid ${hoveredItem.color}44`, borderRadius: '10px', padding: '10px 14px', pointerEvents: 'none', zIndex: 10, minWidth: '160px', boxShadow: `0 4px 20px ${hoveredItem.color}22` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: hoveredItem.color, flexShrink: 0 }} />
                <p style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', margin: 0 }}>{hoveredItem.label}</p>
              </div>
              <p style={{ color: hoveredItem.color, fontSize: '11px', margin: 0, textTransform: 'capitalize' }}>{hoveredItem.sublabel}</p>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: '16px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #1a1a1a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
          <span style={{ color: '#b4b4b4', fontSize: '12px' }}>{currentProjects.length} project{currentProjects.length !== 1 ? 's' : ''} this month</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
          <span style={{ color: '#b4b4b4', fontSize: '12px' }}>{currentAchievements.length} achievement{currentAchievements.length !== 1 ? 's' : ''} this month</span>
        </div>
      </div>
    </div>
  )
}

const parseDate = (dateStr: string) => {
  if (!dateStr) return new Date(0)
  // Handle DD-MM-YYYY format
  if (dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) {
    const [day, month, year] = dateStr.split('-')
    return new Date(`${year}-${month}-${day}`)
  }
  return new Date(dateStr)
}

const Analytics = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [selectedType, setSelectedType] = useState<'project' | 'achievement' | 'publication' | null>(null)
  const { isMobile, isTablet } = useBreakpoint()

  useEffect(() => {
    Promise.all([
      getProjects().then(setProjects),
      getSkills().then(setSkills),
      getCategories().then(setCategories),
      getAchievements().then(setAchievements),
    ]).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setSelectedItem(null); setSelectedType(null) } }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  const categoryData = React.useMemo(() => {
    return categories.map(cat => ({ name: cat.name, value: projects.filter(p => p.categoryId === cat.id).length })).filter(c => c.value > 0)
  }, [projects, categories])

  const skillsData = React.useMemo(() => {
    return skills.slice(0, 8).map(s => ({ name: s.name, projects: s.usageCount, color: s.color || '#22c55e' }))
  }, [skills])

  const latestProject = React.useMemo(() => {
    return [...projects].sort((a, b) => new Date(b.projectDate).getTime() - new Date(a.projectDate).getTime())[0]
  }, [projects])

  const latestAchievement = React.useMemo(() => {
    return [...achievements]
      .filter(a => a.date)
      .sort((a, b) => parseDate(b.date!).getTime() - parseDate(a.date!).getTime())[0]
  }, [achievements])

  const latestPublication = React.useMemo(() => {
    return projects.filter(p => p.category?.slug === 'research' || p.category?.name?.toLowerCase() === 'publications').sort((a, b) => new Date(b.projectDate).getTime() - new Date(a.projectDate).getTime())[0]
  }, [projects])

  const PIE_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4']
  const typeIcons: Record<string, any> = { hackathon: Trophy, certificate: Award, award: Star }
  const typeColors: Record<string, string> = { hackathon: '#f59e0b', certificate: '#3b82f6', award: '#22c55e' }

  const SkillTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{ backgroundColor: '#111111', border: '1px solid #27272a', borderRadius: '10px', padding: '10px 14px' }}>
        <p style={{ color: '#ffffff', margin: 0, fontSize: '13px' }}>{payload[0].payload.name}</p>
        <p style={{ color: '#22c55e', margin: '4px 0 0', fontSize: '13px' }}>{payload[0].value} projects</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#a1a1aa' }}>Loading analytics...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', padding: isMobile ? '40px 20px': '60px 64px' }}>
      <div style={{ marginBottom: '48px' }}>
        <p style={{ color: '#22c55e', fontSize: '13px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Insights</p>
        <h1 style={{ color: '#ffffff', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>Analytics</h1>
        <p style={{ color: '#a1a1aa', fontSize: '15px', marginTop: '12px' }}>A dynamic overview of my work and tech stack</p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
        {[
          { label: 'Total Projects', value: projects.length },
          { label: 'Domains', value: categories.length },
          { label: 'Tech Skills', value: skills.length },
          { label: 'Achievements', value: achievements.length },
        ].map(stat => (
          <div key={stat.label} style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
            <p style={{ color: '#a1a1aa', fontSize: '13px', margin: '0 0 8px' }}>{stat.label}</p>
            <p style={{ color: '#ffffff', fontSize: '36px', fontWeight: '800', margin: 0, letterSpacing: '-0.02em' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Three Latest Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
        <div onClick={() => { setSelectedItem(latestProject); setSelectedType('project') }} style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ padding: '3px 10px', backgroundColor: '#22c55e22', border: '1px solid #22c55e44', borderRadius: '999px', color: '#22c55e', fontSize: '11px', fontWeight: '600' }}>Latest Project</span>
          </div>
          {latestProject ? (
            <>
              {latestProject.imageUrl && <img src={latestProject.imageUrl} alt={latestProject.title} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '10px', marginBottom: '12px' }} />}
              <p style={{ color: '#a1a1aa', fontSize: '11px', margin: '0 0 4px' }}>{latestProject.category?.name}</p>
              <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '700', margin: '0 0 6px' }}>{latestProject.title}</h3>
              <p style={{ color: '#b4b4b4', fontSize: '13px', margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{latestProject.description}</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {latestProject.githubUrl && <a href={latestProject.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#a1a1aa', fontSize: '12px', textDecoration: 'none' }}><Github size={12} /> GitHub</a>}
                {latestProject.liveUrl && <a href={latestProject.liveUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#a1a1aa', fontSize: '12px', textDecoration: 'none' }}><ExternalLink size={12} /> Live</a>}
              </div>
              <p style={{ color: '#71717a', fontSize: '11px', margin: '12px 0 0' }}>{new Date(latestProject.projectDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </>
          ) : <p style={{ color: '#71717a', fontSize: '14px' }}>No projects yet</p>}
        </div>

        <div onClick={() => { setSelectedItem(latestAchievement); setSelectedType('achievement') }} style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ padding: '3px 10px', backgroundColor: '#f59e0b22', border: '1px solid #f59e0b44', borderRadius: '999px', color: '#f59e0b', fontSize: '11px', fontWeight: '600' }}>Latest Achievement</span>
          </div>
          {latestAchievement ? (
            <>
              {latestAchievement.imageUrl && <img src={latestAchievement.imageUrl} alt={latestAchievement.title} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '10px', marginBottom: '12px' }} />}
              {!latestAchievement.imageUrl && (
                <div style={{ width: '100%', height: '80px', backgroundColor: '#161616', borderRadius: '10px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {React.createElement(typeIcons[latestAchievement.type] || Trophy, { size: 32, color: typeColors[latestAchievement.type] || '#f59e0b', opacity: 0.5 })}
                </div>
              )}

              <span style={{ padding: '2px 8px', backgroundColor: `${typeColors[latestAchievement.type] || '#f59e0b'}22`, borderRadius: '999px', color: typeColors[latestAchievement.type] || '#f59e0b', fontSize: '11px', textTransform: 'capitalize' }}>{latestAchievement.type}</span>
              <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '700', margin: '8px 0 4px' }}>{latestAchievement.title}</h3>
              <p style={{ color: '#b4b4b4', fontSize: '13px', margin: '0 0 12px' }}>{latestAchievement.organization}</p>
              {latestAchievement.driveLink && <a href={latestAchievement.driveLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#a1a1aa', fontSize: '12px', textDecoration: 'none' }}><ExternalLink size={12} /> View Certificate</a>}
              <p style={{ color: '#71717a', fontSize: '11px', margin: '12px 0 0' }}>{latestAchievement.date ? parseDate(latestAchievement.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}</p>
            </>
          ) : <p style={{ color: '#71717a', fontSize: '14px' }}>No achievements yet</p>}
        </div>

        <div onClick={() => { setSelectedItem(latestPublication); setSelectedType('publication') }} style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ padding: '3px 10px', backgroundColor: '#8b5cf622', border: '1px solid #8b5cf644', borderRadius: '999px', color: '#8b5cf6', fontSize: '11px', fontWeight: '600' }}>Latest Publication</span>
          </div>
          {latestPublication ? (
            <>
              {latestPublication.imageUrl && <img src={latestPublication.imageUrl} alt={latestPublication.title} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '10px', marginBottom: '12px' }} />}
              <p style={{ color: '#a1a1aa', fontSize: '11px', margin: '0 0 4px' }}>Publications</p>
              <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '700', margin: '0 0 6px' }}>{latestPublication.title}</h3>
              <p style={{ color: '#b4b4b4', fontSize: '13px', margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{latestPublication.description}</p>
              {latestPublication.liveUrl && <a href={latestPublication.liveUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#a1a1aa', fontSize: '12px', textDecoration: 'none' }}><ExternalLink size={12} /> View Paper</a>}
              <p style={{ color: '#71717a', fontSize: '11px', margin: '12px 0 0' }}>{new Date(latestPublication.projectDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </>
          ) : <p style={{ color: '#71717a', fontSize: '14px' }}>No publications yet</p>}
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: '24px', marginBottom: '40px' }}>
        <CurrentMonthCluster projects={projects} achievements={achievements} categories={categories} />

        <div style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '700', margin: '0 0 6px' }}>By Domain</h3>
          <p style={{ color: '#a1a1aa', fontSize: '13px', margin: '0 0 0px' }}>Project distribution</p>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', marginTop: '-16px' }}>
            {categoryData.length === 0 ? (
              <p style={{ color: '#71717a', fontSize: '14px' }}>No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
              <PieChart margin={{ bottom: 5 }}>
                <Pie data={categoryData} cx="50%" cy="45%" innerRadius={65} outerRadius={100} paddingAngle={4} dataKey="value">
                  {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(val, name) => [val, name]} contentStyle={{ backgroundColor: '#111111', border: '1px solid #27272a', borderRadius: '10px', color: '#ffffff' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ paddingTop: '16px' }} formatter={(val) => <span style={{ color: '#a1a1aa', fontSize: '12px' }}>{val}</span>} />
              </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Tech Stack Usage */}
      <div style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '28px' }}>
        <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '700', margin: '0 0 6px' }}>Tech Stack Usage</h3>
        <p style={{ color: '#a1a1aa', fontSize: '13px', margin: '0 0 28px' }}>How often each technology is used across projects</p>
        {skillsData.length === 0 ? (
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#71717a', fontSize: '14px' }}>No skills added yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={skillsData} layout="vertical" barSize={18}>
              <XAxis type="number" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 13 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip content={<SkillTooltip />} cursor={{ fill: '#ffffff08' }} />
              <Bar dataKey="projects" radius={[0, 6, 6, 0]}>
                {skillsData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      {selectedItem && selectedType && (
        <div onClick={() => { setSelectedItem(null); setSelectedType(null) }} style={{ position: 'fixed', inset: 0, backgroundColor: '#000000cc', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#111111', borderRadius: '20px', border: '1px solid #27272a', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}>
            {selectedItem.imageUrl && (
              <div style={{ width: '100%', height: '300px', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
                <img src={selectedItem.imageUrl} alt={selectedItem.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
                <div>
                  {selectedType === 'project' && selectedItem.category && <span style={{ fontSize: '11px', fontWeight: '600', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{selectedItem.category.name}</span>}
                  {selectedType === 'achievement' && <span style={{ fontSize: '11px', fontWeight: '600', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{selectedItem.type}</span>}
                  {selectedType === 'publication' && <span style={{ fontSize: '11px', fontWeight: '600', color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Publication</span>}
                  <h2 style={{ color: '#ffffff', fontSize: '28px', fontWeight: '800', margin: '6px 0 0', letterSpacing: '-0.02em' }}>{selectedItem.title}</h2>
                </div>
                <button onClick={() => { setSelectedItem(null); setSelectedType(null) }} style={{ background: 'none', border: '1px solid #27272a', borderRadius: '8px', cursor: 'pointer', color: '#a1a1aa', padding: '6px 10px', fontSize: '13px', flexShrink: 0 }}>ESC</button>
              </div>

              {selectedType === 'achievement' && <p style={{ color: '#a1a1aa', fontSize: '14px', margin: '0 0 16px' }}>{selectedItem.organization}</p>}

              <p style={{ color: '#a1a1aa', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>{selectedItem.description}</p>

              {selectedItem.tags?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                  {selectedItem.tags.map((tag: string) => (
                    <span key={tag} style={{ padding: '4px 12px', borderRadius: '999px', backgroundColor: '#1a1a1a', border: '1px solid #27272a', color: '#a1a1aa', fontSize: '12px' }}>{tag}</span>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', paddingTop: '24px', borderTop: '1px solid #1a1a1a', flexWrap: 'wrap' }}>
                {selectedItem.githubUrl && <a href={selectedItem.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#1a1a1a', border: '1px solid #27272a', borderRadius: '10px', color: '#ffffff', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>GitHub</a>}
                {selectedItem.liveUrl && <a href={selectedItem.liveUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#22c55e', border: 'none', borderRadius: '10px', color: '#0a0a0a', fontSize: '14px', fontWeight: '700', textDecoration: 'none' }}>Live Demo</a>}
                {selectedItem.driveLink && <a href={selectedItem.driveLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#1a1a1a', border: '1px solid #27272a', borderRadius: '10px', color: '#ffffff', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>View Certificate</a>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Analytics