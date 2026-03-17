import React, { useState } from 'react'
import { sendContactMessage } from '../../api/contact'
import { Mail, Send, Github, Linkedin } from 'lucide-react'

const ContactSection = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name || !form.email || !form.message) return
        setLoading(true)
        setError('')
        try {
            await sendContactMessage(form)
            setSuccess(true)
            setForm({ name: '', email: '', message: '' })
            setTimeout(() => setSuccess(false), 5000)
        } catch {
            setError('Failed to send message. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const inputStyle = { width: '100%', padding: '12px 16px', backgroundColor: '#111111', border: '1px solid #1a1a1a', borderRadius: '10px', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const, transition: 'border-color 0.2s' }

    return (
        <section style={{ backgroundColor: '#0a0a0a', padding: '80px 64px 80px', borderTop: '1px solid #27272a' }}>
            <div style={{ margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'flex-start' }}>
                {/* Left */}
                <div>
                    <p style={{ color: '#22c55e', fontSize: '13px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Contact</p>
                    <h2 style={{ color: '#ffffff', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '800', letterSpacing: '-0.02em', margin: '0 0 16px' }}>Get In Touch</h2>
                    <p style={{ color: '#52525b', fontSize: '15px', lineHeight: '1.7', margin: '0 0 40px' }}>Have a project in mind or just want to say hi? My inbox is always open. I'll get back to you as soon as possible!</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <a href="mailto:himanshukumar.portfolio@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#71717a', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')} onMouseLeave={e => (e.currentTarget.style.color = '#71717a')}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#111111', border: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Mail size={16} />
                            </div>
                            Send a mail
                        </a>
                        <a href="https://github.com/wizhimanshu" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#71717a', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')} onMouseLeave={e => (e.currentTarget.style.color = '#71717a')}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#111111', border: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Github size={16} />
                            </div>
                            Check out Repositories
                        </a>
                        <a href="https://linkedin.com/in/connectwith-himanshu-kumar" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#71717a', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')} onMouseLeave={e => (e.currentTarget.style.color = '#71717a')}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#111111', border: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Linkedin size={16} />
                            </div>
                            Get Connected
                        </a>
                    </div>
                </div>

                {/* Right - Form */}
                <div style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a', borderRadius: '20px', padding: '36px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>Your Name</label>
                            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = '#22c55e')} onBlur={e => (e.currentTarget.style.borderColor = '#1a1a1a')} />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>Email Address</label>
                            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="john@example.com" style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = '#22c55e')} onBlur={e => (e.currentTarget.style.borderColor = '#1a1a1a')} />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>Message</label>
                            <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Hey, I'd love to work with you on..." rows={5} style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => (e.currentTarget.style.borderColor = '#22c55e')} onBlur={e => (e.currentTarget.style.borderColor = '#1a1a1a')} />
                        </div>

                        {error && <p style={{ color: '#f87171', fontSize: '13px', margin: 0 }}>{error}</p>}
                        {success && <p style={{ color: '#22c55e', fontSize: '13px', margin: 0 }}>✓ Message sent! I'll get back to you soon.</p>}

                        <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px', backgroundColor: loading ? '#166534' : '#22c55e', color: '#0a0a0a', fontWeight: '700', fontSize: '14px', border: 'none', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s', marginTop: '8px' }}>
                            <Send size={16} /> {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default ContactSection