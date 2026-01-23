
import React from 'react';
import { 
  ArrowLeft, Globe, Zap, Cpu, Award, CheckCircle2, 
  BarChart3, Video, BookOpen, Layers, ShieldCheck, 
  Target, GraduationCap, Microscope, Network, Library, 
  Users, Sparkles, TrendingUp, Headphones
} from 'lucide-react';

interface IntroProps {
  onExit: () => void;
}

const Intro: React.FC<IntroProps> = ({ onExit }) => {
  // 10단계 레벨 시스템 데이터
  const levelDetails = [
    { id: 'PB', name: "Pre-Basic", cefr: "A1", category: "입문", desc: "영어 완전 초보자 대상 기초 입문 과정" },
    { id: 'B3', name: "Basic 3", cefr: "A1", category: "기초", desc: "초보자 수준의 기본 표현 및 일상 어휘 학습" },
    { id: 'B2', name: "Basic 2", cefr: "A2", category: "기초", desc: "기초 회화 능력 향상 및 문장 구조 습득" },
    { id: 'B1', name: "Basic 1", cefr: "A2", category: "기초", desc: "일상적인 표현의 확장 및 기본 의사소통 완성" },
    { id: 'I1', name: "Intermediate 1", cefr: "B1", category: "중급", desc: "중급 단계 진입 및 사회적 주제 토론 입문" },
    { id: 'I2', name: "Intermediate 2", cefr: "B1", category: "중급", desc: "실용 영어 능력 개발 및 문맥 이해도 심화" },
    { id: 'I3', name: "Intermediate 3", cefr: "B1", category: "중상급", desc: "다양한 사회적, 직업적 상황에서의 의사소통" },
    { id: 'A1', name: "Advanced 1", cefr: "B2", category: "중상급", desc: "고급 영어 진입 및 유창성 확보를 위한 훈련" },
    { id: 'A2', name: "Advanced 2", cefr: "C1", category: "고급", desc: "전문적 표현 능력 향상 및 논리적 전개 학습" },
    { id: 'A3', name: "Advanced 3", cefr: "C1", category: "고급", desc: "원어민 수준의 유창한 표현 및 학술적 역량 확보" }
  ];

  // 상세 호환성 데이터 (10단계)
  const compatibilityData = [
    { ed: "Advanced 3", cefr: "C1", toefl: "95-120", toeic: "945-990", ielts: "7.5-8.0", color: "bg-red-700" },
    { ed: "Advanced 2", cefr: "C1", toefl: "95-120", toeic: "945-990", ielts: "7.0-7.5", color: "bg-red-600" },
    { ed: "Advanced 1", cefr: "B2", toefl: "72-94", toeic: "785-944", ielts: "5.5-6.5", color: "bg-orange-500" },
    { ed: "Intermediate 3", cefr: "B1", toefl: "42-71", toeic: "550-784", ielts: "5.0-5.5", color: "bg-green-600" },
    { ed: "Intermediate 2", cefr: "B1", toefl: "42-71", toeic: "550-784", ielts: "4.5-5.0", color: "bg-green-500" },
    { ed: "Intermediate 1", cefr: "B1", toefl: "42-71", toeic: "550-784", ielts: "4.0-4.5", color: "bg-green-400" },
    { ed: "Basic 1", cefr: "A2", toefl: "N/A", toeic: "225-549", ielts: "3.5", color: "bg-blue-600" },
    { ed: "Basic 2", cefr: "A2", toefl: "N/A", toeic: "225-549", ielts: "3.0", color: "bg-blue-500" },
    { ed: "Basic 3", cefr: "A1", toefl: "N/A", toeic: "120-224", ielts: "2.0-2.5", color: "bg-purple-600" },
    { ed: "Pre-Basic", cefr: "A1", toefl: "N/A", toeic: "10-119", ielts: "1.0-1.5", color: "bg-purple-500" }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col pt-20">
      {/* Hero: 압도적 신뢰감의 헤더 */}
      <section className="bg-gradient-to-br from-[#1a2a3a] via-[#2C3E50] to-[#3498DB] text-white py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-yellow-400/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-yellow-400/30 text-yellow-300">
              <Sparkles className="w-3 h-3" /> ETS Verified AI Solution
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight oswald-font">
              세계를 향한 열쇠,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">English Discoveries</span>
            </h1>
            <p className="text-xl text-blue-100 font-medium opacity-90 leading-relaxed mb-12 max-w-xl">
              단순한 온라인 강의가 아닙니다. 1,000시간 이상의 독보적 콘텐츠와 ETS 검증 AI 기술이 만난 글로벌 스탠다드 영어 학습 솔루션입니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={onExit} className="bg-white text-blue-900 px-10 py-5 rounded-2xl font-black text-lg hover:bg-yellow-300 transition-all shadow-2xl hover:-translate-y-1">
                학습 시작하기
              </button>
              <button className="bg-blue-800/50 text-white border border-white/20 px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-800 transition-all">
                기관 도입 문의
              </button>
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="absolute -inset-10 bg-blue-500/20 blur-[100px] rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
              alt="Digital Learning" 
              className="rounded-[4rem] shadow-2xl border-4 border-white/10 relative z-10 rotate-3"
            />
          </div>
        </div>
      </section>

      {/* Target Message Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6"><Users className="w-6 h-6" /></div>
            <h4 className="text-xl font-black text-slate-900 mb-4">For Students</h4>
            <p className="text-slate-500 text-sm leading-relaxed">"지루한 단어 암기 없이 게임처럼 즐기세요. AI 튜터가 당신의 발음을 원어민처럼 교정해 드립니다."</p>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6"><ShieldCheck className="w-6 h-6" /></div>
            <h4 className="text-xl font-black text-slate-900 mb-4">For Parents</h4>
            <p className="text-slate-500 text-sm leading-relaxed">"글로벌 표준 CEFR 기준의 레벨 관리로 우리 아이의 실력이 세계 어디서든 인정받게 됩니다."</p>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6"><BarChart3 className="w-6 h-6" /></div>
            <h4 className="text-xl font-black text-slate-900 mb-4">For Teachers</h4>
            <p className="text-slate-500 text-sm leading-relaxed">"수천 명의 학생도 AI 분석 데이터로 한눈에. 정교한 리포팅 시스템이 교수법의 질을 높입니다."</p>
          </div>
        </div>
      </section>

      {/* 10-Step Level Section */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">10단계 과학적 레벨 시스템</h2>
            <p className="text-slate-500 font-medium text-lg">왕초보부터 원어민 수준까지, 당신의 정확한 위치를 찾아드립니다.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {levelDetails.map((level, i) => (
              <div key={i} className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:bg-blue-600 transition-all flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl shadow-blue-900/10">
                <div className="text-[10px] font-black text-blue-600 group-hover:text-blue-100 mb-4 bg-slate-50 group-hover:bg-blue-700 px-3 py-1 rounded-full shadow-sm transition-colors">{level.category} | CEFR {level.cefr}</div>
                <h4 className="text-lg font-black text-slate-900 group-hover:text-white mb-4">{level.name}</h4>
                <p className="text-[11px] text-slate-400 group-hover:text-blue-200 leading-relaxed font-medium transition-colors">{level.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Compatibility Chart: 핵심 가치 */}
      <section className="py-28 px-6 bg-[#2C3E50] text-white rounded-[4rem] mx-6 mb-28 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-6 tracking-tight flex items-center justify-center gap-4">
              <Globe className="w-10 h-10 text-yellow-400" /> 글로벌 영어 인증 호환성
            </h2>
            <p className="text-blue-200 font-medium opacity-80 max-w-2xl mx-auto">
              English Discoveries는 전 세계 어디서나 인정받는 공신력을 자랑합니다.<br />
              국제 표준 CEFR 및 주요 공인 시험과의 상호 연계를 확인하세요.
            </p>
          </div>

          <div className="overflow-x-auto pb-10">
            <div className="min-w-[800px]">
              {/* Table Header */}
              <div className="grid grid-cols-6 gap-4 text-xs font-black text-blue-300 uppercase tracking-widest mb-8 px-8 border-b border-white/10 pb-4">
                <div className="col-span-1">ED LEVEL</div>
                <div className="col-span-1 text-center">CEFR</div>
                <div className="col-span-1 text-center">TOEFL iBT</div>
                <div className="col-span-1 text-center">TOEIC</div>
                <div className="col-span-1 text-center">IELTS</div>
                <div className="col-span-1 text-center">성취 단계</div>
              </div>
              
              {/* Table Body */}
              <div className="space-y-3">
                {compatibilityData.map((row, i) => (
                  <div key={i} className="grid grid-cols-6 gap-4 items-center bg-white/5 p-5 rounded-2xl hover:bg-white/10 transition-all border border-white/5 group">
                    <div className="col-span-1 font-black text-sm group-hover:text-yellow-400 transition-colors">{row.ed}</div>
                    <div className="col-span-1 flex justify-center">
                      <span className={`px-4 py-1.5 rounded-full text-[11px] font-black ${row.color} shadow-lg shadow-black/20`}>{row.cefr}</span>
                    </div>
                    <div className="col-span-1 text-center font-bold text-blue-100">{row.toefl}</div>
                    <div className="col-span-1 text-center font-bold text-yellow-300">{row.toeic}</div>
                    <div className="col-span-1 text-center font-bold text-emerald-400">{row.ielts}</div>
                    <div className="col-span-1 text-center">
                      <span className="text-[10px] text-white/40 font-bold uppercase tracking-tighter">
                        {i < 3 ? 'Professional' : i < 6 ? 'Independent' : 'Basic'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center gap-8">
            <div className="bg-yellow-400 text-blue-900 p-4 rounded-2xl"><TrendingUp className="w-8 h-8" /></div>
            <p className="text-blue-100 text-sm leading-relaxed">
              <strong>핵심 가치:</strong> 본 점수 체계는 글로벌 교육 기관 및 기업에서 인정하는 공식 환산표를 기준으로 작성되었습니다. 
              단순히 영어를 배우는 것을 넘어, 공인된 성취 지표를 통해 당신의 경쟁력을 증명하세요.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Tech: AI 기반의 탁월성 */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full text-[10px] font-black text-blue-600 uppercase mb-8 border border-blue-100">
                Advanced Technology
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-10 tracking-tight leading-[1.2]">
                인간의 직관과<br />
                <span className="text-blue-600">AI의 정밀함</span>이 만났습니다.
              </h2>
              <div className="space-y-10">
                {[
                  { icon: <Microscope className="w-6 h-6" />, t: "고급 음성 인식 (ASR)", d: "단순 인식에서 나아가 억양, 강세, 발음의 정확도를 원어민 데이터와 비교하여 실시간 코칭을 제공합니다." },
                  { icon: <Video className="w-6 h-6" />, t: "대화형 시나리오 비디오", d: "생생한 실제 상황을 배경으로 한 비디오 학습을 통해 문법 중심이 아닌 실제 의사소통 중심의 언어 감각을 깨웁니다." },
                  { icon: <Library className="w-6 h-6" />, t: "25개 언어 모국어 지원", d: "한국인 학습자에게 필요한 핵심 문법 설명과 도움말을 모국어로 제공하여 학습 효율을 극대화합니다." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-8 items-start group">
                    <div className="bg-slate-50 p-4 rounded-3xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-xl group-hover:shadow-blue-500/20">{item.icon}</div>
                    <div>
                      <h4 className="font-black text-slate-900 mb-3 text-lg">{item.t}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(44,62,80,0.3)] relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2000&auto=format&fit=crop" 
                  alt="Student using AI" 
                  className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                />
                <div className="absolute inset-0 p-16 flex flex-col justify-end text-white">
                  <div className="bg-yellow-400 text-blue-950 p-6 rounded-3xl mb-8 self-start"><Zap className="w-10 h-10" /></div>
                  <h3 className="text-3xl font-black mb-4">100% Interactive</h3>
                  <p className="text-blue-100 font-medium">눈으로만 보는 강의가 아닙니다. 모든 순간 당신의 반응을 요구하며 실전 능력을 키웁니다.</p>
                </div>
              </div>
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-slate-100 rounded-[3rem] -z-10 rotate-12"></div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-yellow-400 rounded-[4rem] -z-10 -rotate-6"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Exit: 강력한 Call to Action */}
      <div className="py-32 bg-slate-900 text-white text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-blue-600/5 animate-pulse"></div>
         <div className="relative z-10 max-w-4xl mx-auto px-6">
           <h3 className="text-4xl md:text-5xl font-black mb-10 tracking-tight">글로벌 리더를 위한 마지막 한 걸음</h3>
           <p className="text-slate-400 text-xl font-medium mb-16 leading-relaxed opacity-70">
             지금 전 세계 100만 명의 학습자가 증명한 가장 스마트한 영어 학습 플랫폼,<br />
             English Discoveries와 함께 당신의 가능성을 현실로 만드세요.
           </p>
           <div className="flex flex-col sm:flex-row gap-6 justify-center">
             <button onClick={onExit} className="bg-blue-600 text-white px-16 py-7 rounded-[2.5rem] font-black text-xl hover:bg-white hover:text-blue-900 transition-all shadow-2xl shadow-blue-600/30 hover:-translate-y-2">
               지금 바로 시작하기
             </button>
             <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="bg-transparent border-2 border-white/20 text-white px-16 py-7 rounded-[2.5rem] font-black text-xl hover:bg-white/5 transition-all">
               레벨 다시 확인하기
             </button>
           </div>
         </div>
      </div>

      <footer className="py-12 bg-black text-center">
        <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em]">
          English Discoveries is a trademark of Edusoft Ltd. | Powered by Edusoft & Pearson
        </p>
      </footer>
    </div>
  );
};

export default Intro;
