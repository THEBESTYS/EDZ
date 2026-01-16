
import React from 'react';
import { ShieldCheck, Target, Users, Smartphone, Headphones, Globe } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white text-blue-950 relative z-30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* 1.1 ED Study 소개 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="reveal-on-scroll">
            <h2 className="text-4xl font-bold mb-8 leading-tight">세상을 연결하는 언어,<br /><span className="text-blue-600">ED Study의 철학</span>입니다.</h2>
            <div className="space-y-8">
              <div>
                <h4 className="flex items-center gap-2 font-bold text-lg mb-2 text-blue-900">
                  <Target className="w-5 h-5 text-blue-600" /> 비전과 미션
                </h4>
                <p className="text-slate-600 leading-relaxed">디지털 네이티브 세대를 위한 최적의 영어 환경을 구축하여, 누구나 전 세계 어디서든 소통할 수 있는 글로벌 인재로 성장시키는 것이 우리의 사명입니다.</p>
              </div>
              <div>
                <h4 className="flex items-center gap-2 font-bold text-lg mb-2 text-blue-900">
                  <ShieldCheck className="w-5 h-5 text-blue-600" /> 교육 철학
                </h4>
                <p className="text-slate-600 leading-relaxed">단순 암기가 아닌 '상황 중심(Context-rich)' 학습을 지향합니다. 실제 원어민의 환경을 디지털로 구현하여 자연스러운 습득을 유도합니다.</p>
              </div>
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-4 mb-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  <h4 className="font-bold">베테랑 강사진</h4>
                </div>
                <p className="text-sm text-slate-500 italic">TESOL 자격증 및 10년 이상의 교육 경력을 보유한 전문가들이 학습 데이터 기반의 맞춤형 가이드를 제공합니다.</p>
              </div>
            </div>
          </div>
          <div className="reveal-on-scroll relative" style={{ transitionDelay: '0.2s' }}>
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" alt="Team Study" className="rounded-3xl shadow-2xl" />
            <div className="absolute -bottom-8 -left-8 bg-yellow-400 p-8 rounded-2xl shadow-xl hidden md:block">
              <p className="text-blue-900 font-bold text-2xl">100%</p>
              <p className="text-blue-900/70 text-xs font-bold uppercase tracking-wider">Expert Tutors</p>
            </div>
          </div>
        </div>

        {/* 1.2 플랫폼 소개 & 1.3 학습 환경 */}
        <div className="bg-slate-50 rounded-[3rem] p-12 md:p-20 reveal-on-scroll">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-3xl font-bold mb-4">English Discoveries Platform</h3>
            <p className="text-slate-500">글로벌 교육 기업 Edusoft와 파트너십을 통해 제공되는 검증된 시스템</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h5 className="font-bold text-lg mb-3">글로벌 인증</h5>
              <p className="text-sm text-slate-500">CEFR 국제 표준에 따른 10단계 레벨 구성 및 전 세계 100만 명 이상 사용</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Smartphone className="w-8 h-8 text-blue-600" />
              </div>
              <h5 className="font-bold text-lg mb-3">멀티 디바이스</h5>
              <p className="text-sm text-slate-500">PC, 태블릿, 모바일을 넘나드는 끊김 없는(Seamless) 학습 환경 제공</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Headphones className="w-8 h-8 text-blue-600" />
              </div>
              <h5 className="font-bold text-lg mb-3">24/7 기술 지원</h5>
              <p className="text-sm text-slate-500">원활한 학습을 위해 연중무휴 실시간 기술 상담 및 원격 지원 시스템 운영</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
