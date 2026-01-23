
import React from 'react';
import { 
  ArrowLeft, Globe, Zap, Cpu, Award, CheckCircle2, 
  BarChart3, Video, BookOpen, Layers, ShieldCheck, 
  Target, GraduationCap, Microscope 
} from 'lucide-react';

interface IntroProps {
  onExit: () => void;
}

const Intro: React.FC<IntroProps> = ({ onExit }) => {
  const levels = [
    { name: "Pre-Basic", cefr: "A1", desc: "영어 완전 초보자 대상 기초 입문" },
    { name: "Basic 1~3", cefr: "A1~A2", desc: "기초 회화 및 기본 표현 학습" },
    { name: "Intermediate 1~3", cefr: "B1", desc: "중급 실용 영어 및 사회적 의사소통" },
    { name: "Advanced 1~3", cefr: "B2~C1", desc: "고급 전문 표현 및 원어민 수준 유창성" }
  ];

  const compatibility = [
    { ed: "Advanced 3", cefr: "C1", toefl: "95-120", toeic: "945-990", color: "bg-red-800" },
    { ed: "Advanced 1", cefr: "B2", toefl: "72-94", toeic: "785-944", color: "bg-orange-600" },
    { ed: "Intermediate 2", cefr: "B1", toefl: "42-71", toeic: "550-784", color: "bg-green-600" },
    { ed: "Basic 2", cefr: "A2", toefl: "N/A", toeic: "225-549", color: "bg-blue-600" },
    { ed: "Pre-Basic", cefr: "A1", toefl: "N/A", toeic: "10-224", color: "bg-purple-600" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-20">
      {/* Hero Intro Section */}
      <section className="bg-gradient-to-br from-[#2C3E50] to-[#3498DB] text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest mb-8 border border-white/20">
            AI-Powered Global English
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight">
            AI 기반 글로벌 영어<br />역량 강화 프로그램
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl font-medium opacity-90 leading-relaxed mb-12">
            English Discoveries: 1,000시간 이상의 참여형 핵심 콘텐츠와<br />
            최첨단 인터랙티브 기술이 결합된 검증된 솔루션
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <button onClick={onExit} className="bg-white text-blue-900 px-10 py-5 rounded-2xl font-black text-lg hover:bg-yellow-300 transition-all shadow-xl">
              학습 시작하기
            </button>
            <button className="bg-blue-800/50 text-white border border-white/20 px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-800 transition-all">
              도입 문의하기
            </button>
          </div>
        </div>
      </section>

      {/* Curriculum Detail */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight relative inline-block">
              종합적 영어 학습 커리큘럼
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-blue-500 rounded-full"></div>
            </h2>
            <p className="text-slate-500 mt-10 text-lg max-w-3xl mx-auto font-medium leading-relaxed">
              일반 영어 과정은 10개의 학습 단계로 구성된 1,000시간 이상의 참여형 핵심 내용을 제공합니다. 
              듣기, 읽기, 말하기, 쓰기, 문법, 어휘 등 모든 주요 언어 기술을 체계적으로 마스터합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Layers className="text-blue-600" />, t: "10단계 학습 체계", d: "체계적으로 구성된 10개의 레벨로 단계별 향상" },
              { icon: <Zap className="text-blue-600" />, t: "1,000+ 학습 시간", d: "참여형 멀티미디어 콘텐츠로 구성된 풍부한 자료" },
              { icon: <Target className="text-blue-600" />, t: "종합 언어 기술", d: "4대 영역은 물론 문법, 어휘까지 통합 개발" },
              { icon: <BookOpen className="text-blue-600" />, t: "주제 기반 유닛", d: "실생활 주제 중심의 살아있는 영어 학습" }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:bg-blue-50 transition-all group">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h4 className="font-bold text-slate-900 mb-3">{item.t}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Differentiators */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">프로그램 차별화 핵심 요소</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-blue-900/5 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-red-50 text-red-600 rounded-[2.5rem] flex items-center justify-center mb-8">
                <ShieldCheck className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold mb-6 text-slate-900">평가의 신뢰성: ETS 검증</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                TOEFL/TOEIC 출제 기관인 ETS의 평가 알고리즘 및 e-rater® 공인 채점 시스템 적용으로 정확한 평가 보장
              </p>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-blue-900/5 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center mb-8">
                <Globe className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold mb-6 text-slate-900">글로벌 호환성: 표준 연계</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                CEFR(유럽표준등급)과의 정밀한 매핑 및 공인 영어 성적과의 상호 연계로 국제적 공신력 확보
              </p>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-blue-900/5 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center mb-8">
                <Cpu className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold mb-6 text-slate-900">AI 기반의 탁월성</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                발음, 유창성 등 7대 영역 실시간 평가 및 코칭 시스템을 통한 즉각적인 피드백과 교정 제공
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Level System Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">10단계 레벨 시스템</h2>
            <p className="text-slate-500 font-medium">CEFR 기준에 따른 체계적인 단계별 학습 로드맵</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {levels.map((level, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 hover:border-blue-400 transition-all flex flex-col items-center text-center">
                <div className="text-xs font-black text-blue-500 mb-4 bg-white px-3 py-1 rounded-full shadow-sm">{level.cefr}</div>
                <h4 className="text-xl font-bold text-slate-900 mb-4">{level.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{level.desc}</p>
              </div>
            ))}
          </div>

          {/* Compatibility Chart */}
          <div className="mt-24 bg-slate-900 rounded-[4rem] p-10 md:p-20 text-white">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-black mb-4 tracking-tight flex items-center justify-center gap-3">
                <Microscope className="w-8 h-8 text-blue-400" /> 글로벌 영어 인증 호환성
              </h3>
              <p className="text-blue-200 opacity-60">국제 공인 시험 점수와의 상관관계 분석</p>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="grid grid-cols-5 gap-4 text-xs font-bold text-blue-300 uppercase tracking-widest mb-6 px-4">
                <div className="col-span-1">ED Level</div>
                <div className="col-span-1 text-center">CEFR</div>
                <div className="col-span-1 text-center">TOEFL iBT</div>
                <div className="col-span-2 text-center">TOEIC</div>
              </div>
              {compatibility.map((row, i) => (
                <div key={i} className="grid grid-cols-5 gap-4 items-center bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors border border-white/5">
                  <div className="col-span-1 font-black text-sm">{row.ed}</div>
                  <div className={`col-span-1 text-center py-1 rounded-lg text-xs font-bold ${row.color}`}>{row.cefr}</div>
                  <div className="col-span-1 text-center font-bold text-blue-100">{row.toefl}</div>
                  <div className="col-span-2 text-center font-bold text-yellow-400">{row.toeic}</div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-blue-200/40 text-center mt-12">
              * 제공된 점수는 일반적인 연계 기준이며, 공식 기관의 최신 기준에 따라 차이가 있을 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Features */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-20">
            <div className="md:w-1/2">
              <h2 className="text-4xl font-black text-slate-900 mb-10 tracking-tight leading-tight">
                최첨단 인터랙티브<br />기술 특징
              </h2>
              <div className="space-y-8">
                {[
                  { icon: <Microscope className="w-5 h-5" />, t: "고급 음성 인식 (ASR)", d: "발음 명료도 및 유창성을 실시간으로 정교하게 진단" },
                  { icon: <Video className="w-5 h-5" />, t: "대화형 실제 비디오", d: "생생한 실제 상황 시나리오를 통한 자연스러운 영어 습득" },
                  { icon: <CheckCircle2 className="w-5 h-5" />, t: "25개 언어 모국어 지원", d: "학습 초기 진입 장벽을 낮추는 글로벌 학습자 지원" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-start">
                    <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">{item.t}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
                  alt="Tech Features" 
                  className="rounded-[4rem] shadow-2xl relative z-10"
                />
                <div className="absolute -bottom-10 -right-10 bg-blue-600 w-48 h-48 rounded-[3rem] -z-10 rotate-12"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Exit */}
      <div className="py-20 bg-white border-t border-slate-100 text-center">
         <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">글로벌 영어 경쟁력의 시작</h3>
         <button onClick={onExit} className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30">
           지금 무료 테스트 신청하기
         </button>
      </div>
    </div>
  );
};

export default Intro;
