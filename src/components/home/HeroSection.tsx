import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Download } from 'lucide-react'
import { SplineScene } from '../ui/SplineScene'
import { Spotlight } from '../ui/Spotlight'
import { getHero } from '../../api/hero'
import { Hero } from '../../types'
import { useBreakpoint } from '../../hooks/useBreakpoint'

const HeroSection = () => {
  const [hero, setHero] = useState<Hero>({
    id: '',
    name: 'Himanshu Kumar',
    tagline: 'Full Stack Developer & AI Enthusiast',
    description: 'I am a software development engineer, I love to transform ideas into intelligent softwares especially by leveraging AI and Machine learning.',
  })
  const { isMobile, isTablet } = useBreakpoint()
  const [sparkle, setSparkle] = useState<{ x: number, y: number, id: number } | null>(null)

  const handleTouch = (e: React.TouchEvent) => {
    if (!isMobile) return
    const touch = e.touches[0]
    const rect = e.currentTarget.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top
    setSparkle({ x, y, id: Date.now() })
    setTimeout(() => setSparkle(null), 1000)
  }

  useEffect(() => {
    getHero().then(setHero).catch(() => { })
  }, [])

  return (
    <section style={{
      width: '100%',
      minHeight: 'calc(100vh - 72px)',
      backgroundColor: '#0a0a0a',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      marginTop: 0,
      paddingTop: 0,
    }}>
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        minHeight: isMobile ? 'auto' : 'calc(100vh - 72px)',
        paddingTop: isMobile ? '48px' : '0',
        paddingBottom: isMobile ? '0' : '0',
      }}>
        {/* Left Content */}
        <div style={{
          width: isMobile ? '100%' : isTablet ? '50%' : '45%',
          paddingLeft: isMobile ? '24px' : '64px',
          paddingRight: isMobile ? '24px' : '24px',
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', width: 'fit-content' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '999px',
              border: '1px solid #22c55e44',
              backgroundColor: '#22c55e11',
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
              <span style={{ color: '#22c55e', fontSize: isMobile ? '11px' : '13px', fontWeight: '500' }}>{hero.tagline}</span>
            </div>
          </div>

          {/* Name */}
          <h1 style={{
            fontSize: isMobile ? '42px' : isTablet ? '52px' : 'clamp(48px, 5.5vw, 76px)',
            fontWeight: '800',
            lineHeight: '1.05',
            color: '#ffffff',
            letterSpacing: '-0.03em',
            margin: 0,
          }}>
            Hi,
            <br />
            {hero.name.split(' ')[0]} {hero.name.split(' ').slice(1).join(' ')}
            <br />
            <span style={{ color: '#3f3f46' }}>this side.</span>
          </h1>

          {/* Description */}
          <p style={{
            color: '#71717a',
            fontSize: isMobile ? '14px' : '15px',
            lineHeight: '1.7',
            maxWidth: isMobile ? '100%' : '400px',
            margin: 0,
          }}>
            {hero.description}
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
            <Link to="/projects" style={{ textDecoration: 'none' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: isMobile ? '12px 20px' : '14px 28px', borderRadius: '999px', backgroundColor: '#ffffff', color: '#0a0a0a', fontWeight: '700', fontSize: '14px', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e4e4e7')} onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ffffff')}>
                View Projects <ArrowRight size={16} />
              </button>
            </Link>

            {hero.cvUrl ? (
              <a href={hero.cvUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: isMobile ? '12px 20px' : '14px 28px', borderRadius: '999px', backgroundColor: 'transparent', color: '#ffffff', fontWeight: '700', fontSize: '14px', border: '1px solid #27272a', cursor: 'pointer', transition: 'border-color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.borderColor = '#52525b')} onMouseLeave={e => (e.currentTarget.style.borderColor = '#27272a')}>
                  <Download size={16} /> Download Resume
                </button>
              </a>
            ) : (
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: isMobile ? '12px 20px' : '14px 28px', borderRadius: '999px', backgroundColor: 'transparent', color: '#ffffff', fontWeight: '700', fontSize: '14px', border: '1px solid #27272a', cursor: 'pointer' }}>
                <Download size={16} /> Download Resume
              </button>
            )}
          </div>
        </div>

        {/* Right — Spline Robot */}
        <div onTouchStart={handleTouch} style={{ width: isMobile ? '100%' : isTablet ? '50%' : '55%', height: isMobile ? '380px' : 'calc(100vh - 72px)', position: 'relative' }}>
          {sparkle && (
            <div key={sparkle.id} style={{ position: 'absolute', left: sparkle.x, top: sparkle.y, pointerEvents: 'none', zIndex: 20, transform: 'translate(-50%, -50%)' }}>
              {/* Expanding ring */}
              <div className="sparkle-ring" style={{ position: 'absolute', width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #ffffff', top: '-20px', left: '-20px' }} />
              {/* Star */}
              <div className="sparkle-star" style={{ fontSize: '24px', lineHeight: 1 }}>✦</div>
            </div>
          )}
          <SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" className="w-full h-full" />
        </div>
      </div>
    </section>
  )
}

export default HeroSection