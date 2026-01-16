
import React from 'react';
import { ShieldCheck, Target, Users, Smartphone, Headphones, Globe, CheckCircle2 } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white text-blue-950 relative z-30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* 1.1 ED Study 소개 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="reveal-on-scroll">
            <h2 className="text-4xl font-bold mb-8 leading-tight">글로벌 리더를 위한<br /><span className="text-blue-600">독보적인 교육 철학</span></h2>
            <div className="space-y-8">
              <div>
                <h4 className="flex items-center gap-2 font-bold text-lg mb-2 text-blue-900">
                  <Target className="w-5 h-5 text-blue-600" /> 비전과 미션
                </h4>
                <p className="text-slate-600 leading-relaxed italic">"디지털 네이티브를 위한 글로벌 소통의 창"</p>
                <p className="text-slate-500 text-sm mt-1">국경 없는 미래 사회에서 자신의 역량을 100% 발휘할 수 있는 언어 도구(English Tool)를 제공합니다.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                  <ShieldCheck className="w-5 h-5 text-blue-600 mb-3" />
                  <h4 className="font-bold mb-2">교육 철학</h4>
                  <p className="text-xs text-slate-500">실생활 맥락(Context) 중심 학습을 통해 자연스러운 언어 습득을 유도합니다.</p>
                </div>
                <div className="p-5 bg-yellow-50 rounded-2xl border border-yellow-100">
                  <Users className="w-5 h-5 text-yellow-600 mb-3" />
                  <h4 className="font-bold mb-2">전문 강사진</h4>
                  <p className="text-xs text-slate-500">TESOL 보유 및 10년 이상의 베테랑 강사진이 데이터 기반 코칭을 제공합니다.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="reveal-on-scroll relative" style={{ transitionDelay: '0.2s' }}>
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" alt="Learning Experience" className="rounded-3xl shadow-2xl" />
            <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-2xl shadow-xl hidden md:block">
              <p className="font-bold text-lg">Online & Mobile</p>
              <p className="text-xs opacity-80 uppercase tracking-widest">Seamless Learning</p>
            </div>
          </div>
        </div>

        {/* 1.2 플랫폼 & 1.3 환경 */}
        <div className="bg-slate-50 rounded-[3rem] p-12 md:p-20 reveal-on-scroll">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-3xl font-bold mb-4">English Discoveries Platform</h3>
            <p className="text-slate-500">전 세계 100만 명 이상이 선택한 에듀소프트(Edusoft)의 공식 파트너</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h5 className="font-bold text-lg mb-3">글로벌 표준 인증</h5>
              <p className="text-sm text-slate-500 leading-relaxed">CEFR 국제 표준에 따른 10단계 레벨 구성으로 객관적인 실력 증명이 가능합니다.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Smartphone className="w-8 h-8 text-blue-600" />
              </div>
              <h5 className="font-bold text-lg mb-3">전방위 학습 지원</h5>
              <p className="text-sm text-slate-500 leading-relaxed">PC부터 스마트폰까지, 언제 어디서나 동일한 학습 경험을 모바일로 제공합니다.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Headphones className="w-8 h-8 text-blue-600" />
              </div>
              <h5 className="font-bold text-lg mb-3">기술 지원 서비스</h5>
              <p className="text-sm text-slate-500 leading-relaxed">24/7 원격 기술 지원을 통해 학습 중 발생하는 모든 디지털 이슈를 즉각 해결합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
