import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Analytics from './pages/Analytics'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import Achievements from './pages/Achievements'
import { useWarmup } from './hooks/useWarmup'

function App() {
  useWarmup()
  return (
    <div className="dark">
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="achievements" element={<Achievements />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App