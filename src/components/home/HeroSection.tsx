import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Download } from 'lucide-react'
import { SplineScene } from '../ui/SplineScene'
import { Spotlight } from '../ui/Spotlight'
import { getHero } from '../../api/hero'
import { Hero } from '../../types'

const HeroSection = () => {
  const [hero, setHero] = useState<Hero>({
    id: '',
    name: 'Himanshu Kumar',
    tagline: 'Full Stack Developer & AI Enthusiast',
    description: 'I am a software development engineer, I love to transform ideas into intelligent softwares especially by leveraging AI and Machine learning.',
  })

  useEffect(() => {
    getHero().then(setHero).catch(() => { })
  }, [])

  return (
    <section style={{
      width: '100%',
      minHeight: 'calc(100vh - 64px)',
      backgroundColor: '#0a0a0a',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      marginTop: '-20px',
      paddingTop: '-2.5px',

    }}>
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)',
      }}>
        {/* Left Content — fixed width, pushed to left edge */}
        <div style={{
          width: '45%',
          paddingLeft: '64px',
          paddingRight: '24px',
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
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                boxShadow: '0 0 8px #22c55e',
              }} />
              <span style={{ color: '#22c55e', fontSize: '13px', fontWeight: '500' }}>
                {hero.tagline}
              </span>
            </div>
          </div>

          {/* Name */}
          <h1 style={{
            fontSize: 'clamp(48px, 5.5vw, 76px)',
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
            fontSize: '15px',
            lineHeight: '1.7',
            maxWidth: '400px',
            margin: 0,
          }}>
            {hero.description}
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
            <Link to="/projects" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  borderRadius: '999px',
                  backgroundColor: '#ffffff',
                  color: '#0a0a0a',
                  fontWeight: '700',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e4e4e7')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                View Projects <ArrowRight size={16} />
              </button>
            </Link>

            {hero.cvUrl ? (
              <a href={hero.cvUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 28px',
                    borderRadius: '999px',
                    backgroundColor: 'transparent',
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '14px',
                    border: '1px solid #27272a',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#52525b')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#27272a')}
                >
                  <Download size={16} /> Download Resume
                </button>
              </a>
            ) : (
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  borderRadius: '999px',
                  backgroundColor: 'transparent',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '14px',
                  border: '1px solid #27272a',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#52525b')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#27272a')}
              >
                <Download size={16} /> Download Resume
              </button>
            )}
          </div>
        </div>

        {/* Right — Spline Robot, 55% width for breathing room */}
        <div style={{
          width: '55%',
          height: 'calc(100vh - 64px)',
          position: 'relative',
        }}>
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </section>
  )
}

export default HeroSection