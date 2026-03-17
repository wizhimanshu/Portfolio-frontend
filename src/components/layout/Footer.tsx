import React from 'react'
import { Github, Linkedin, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', padding: '24px 64px' }}>
      <div style={{ margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          © 2026 Himanshu Kumar. Built with NestJS + React.
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="https://github.com/wizhimanshu" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', display: 'flex' }}>
            <Github size={20} />
          </a>
          <a href="https://linkedin.com/in/connectwith-himanshu-kumar" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', display: 'flex' }}>
            <Linkedin size={20} />
          </a>
          <a href="mailto:himanshukumar.portfolio@gmail.com" style={{ color: 'var(--text-secondary)', display: 'flex' }}>
            <Mail size={20} />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer