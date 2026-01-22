
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
import NoticeBar from './components/NoticeBar.tsx';
import Booking from './components/Booking.tsx';
import NoticeList from './components/NoticeList.tsx';
import Manual from './components/Manual.tsx';

type View = 'landing' | 'admin' | 'sleveltest' | 'booking' | 'notices' | 'manual';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('landing');

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
      return;
    }
    setCurrentView('sleveltest');
  };

  const renderView = () => {
    switch (currentView) {
      case 'admin':
        return <Admin onExit={() => setCurrentView('landing')} />;
      case 'sleveltest':
        return <SLevelTest onExit={() => setCurrentView('landing')} />;
      case 'booking':
        return <Booking onExit={() => setCurrentView('landing')} />;
      case 'notices':
        return <NoticeList onExit={() => setCurrentView('landing')} />;
      case 'manual':
        return <Manual onExit={() => setCurrentView('landing')} />;
      default:
        return (
          <div className="flex flex-col min-h-screen bg-blue-600">
            <Navbar 
              onAdminClick={() => setCurrentView('admin')} 
              onTestClick={() => setCurrentView('sleveltest')} 
              onBookingClick={() => setCurrentView('booking')}
              onNoticeClick={() => setCurrentView('notices')}
              onManualClick={() => setCurrentView('manual')}
            />
            <div className="pt-20"> {/* Fixed Navbar Space */}
              <NoticeBar />
            </div>
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
    }
  };

  return renderView();
};

export default App;
