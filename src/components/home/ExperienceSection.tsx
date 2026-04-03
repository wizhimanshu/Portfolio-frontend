import React, { useEffect, useState } from 'react'
import { getExperience } from '../../api/experience'
import { Experience } from '../../types'
import { useBreakpoint } from '../../hooks/useBreakpoint'

const ExperienceSection = () => {
    const [experiences, setExperiences] = useState<Experience[]>([])
    const { isMobile } = useBreakpoint()

    useEffect(() => {
        getExperience().then(setExperiences).catch(() => { })
    }, [])

    if (experiences.length === 0) return null

    return (
        <section id="experience" style={{ backgroundColor: '#0a0a0a', padding: isMobile ? '40px 20px 60px' : '80px 64px', borderTop: '1px solid #27272a' }}>
            <div style={{ margin: '0 auto' }}>
                <h2 style={{ color: '#ffffff', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '800', letterSpacing: '-0.02em', margin: '0 0 8px' }}>Experience</h2>
                <p style={{ color: '#a1a1aa', fontSize: '15px', margin: '0 0 64px' }}>My professional journey in software engineering.</p>

                <div style={{ position: 'relative' }}>
                    {/* Center vertical line */}
                    <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', backgroundColor: '#1a1a1a', transform: 'translateX(-50%)' }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                        {experiences.map((exp, index) => (
                            <ExperienceItem key={exp.id} exp={exp} isLeft={index % 2 === 0} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

const ExperienceItem = ({ exp, isLeft }: { exp: Experience, isLeft: boolean }) => {
  const [hovered, setHovered] = useState(false)
  const { isMobile } = useBreakpoint()

  const cardContent = (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ backgroundColor: hovered ? '#161616' : '#111111', border: `1px solid ${hovered ? '#27272a' : '#1a1a1a'}`, borderRadius: '16px', padding: '24px', transition: 'all 0.2s', width: '100%', textAlign: 'left', boxSizing: 'border-box' as const }}>
      <p style={{ color: '#22c55e', fontSize: '13px', fontWeight: '600', margin: '0 0 8px' }}>{exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}</p>
      <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '700', margin: '0 0 4px', letterSpacing: '-0.01em' }}>{exp.role}</h3>
      <p style={{ color: '#b4b4b4', fontSize: '14px', fontWeight: '500', margin: '0 0 10px' }}>{exp.company}</p>
      <p style={{ color: '#a1a1aa', fontSize: '13px', lineHeight: '1.7', margin: 0 }}>{exp.description}</p>
    </div>
  )

  // Mobile — simple vertical timeline
  if (isMobile) {
    return (
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '24px' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: hovered ? '#22c55e' : '#27272a', border: `2px solid ${hovered ? '#22c55e' : '#71717a'}`, transition: 'all 0.2s', zIndex: 1 }} />
        </div>
        <div style={{ flex: 1 }}>{cardContent}</div>
      </div>
    )
  }

  // Desktop — alternating left/right
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0', position: 'relative' }}>
      <div style={{ flex: 1, paddingRight: '48px', opacity: isLeft ? 1 : 0, pointerEvents: isLeft ? 'auto' : 'none' }}>
        {isLeft && cardContent}
      </div>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: '20px', paddingTop: '24px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: hovered ? '#22c55e' : '#27272a', border: `2px solid ${hovered ? '#22c55e' : '#71717a'}`, transition: 'all 0.2s' }} />
      </div>
      <div style={{ flex: 1, paddingLeft: '48px', opacity: isLeft ? 0 : 1, pointerEvents: isLeft ? 'none' : 'auto' }}>
        {!isLeft && cardContent}
      </div>
    </div>
  )
}

export default ExperienceSection