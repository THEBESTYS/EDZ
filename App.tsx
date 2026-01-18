
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import About from './components/About.tsx';
import Marquee from './components/Marquee.tsx';
import Curriculum from './components/Curriculum.tsx';
import Features from './components/Features.tsx';
import Footer from './components/Footer.tsx';
import Admin from './components/Admin.tsx';
import SLevelTest from './components/SLevelTest.tsx';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'admin' | 'sleveltest'>('landing');

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

  const handleStartTest = () => {
    const session = sessionStorage.getItem('edstudy_session');
    if (!session) {
      alert('S-Level Test는 회원 전용 메뉴입니다. 먼저 로그인해 주세요.');
      // Navbar의 로그인 모달을 띄우는 로직은 Navbar 내부 상태이므로 
      // 여기서는 간단히 안내만 하거나 전역 상태 관리가 필요할 수 있으나 
      // 구조상 사용자가 상단 메뉴에서 직접 로그인하도록 유도합니다.
      return;
    }
    setCurrentView('sleveltest');
  };

  if (currentView === 'admin') {
    return <Admin onExit={() => setCurrentView('landing')} />;
  }

  if (currentView === 'sleveltest') {
    return <SLevelTest onExit={() => setCurrentView('landing')} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-blue-600">
      <Navbar 
        onAdminClick={() => setCurrentView('admin')} 
        onTestClick={() => setCurrentView('sleveltest')} 
      />
      <main className="flex-grow">
        <Hero onStartTest={handleStartTest} />
        <Marquee />
        <About />
        <Curriculum onStartTest={handleStartTest} />
        <Features />
      </main>
      <Footer onAdminClick={() => setCurrentView('admin')} />
    </div>
  );
};

export default App;
