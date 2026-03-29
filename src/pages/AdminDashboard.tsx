import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { LayoutDashboard, FolderOpen, Cpu, Tag, User, LogOut, Briefcase, Trophy, Home } from 'lucide-react'
import HeroEditor from '../components/admin/HeroEditor'
import ProjectForm from '../components/admin/ProjectForm'
import CategoryForm from '../components/admin/CategoryForm'
import SkillForm from '../components/admin/SkillForm'
import ExperienceForm from '../components/admin/ExperienceForm'
import AchievementForm from '../components/admin/AchievementForm'
import { Link } from 'react-router-dom'

type Tab = 'hero' | 'projects' | 'skills' | 'categories' | 'experience' | 'achievements'

const AdminDashboard = () => {
  const { isAuthenticated, admin, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState<Tab>('projects')

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />

  const tabs = [
    { id: 'projects' as Tab, label: 'Projects', icon: FolderOpen },
    { id: 'skills' as Tab, label: 'Skills', icon: Cpu },
    { id: 'categories' as Tab, label: 'Domains', icon: Tag },
    { id: 'hero' as Tab, label: 'Hero Section', icon: LayoutDashboard },
    { id: 'experience' as Tab, label: 'Experience', icon: Briefcase },
    { id: 'achievements' as Tab, label: 'Achievements', icon: Trophy },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ width: '240px', backgroundColor: '#111111', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh' }}>
        {/* Logo */}
        <div style={{ padding: '24px', borderBottom: '1px solid #1a1a1a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0a0a', fontWeight: '800', fontSize: '14px' }}>H</div>
            <div>
              <p style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', margin: 0 }}>Admin Panel</p>
              <p style={{ color: '#a1a1aa', fontSize: '11px', margin: 0 }}>{admin?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', backgroundColor: isActive ? '#1a1a1a' : 'transparent', border: isActive ? '1px solid #27272a' : '1px solid transparent', color: isActive ? '#ffffff' : '#b4b4b4', fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginBottom: '4px', transition: 'all 0.2s', textAlign: 'left' }}>
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid #1a1a1a' }}>
          <Link to="/" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid transparent', color: '#b4b4b4', fontSize: '14px', textDecoration: 'none', marginBottom: '4px' }}>
            <Home size={16} /> Back to Portfolio
          </Link>
          <button onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid transparent', color: '#b4b4b4', fontSize: '14px', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
            onMouseLeave={e => (e.currentTarget.style.color = '#b4b4b4')}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '240px', flex: 1, padding: '40px', overflowY: 'auto' }}>
        {activeTab === 'hero' && <HeroEditor />}
        {activeTab === 'projects' && <ProjectForm />}
        {activeTab === 'categories' && <CategoryForm />}
        {activeTab === 'experience' && <ExperienceForm />}
        {activeTab === 'skills' && <SkillForm />}
        {activeTab === 'achievements' && <AchievementForm />}
      </div>
    </div>
  )
}

export default AdminDashboard