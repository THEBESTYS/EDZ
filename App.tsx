
import React, { useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import Marquee from './components/Marquee.tsx';
import Curriculum from './components/Curriculum.tsx';
import Features from './components/Features.tsx';
import Footer from './components/Footer.tsx';

const App: React.FC = () => {
  useEffect(() => {
    // 2차 확인: 컴포넌트 마운트 시 로딩 화면 제거
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
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-blue-600">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Marquee />
        <Curriculum />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default App;
