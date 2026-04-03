import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { User, LogOut } from 'lucide-react'
import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useBreakpoint } from '../../hooks/useBreakpoint'

const Navbar = () => {
  const { isAuthenticated, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()
  
  const { isMobile, isTablet } = useBreakpoint()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Projects', path: '/projects' },
    { label: 'Experience', path: '/#experience' },
    { label: 'Tech Stacks', path: '/#techstack' },
    { label: 'Achievements', path: '/achievements' },
    { label: 'Analytics', path: '/analytics' },
  ]

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    if (path.startsWith('/#')) {
      e.preventDefault()
      const id = path.replace('/#', '')
      if (location.pathname !== '/') {
        navigate('/')
        // Wait for page to render then scroll
        const tryScroll = (attempts: number) => {
          const el = document.getElementById(id)
          if (el) {
            const navHeight = 70 // navbar height
            const offset = 8  // extra breathing room
            const top = el.getBoundingClientRect().top + window.scrollY - navHeight - offset
            window.scrollTo({ top, behavior: 'smooth' })
          } else if (attempts > 0) {
            setTimeout(() => tryScroll(attempts - 1), 200)
          }
        }
        setTimeout(() => tryScroll(10), 300)
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(12px)' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: isMobile ? '0 20px' : '0 24px', height: '83.5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-primary)', fontWeight: '700', fontSize: '14px' }}>H</div>
            <span style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '18px' }}>Himanshu Kumar</span>
          </div>
        </Link>

        {/* Nav Links */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {navLinks.map(link => (

              <a key={link.path}
                href={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                style={{
                  color: isActive(link.path) ? '#ffffff' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: '500',
                  transition: 'color 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={e => (e.currentTarget.style.color = isActive(link.path) ? '#ffffff' : 'var(--text-secondary)')}
              >
                {link.label}
              </a>
            ))}

            {/* Admin */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link to="/admin" style={{ color: 'var(--text-secondary)', display: 'flex' }}>
                  <User size={18} />
                </Link>
                <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/admin/login" style={{ color: 'var(--text-secondary)', display: 'flex' }}>
                <User size={18} />
              </Link>
            )}
          </div>
          
        )}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {isAuthenticated && <Link to="/admin" style={{ color: 'var(--text-secondary)', display: 'flex' }}><User size={18} /></Link>}
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ffffff', display: 'flex', padding: '4px' }}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        )}
      </div>
      {isMobile && menuOpen && (
        <div style={{ backgroundColor: '#111111', borderTop: '1px solid #27272a', padding: '8px 20px 16px' }}>
          {navLinks.map(link => (
            <a key={link.path} href={link.path} onClick={(e) => { handleNavClick(e, link.path); setMenuOpen(false) }} style={{ display: 'block', color: isActive(link.path) ? '#ffffff' : '#a1a1aa', textDecoration: 'none', fontSize: '15px', fontWeight: '500', padding: '12px 8px', borderBottom: '1px solid #1a1a1a' }}>
              {link.label}
            </a>
          ))}
          {!isAuthenticated && <Link to="/admin/login" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a1a1aa', textDecoration: 'none', fontSize: '15px', padding: '12px 8px' }}><User size={16} /> Admin</Link>}
          {isAuthenticated && <button onClick={() => { logout(); setMenuOpen(false) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', fontSize: '15px', padding: '12px 8px', display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}><LogOut size={16} /> Sign Out</button>}
        </div>
      )}
    </nav >
  )
}

export default Navbar