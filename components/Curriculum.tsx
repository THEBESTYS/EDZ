
import React from 'react';
import { BookOpen, Star, Briefcase, GraduationCap, Users, LayoutList, ChevronRight } from 'lucide-react';

const Curriculum: React.FC = () => {
  const edsUrl = "https://thebestys.github.io/EDS/";
  const mainCourses = [
    {
      level: "Beginner",
      title: "기초 탄탄 초급",
      desc: "영어의 기초를 세우는 첫 단계입니다.",
      items: ["기초 어휘 및 실용 표현", "일상 생활 대화 패턴", "필수 기본 문법 마스터"],
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop"
    },
    {
      level: "Intermediate",
      title: "자신감 뿜뿜 중급",
      desc: "의사소통의 확장을 경험하는 단계입니다.",
      items: ["유창한 대화 능력 향상", "비즈니스 영어 기초", "중급 문법 및 작문 심화"],
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
    },
    {
      level: "Advanced",
      title: "글로벌 프로 고급",
      desc: "전문적인 비즈니스와 학술 영어를 다룹니다.",
      items: ["전문 분야 주제 토론", "프레젠테이션 및 협상 기술", "고급 논리 작문 및 분석"],
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <section id="curriculum" className="py-24 bg-slate-50 text-blue-950 relative z-30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-20 reveal-on-scroll">
          <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-3 block">Expert Curriculum</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">체계적인 단계별 커리큘럼</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">기초부터 고급까지, English Discoveries의 과학적인 로드맵이 실력 향상을 보장합니다.</p>
        </div>

        {/* 2.1 메인 프로그램 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {mainCourses.map((course, idx) => (
            <div key={idx} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 reveal-on-scroll" style={{ transitionDelay: `${idx * 0.1}s` }}>
              <div className="h-48 overflow-hidden relative">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{course.level}</div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold mb-3">{course.title}</h3>
                <p className="text-sm text-slate-500 mb-6">{course.desc}</p>
                <ul className="space-y-3">
                  {course.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* 2.2 특화 과정 & 2.3 학습 방법 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 특화 과정 */}
          <div className="bg-blue-900 rounded-[2.5rem] p-10 text-white reveal-on-scroll">
            <h4 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-yellow-400" /> 특화 과정
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                <Briefcase className="w-8 h-8 text-blue-300 mb-4" />
                <h5 className="font-bold mb-2">비즈니스 전문</h5>
                <p className="text-xs text-blue-100/70">직무별 실무 영어 및 글로벌 커뮤니케이션</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                <GraduationCap className="w-8 h-8 text-blue-300 mb-4" />
                <h5 className="font-bold mb-2">시험 대비</h5>
                <p className="text-xs text-blue-100/70">TOEIC, TOEFL, OPIC 단기 고득점 전략</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                <Users className="w-8 h-8 text-blue-300 mb-4" />
                <h5 className="font-bold mb-2">K-12 주니어</h5>
                <p className="text-xs text-blue-100/70">어린이 및 청소년을 위한 몰입형 교육</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl hover:bg-white/10 transition-colors flex flex-col justify-center items-center text-center">
                <p className="font-bold text-yellow-400 text-lg italic">Coming Soon</p>
                <p className="text-[10px] text-blue-100/50 mt-1 uppercase tracking-widest">More Specialized Courses</p>
              </div>
            </div>
          </div>

          {/* 학습 방법 */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
            <h4 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <LayoutList className="w-6 h-6 text-blue-600" /> 학습 프로세스
            </h4>
            <div className="space-y-6">
              <div className="flex gap-6 items-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0 font-bold text-blue-600">01</div>
                <div>
                  <h5 className="font-bold mb-1">맞춤형 레벨 테스트</h5>
                  <p className="text-sm text-slate-500">정교한 평가 도구로 현재 실력을 정확히 진단합니다.</p>
                </div>
              </div>
              <div className="flex gap-6 items-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0 font-bold text-blue-600">02</div>
                <div>
                  <h5 className="font-bold mb-1">개인별 학습 경로 설계</h5>
                  <p className="text-sm text-slate-500">목표와 수준에 맞춰 최적화된 커리큘럼을 배정합니다.</p>
                </div>
              </div>
              <div className="flex gap-6 items-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0 font-bold text-blue-600">03</div>
                <div>
                  <h5 className="font-bold mb-1">정기 평가 및 피드백</h5>
                  <p className="text-sm text-slate-500">지속적인 성취도 분석을 통해 학습 방향을 보정합니다.</p>
                </div>
              </div>
              <a 
                href={edsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-4 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                무료 체험 신청하기 <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Curriculum;
