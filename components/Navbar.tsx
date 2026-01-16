
import React, { useState, useEffect } from 'react';
import { LogIn } from 'lucide-react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const edsUrl = "https://thebestys.github.io/EDS/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-blue-600/90 backdrop-blur-md shadow-lg h-16' : 'h-20'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-full flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <div className="bg-white text-blue-600 p-1 px-2 rounded font-bold en-font text-lg group-hover:bg-yellow-300 transition-colors">
            ED
          </div>
          <span className="font-sans text-xl font-bold tracking-tight text-white italic">Study</span>
        </a>
        
        <div className="hidden md:flex items-center gap-10">
          <a href="#about" className="text-sm font-medium text-white hover:text-yellow-300 transition-colors">소개</a>
          <a href="#curriculum" className="text-sm font-medium text-white hover:text-yellow-300 transition-colors">커리큘럼</a>
          <a href="#features" className="text-sm font-medium text-white hover:text-yellow-300 transition-colors">특장점</a>
        </div>

        <a 
          href={edsUrl}
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/20 transition-all text-white"
        >
          <span className="text-xs font-medium">LMS 로그인</span>
          <LogIn className="w-4 h-4" />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
