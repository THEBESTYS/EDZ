
import React from 'react';
import { BookOpen, MessageCircle, Briefcase, TrendingUp, GraduationCap, FileCheck, ArrowRight } from 'lucide-react';

const CurriculumCard: React.FC<{
  title: string;
  desc: string;
  points: string[];
  type: 'light' | 'dark';
  icon: React.ReactNode;
  bgIcon: React.ReactNode;
  delay?: string;
}> = ({ title, desc, points, type, icon, bgIcon, delay }) => {
  const isDark = type === 'dark';
  return (
    <div 
      className={`group relative overflow-hidden rounded-xl p-8 border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 reveal-on-scroll ${
        isDark 
        ? 'bg-blue-600 border-blue-500 text-white hover:shadow-blue-900/20' 
        : 'bg-white border-slate-200 text-blue-950 hover:shadow-blue-900/10'
      }`}
      style={{ transitionDelay: delay }}
    >
      <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${isDark ? 'text-white' : 'text-blue-600'}`}>
        {bgIcon}
      </div>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-colors ${
        isDark ? 'bg-white/10 group-hover:bg-white text-white group-hover:text-blue-600' : 'bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white'
      }`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className={`text-sm mb-6 leading-relaxed ${isDark ? 'text-blue-100' : 'text-slate-500'}`}>{desc}</p>
      <ul className="space-y-2 mb-6 text-xs font-medium">
        {points.map((p, i) => (
          <li key={i} className="flex items-center gap-2">
            <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-yellow-400' : 'bg-blue-400'}`}></div>
            <span className={isDark ? 'text-blue-200' : 'text-slate-600'}>{p}</span>
          </li>
        ))}
      </ul>
      <a href="#" className={`inline-flex items-center gap-2 text-xs font-bold transition-colors ${isDark ? 'text-white hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'}`}>
        과정 자세히 보기 <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
};

const Curriculum: React.FC = () => {
  return (
    <section id="curriculum" className="py-24 bg-slate-50 text-blue-950 relative z-30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 reveal-on-scroll">
          <div>
            <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-3 block">Our Curriculum</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-blue-950 leading-tight">
              학습자 수준에 맞춘<br />체계적인 로드맵
            </h2>
          </div>
          <p className="text-slate-500 max-w-sm text-sm mt-6 md:mt-0 leading-relaxed font-medium">
            Basic부터 Advanced까지, English Discoveries의 10단계 레벨 시스템으로 빈틈없는 실력 향상을 보장합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CurriculumCard 
            title="General English"
            desc="일상 생활에서 사용되는 실용 영어를 중심으로 듣기, 말하기, 읽기, 쓰기를 통합적으로 학습합니다."
            points={["비디오 기반 상황 학습", "원어민 발음 교정"]}
            type="light"
            icon={<MessageCircle className="w-6 h-6 stroke-[1.5]" />}
            bgIcon={<BookOpen className="w-24 h-24" />}
          />
          <CurriculumCard 
            title="Business English"
            desc="비즈니스 환경에서의 커뮤니케이션 스킬을 향상시키며 프레젠테이션, 이메일 작성 등을 마스터합니다."
            points={["직무별 맞춤 표현", "글로벌 비즈니스 매너"]}
            type="dark"
            delay="0.1s"
            icon={<TrendingUp className="w-6 h-6 stroke-[1.5]" />}
            bgIcon={<Briefcase className="w-24 h-24" />}
          />
          <CurriculumCard 
            title="Academic & Test"
            desc="TOEIC, TOEFL 등 공인 인증 시험을 대비하고 학술적인 영어 구사 능력을 배양합니다."
            points={["실전 모의고사 제공", "유형별 공략법 학습"]}
            type="light"
            delay="0.2s"
            icon={<FileCheck className="w-6 h-6 stroke-[1.5]" />}
            bgIcon={<GraduationCap className="w-24 h-24" />}
          />
        </div>
      </div>
    </section>
  );
};

export default Curriculum;
