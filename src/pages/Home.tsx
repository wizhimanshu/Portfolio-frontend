import React from 'react'
import HeroSection from '../components/home/HeroSection'
import FeaturedProjects from '../components/home/FeaturedProjects'
import TechStack from '../components/home/TechStack'
import ExperienceSection from '../components/home/ExperienceSection'
import ContactSection from '../components/home/ContactSection'

const Home = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedProjects />
      <ExperienceSection />
      <TechStack />
      <ContactSection />
    </div>
  )
}

export default Home