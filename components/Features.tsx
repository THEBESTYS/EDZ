
import React from 'react';
// Added Star to the imports from lucide-react
import { Mic, PenTool, Database, Cpu, PieChart, HeartHandshake, CheckCircle2, Star } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-slate-900 text-white relative overflow-hidden z-30">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-900/20 blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-24">
          <div className="reveal-on-scroll">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-yellow-400"></span>
              <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">Advantages</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 leading-tight">
              ED Study가 제안하는<br /><span className="text-blue-400">미래형 학습 솔루션</span>
            </h2>
            <p className="text-slate-300 font-light text-base leading-relaxed mb-10 max-w-md">
              인공지능과 풍부한 콘텐츠의 만남. 한국인 학습자에게 최적화된 독자적인 매니지먼트 시스템을 경험하세요.
            </p>
            
            {/* 3.2 플랫폼 장점 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                <Cpu className="w-8 h-8 text-blue-400 mb-4" />
                <h4 className="font-bold mb-2">적응형 학습 경로</h4>
                <p className="text-xs text-slate-400">AI가 학습 패턴을 분석하여 개인별 취약점을 보완하는 맞춤 경로 자동 생성</p>
              </div>
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                <Mic className="w-8 h-8 text-blue-400 mb-4" />
                <h4 className="font-bold mb-2">실시간 발음 평가</h4>
                <p className="text-xs text-slate-400">ASR 엔진을 통한 정교한 음성 분석으로 원어민과의 일치도 즉각 확인</p>
              </div>
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                <Database className="w-8 h-8 text-blue-400 mb-4" />
                <h4 className="font-bold mb-2">압도적 콘텐츠</h4>
                <p className="text-xs text-slate-400">2,000시간 이상의 레슨과 10,000개 이상의 인터랙티브 연습 문제</p>
              </div>
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                <PieChart className="w-8 h-8 text-blue-400 mb-4" />
                <h4 className="font-bold mb-2">습관 분석 리포트</h4>
                <p className="text-xs text-slate-400">학습 시간, 진행도, 성취도를 시각화한 상세 성과 리포트 제공</p>
              </div>
            </div>
          </div>

          {/* 비주얼 통계 & 학습 지원 */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[3rem] shadow-2xl reveal-on-scroll">
              <h3 className="text-2xl font-bold mb-8 text-center">3.3 학습 지원 시스템</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl">
                  <HeartHandshake className="w-10 h-10 text-yellow-300" />
                  <div>
                    <h5 className="font-bold">1:1 맞춤 코칭</h5>
                    <p className="text-xs text-blue-100">전문 코치가 주간 학습량을 체크하고 상담 제공</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl">
                  <CheckCircle2 className="w-10 h-10 text-yellow-300" />
                  <div>
                    <h5 className="font-bold">24/7 질의응답</h5>
                    <p className="text-xs text-blue-100">학습 중 궁금한 점은 언제든 질문하고 답변 확인</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl">
                  <Star className="w-10 h-10 text-yellow-300" />
                  <div>
                    <h5 className="font-bold">동기부여 프로그램</h5>
                    <p className="text-xs text-blue-100">포인트 및 챌린지 시스템으로 완강까지 꾸준하게</p>
                  </div>
                </div>
              </div>
              <div className="mt-10 pt-10 border-t border-white/10 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-400">2K+</p>
                  <p className="text-[10px] uppercase tracking-tighter text-blue-200">Interactive Lessons</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-400">10K+</p>
                  <p className="text-[10px] uppercase tracking-tighter text-blue-200">Practice Tasks</p>
                </div>
              </div>
            </div>
            {/* Decorative Image */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-yellow-400 rounded-3xl -z-10 rotate-12 hidden lg:block"></div>
          </div>
        </div>

        {/* 3.1 차별화 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center reveal-on-scroll">
          <div className="border-r border-white/10 last:border-0 px-6">
            <h4 className="text-yellow-400 font-bold mb-2 italic">Official Partnership</h4>
            <p className="text-sm text-slate-400">English Discoveries 공식 파트너의 독점 혜택</p>
          </div>
          <div className="border-r border-white/10 last:border-0 px-6">
            <h4 className="text-yellow-400 font-bold mb-2 italic">Localized Path</h4>
            <p className="text-sm text-slate-400">한국인 학습 특성을 고려한 맞춤 설계</p>
          </div>
          <div className="border-r border-white/10 last:border-0 px-6">
            <h4 className="text-yellow-400 font-bold mb-2 italic">Real-time Monitoring</h4>
            <p className="text-sm text-slate-400">체계적인 실시간 진행률 관리 시스템</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
