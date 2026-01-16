
import React from 'react';
import { Mic, PenTool, Users } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-slate-900 text-white relative overflow-hidden z-30">
      {/* Background Decorative Blur */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-900/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-indigo-900/20 blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        <div className="reveal-on-scroll">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-yellow-400"></span>
            <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">Why ED Study?</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 leading-tight">
            기술이 더해진<br /><span className="text-slate-400">완벽한 학습 환경</span>
          </h2>
          <p className="text-slate-300 font-light text-base leading-relaxed mb-10 max-w-md">
            English Discoveries는 단순한 인강이 아닙니다. 최신 음성 인식 기술과 자동 작문 평가 시스템을 통해 1:1 과외와 같은 피드백을 제공합니다.
          </p>
          
          <div className="space-y-5">
            <div className="flex items-start gap-4 p-4 border border-white/5 rounded-xl hover:bg-white/5 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors">
                <Mic className="w-5 h-5 text-blue-400 group-hover:text-white" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">ASR 음성 인식</h4>
                <p className="text-sm text-slate-400">학습자의 발음을 원어민과 비교 분석하여 즉각적인 교정 제공.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 border border-white/5 rounded-xl hover:bg-white/5 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors">
                <PenTool className="w-5 h-5 text-blue-400 group-hover:text-white" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">AWE 자동 작문 첨삭</h4>
                <p className="text-sm text-slate-400">문법 오류부터 문장 구조까지 AI가 실시간으로 분석하여 피드백.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Stats */}
        <div className="relative grid grid-cols-2 gap-4">
          <div className="space-y-4 translate-y-8">
            <div className="bg-blue-600 p-6 rounded-2xl reveal-on-scroll shadow-xl border border-blue-500" style={{ transitionDelay: '0.1s' }}>
              <h3 className="en-font text-4xl font-bold mb-1">98%</h3>
              <p className="text-blue-100 text-xs font-bold tracking-wider">학습 목표 달성률</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-slate-400 font-medium">Live Connection</span>
              </div>
              <p className="text-white text-sm font-medium">"언제 어디서나 PC와 모바일로 끊김 없는 학습이 가능합니다."</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 reveal-on-scroll" style={{ transitionDelay: '0.3s' }}>
              <Users className="w-8 h-8 text-blue-500 mb-3" />
              <h3 className="en-font text-2xl font-bold mb-1">Community</h3>
              <p className="text-slate-500 text-xs font-bold tracking-wider">글로벌 학습 커뮤니티</p>
            </div>
            <div className="bg-yellow-400 text-blue-950 p-6 rounded-2xl reveal-on-scroll shadow-lg shadow-yellow-400/10" style={{ transitionDelay: '0.4s' }}>
              <h3 className="en-font text-4xl font-bold mb-1">10+</h3>
              <p className="text-blue-900/70 text-xs font-bold tracking-wider">단계별 레벨 시스템</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
