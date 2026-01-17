
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import About from './components/About.tsx';
import Marquee from './components/Marquee.tsx';
import Curriculum from './components/Curriculum.tsx';
import Features from './components/Features.tsx';
import Footer from './components/Footer.tsx';
import Admin from './components/Admin.tsx';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'admin'>('landing');

  useEffect(() => {
    const display = document.getElementById('status-display');
    if (display && !display.classList.contains('hidden')) {
      display.classList.add('hidden');
    }

    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [currentView]);

  if (currentView === 'admin') {
    return <Admin onExit={() => setCurrentView('landing')} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-blue-600">
      <Navbar onAdminClick={() => setCurrentView('admin')} />
      <main className="flex-grow">
        <Hero />
        <Marquee />
        <About />
        <Curriculum />
        <Features />
      </main>
      <Footer onAdminClick={() => setCurrentView('admin')} />
    </div>
  );
};

export default App;
