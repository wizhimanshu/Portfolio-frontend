import React, { useEffect, useState } from 'react'
import { getAchievements } from '../api/achievements'
import { Achievement } from '../types'
import { ExternalLink, Trophy, Award, Star } from 'lucide-react'

const typeConfig: Record<string, { label: string, color: string, icon: any }> = {
    hackathon: { label: 'Hackathon', color: '#f59e0b', icon: Trophy },
    certificate: { label: 'Certificate', color: '#3b82f6', icon: Award },
    award: { label: 'Award', color: '#22c55e', icon: Star },
}

const Achievements = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([])
    const [filter, setFilter] = useState('all')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAchievements()
            .then(setAchievements)
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const filtered = filter === 'all' ? achievements : achievements.filter(a => a.type === filter)

    const counts = {
        all: achievements.length,
        hackathon: achievements.filter(a => a.type === 'hackathon').length,
        certificate: achievements.filter(a => a.type === 'certificate').length,
        award: achievements.filter(a => a.type === 'award').length,
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', padding: '60px 64px' }}>
            {/* Header */}
            <div style={{ marginBottom: '48px' }}>
                <p style={{ color: '#22c55e', fontSize: '13px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Accomplishments</p>
                <h1 style={{ color: '#ffffff', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '800', letterSpacing: '-0.02em', margin: '0 0 12px' }}>Achievements</h1>
                <p style={{ color: '#52525b', fontSize: '15px', margin: 0 }}>Hackathons, certifications and awards I've earned along the way.</p>
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', flexWrap: 'wrap' }}>
                {['all', 'hackathon', 'certificate', 'award'].map(type => (
                    <button key={type} onClick={() => setFilter(type)} style={{ padding: '8px 20px', borderRadius: '999px', border: '1px solid', borderColor: filter === type ? '#22c55e' : '#27272a', backgroundColor: filter === type ? '#22c55e11' : 'transparent', color: filter === type ? '#22c55e' : '#71717a', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize' }}>
                        {type === 'all' ? 'All' : typeConfig[type]?.label} ({counts[type as keyof typeof counts]})
                    </button>
                ))}
            </div>

            {/* Grid */}
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {[1, 2, 3].map(i => <div key={i} style={{ height: '320px', backgroundColor: '#111111', borderRadius: '16px', border: '1px solid #1a1a1a' }} />)}
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px 0', color: '#3f3f46' }}>
                    <p>No achievements in this category yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {filtered.map(achievement => (
                        <AchievementCard key={achievement.id} achievement={achievement} />
                    ))}
                </div>
            )}
        </div>
    )
}

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
    const [hovered, setHovered] = useState(false)
    const config = typeConfig[achievement.type] || { label: achievement.type, color: '#22c55e', icon: Star }
    const Icon = config.icon

    return (
        <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ backgroundColor: '#111111', borderRadius: '16px', border: `1px solid ${hovered ? '#27272a' : '#1a1a1a'}`, overflow: 'hidden', transition: 'all 0.2s', transform: hovered ? 'translateY(-4px)' : 'translateY(0)', boxShadow: hovered ? `0 8px 32px ${config.color}11` : 'none' }}>
            {/* Image */}
            {achievement.imageUrl ? (
                <div style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
                    <img src={achievement.imageUrl} alt={achievement.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s', transform: hovered ? 'scale(1.05)' : 'scale(1)' }} />
                </div>
            ) : (
                <div style={{ width: '100%', height: '160px', backgroundColor: '#161616', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={48} color={config.color} opacity={0.3} />
                </div>
            )}

            <div style={{ padding: '20px' }}>
                {/* Type badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '999px', backgroundColor: `${config.color}11`, border: `1px solid ${config.color}33`, color: config.color, fontSize: '11px', fontWeight: '600' }}>
                        <Icon size={10} /> {config.label}
                    </span>
                    <span style={{ color: '#3f3f46', fontSize: '12px', marginLeft: 'auto' }}>{achievement.date ? new Date(achievement.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}</span>
                </div>

                <h3 style={{ color: '#ffffff', fontSize: '17px', fontWeight: '700', margin: '0 0 6px', letterSpacing: '-0.01em' }}>{achievement.title}</h3>
                <p style={{ color: '#71717a', fontSize: '13px', fontWeight: '500', margin: '0 0 10px' }}>{achievement.organization}</p>
                <p style={{ color: '#52525b', fontSize: '13px', lineHeight: '1.6', margin: '0 0 16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{achievement.description}</p>

                {achievement.driveLink && (
                    <a href={achievement.driveLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#1a1a1a', border: '1px solid #27272a', borderRadius: '8px', color: '#a1a1aa', fontSize: '13px', fontWeight: '500', textDecoration: 'none', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#22c55e'; e.currentTarget.style.color = '#22c55e' }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#27272a'; e.currentTarget.style.color = '#a1a1aa' }}>
                        <ExternalLink size={14} /> View Certificate
                    </a>
                )}
            </div>
        </div>
    )
}

export default Achievements