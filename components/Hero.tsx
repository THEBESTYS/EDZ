
import React from 'react';
import { ArrowRight, PlayCircle, Award, MonitorPlay, BrainCircuit, Globe2 } from 'lucide-react';

const Hero: React.FC = () => {
  const edsUrl = "https://thebestys.github.io/EDS/";

  return (
    <header id="about" className="relative min-h-[100svh] pt-20 overflow-hidden flex flex-col justify-between">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-800 z-0"></div>
      
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0 pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 flex-grow pt-10 lg:pt-0">
        
        {/* Left Text */}
        <div className="lg:col-span-7 flex flex-col justify-center pb-20 lg:pb-0">
          <div className="mb-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-300/30 bg-yellow-400/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
              <p className="text-yellow-300 font-bold tracking-wide text-[10px] uppercase">
                Global EdTech Platform
              </p>
            </div>
          </div>
          
          <h1 className="text-[3rem] sm:text-[4rem] md:text-[5rem] leading-[1.1] font-bold tracking-tight text-white mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            세계를 향한<br />언어의 확장이<br />시작되는 곳
          </h1>

          <p className="text-blue-100 text-lg max-w-lg mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            전 세계 100만 명이 선택한 <span className="text-yellow-300 font-semibold">English Discoveries</span> 플랫폼.<br />
            ED Study와 함께 가장 스마트한 영어 학습을 경험하세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <a 
              href={edsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-900 px-8 py-4 font-bold text-base hover:bg-yellow-300 transition-all shadow-xl shadow-blue-900/20 rounded-lg hover:-translate-y-1 flex items-center gap-2"
            >
              무료 레벨테스트 <ArrowRight className="w-4 h-4" />
            </a>
            <a 
              href={edsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 font-medium text-base text-white border border-white/30 hover:bg-white/10 transition-colors rounded-lg flex items-center gap-2"
            >
              <PlayCircle className="w-5 h-5" /> 플랫폼 미리보기
            </a>
          </div>
        </div>

        {/* Right Image Area */}
        <div className="lg:col-span-5 relative h-full flex items-end justify-center lg:justify-end pointer-events-none animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2940&auto=format&fit=crop" 
            alt="Student Learning" 
            className="hero-mask relative z-10 w-full h-[50vh] lg:h-[75vh] object-cover object-center lg:scale-110 lg:translate-y-10 rounded-t-3xl shadow-2xl"
          />
          
          {/* Floating Rating Badge */}
          <div className="absolute top-1/3 left-0 lg:-left-12 z-20 glass-panel p-5 rounded-xl shadow-lg hidden md:block border-l-4 border-l-yellow-400">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="block text-sm font-bold text-white">CEFR 인증</span>
                <span className="text-[10px] text-blue-200">국제 표준 커리큘럼</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Glass Overlay (Stats) */}
      <div className="relative z-20 w-full border-t border-white/20 glass-panel">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div className="flex items-center gap-4 px-4">
            <MonitorPlay className="w-8 h-8 text-yellow-300" />
            <div>
              <h4 className="font-bold text-lg text-white">Interactive</h4>
              <p className="text-xs text-blue-100">멀티미디어 인터랙티브 학습</p>
            </div>
          </div>
          <div className="flex items-center gap-4 px-4">
            <BrainCircuit className="w-8 h-8 text-yellow-300" />
            <div>
              <h4 className="font-bold text-lg text-white">AI Analysis</h4>
              <p className="text-xs text-blue-100">자동화된 학습 분석 및 평가</p>
            </div>
          </div>
          <div className="flex items-center gap-4 px-4">
            <Globe2 className="w-8 h-8 text-yellow-300" />
            <div>
              <h4 className="font-bold text-lg text-white">Global Content</h4>
              <p className="text-xs text-blue-100">BBC 등 검증된 미디어 제휴</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
