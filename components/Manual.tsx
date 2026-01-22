
import React, { useState } from 'react';
import { 
  ArrowLeft, BookOpen, ChevronRight, Layout, Settings, 
  Monitor, Info, BarChart, Network, Library, Users, 
  LogOut, Star, Lightbulb, AlertTriangle, Headphones,
  PlayCircle, Download
} from 'lucide-react';

interface ManualProps {
  onExit: () => void;
}

const Manual: React.FC<ManualProps> = ({ onExit }) => {
  const [activeSection, setActiveSection] = useState<string>('start');

  const menuItems = [
    { id: 'start', label: '시작하기', icon: <PlayCircle className="w-4 h-4" /> },
    { id: 'navigation', label: '메인 메뉴 탐색', icon: <Layout className="w-4 h-4" /> },
    { id: 'progress', label: '학습 진도 확인', icon: <BarChart className="w-4 h-4" /> },
    { id: 'structure', label: '강의 구조 이해', icon: <Network className="w-4 h-4" /> },
    { id: 'dictionary', label: '사전 사용법', icon: <Library className="w-4 h-4" /> },
    { id: 'community', label: '커뮤니티 활용', icon: <Users className="w-4 h-4" /> },
    { id: 'logout', label: '안전한 로그아웃', icon: <LogOut className="w-4 h-4" /> },
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-20">
      {/* Manual Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full mb-4">
              <BookOpen className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-200">Student Guide</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">English Discoveries</h1>
            <p className="text-xl text-blue-100 font-medium max-w-xl opacity-90 leading-relaxed">
              학생용 빠른 참조 가이드: 플랫폼의 핵심 기능을 익히고 학습 효과를 극대화하는 방법을 안내합니다.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-yellow-300 transition-all shadow-xl shadow-blue-950/20">
              <Download className="w-5 h-5" /> 매뉴얼 PDF 다운로드
            </button>
            <button onClick={onExit} className="bg-blue-800/50 text-white border border-white/20 px-8 py-4 rounded-xl font-bold hover:bg-blue-800 transition-all">
              메인으로 돌아가기
            </button>
          </div>
        </div>
      </div>

      {/* Manual Navigation */}
      <div className="sticky top-16 bg-white border-b border-slate-200 z-40 overflow-x-auto shadow-sm">
        <div className="max-w-6xl mx-auto px-6 flex items-center gap-8 h-14 whitespace-nowrap scrollbar-hide">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`text-sm font-bold flex items-center gap-2 h-full border-b-2 transition-all ${activeSection === item.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Manual Content */}
      <main className="max-w-6xl w-full mx-auto px-6 py-16">
        
        {/* Section: 시작하기 */}
        <section id="start" className="mb-24 scroll-mt-32">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-blue-600 p-2 rounded-xl text-white"><PlayCircle className="w-6 h-6" /></div>
            <h2 className="text-3xl font-black text-blue-950 tracking-tight">시작하기</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6"><Monitor className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold mb-4">첫 접속 시 안내</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                플랫폼에 처음 접속하면 <strong>워크스루(Walkthrough)</strong>가 표시됩니다. 안내를 건너뛰지 말고 각 설명을 통해 섹션 사용법을 익히세요.
              </p>
              <div className="bg-amber-50 p-4 rounded-xl flex gap-3">
                <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
                <p className="text-xs text-amber-700 font-medium leading-relaxed">팁: 워크스루는 처음 접속할 때만 한 번 표시됩니다.</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6"><Settings className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold mb-4">프로필 설정</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                우측 상단 프로필 아이콘의 <strong>내 프로필</strong>에서 지원 언어 및 모국어 지원 수준을 설정할 수 있습니다.
              </p>
              <ul className="text-xs text-slate-400 space-y-2">
                <li className="flex items-start gap-2"><Star className="w-3 h-3 text-blue-400 mt-0.5" /> 영어만: 전체 영어 표시</li>
                <li className="flex items-start gap-2"><Star className="w-3 h-3 text-blue-400 mt-0.5" /> 전체 지원: 대부분의 섹션 번역</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6"><Headphones className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold mb-4">시스템 확인</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                상단 물음표 아이콘의 <strong>시스템 확인</strong> 메뉴를 통해 마이크와 스피커 설정을 확인하세요.
              </p>
              <div className="bg-blue-50 p-4 rounded-xl flex gap-3 border border-blue-100">
                <AlertTriangle className="w-5 h-5 text-blue-500 shrink-0" />
                <p className="text-xs text-blue-700 font-medium leading-relaxed">오디오 학습을 위해 필수적인 단계입니다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: 메인 메뉴 탐색 */}
        <section id="navigation" className="mb-24 scroll-mt-32">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-blue-600 p-2 rounded-xl text-white"><Layout className="w-6 h-6" /></div>
            <h2 className="text-3xl font-black text-blue-950 tracking-tight">메인 메뉴 탐색</h2>
          </div>
          
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-12 border-b lg:border-b-0 lg:border-r border-slate-100">
                <h3 className="text-2xl font-bold mb-8">좌측 메뉴 패널</h3>
                <div className="space-y-4">
                  {[
                    { label: '홈', desc: '코스 및 유닛 선택 화면' },
                    { label: '기관 페이지', desc: '외부 자료 및 유용한 링크' },
                    { label: '과제', desc: '교사가 제출한 과제 및 상태' },
                    { label: '평가', desc: '시험 일정 및 성적 결과 확인' },
                    { label: '받은편지함', desc: '메일 및 중요 알림 메시지' },
                    { label: '문법 책', desc: '핵심 문법 설명 및 예문' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 group hover:bg-blue-50 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-blue-600 opacity-20 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex-grow">
                        <span className="font-bold text-slate-700 text-sm">{item.label}</span>
                        <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-12 bg-slate-50/50">
                <div className="h-full flex flex-col justify-center">
                  <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-blue-900/5 relative">
                    <div className="absolute top-4 right-4"><Info className="w-5 h-5 text-blue-200" /></div>
                    <h4 className="text-lg font-bold mb-4 text-blue-900">플랫폼 활용 팁</h4>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                      학습 도중 문법이 헷갈릴 때는 <strong>문법 책</strong> 메뉴를 즉시 참조할 수 있습니다. 제출한 과제의 피드백은 <strong>과제</strong> 섹션에서 정기적으로 확인하세요.
                    </p>
                    <img 
                      src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2000&auto=format&fit=crop" 
                      alt="Digital Learning" 
                      className="rounded-2xl w-full h-40 object-cover shadow-inner"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: 학습 진도 확인 */}
        <section id="progress" className="mb-24 scroll-mt-32">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-blue-600 p-2 rounded-xl text-white"><BarChart className="w-6 h-6" /></div>
            <h2 className="text-3xl font-black text-blue-950 tracking-tight">학습 진도 확인</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full translate-x-12 -translate-y-12"></div>
               <h3 className="text-xl font-bold mb-6">대시보드 지표</h3>
               <div className="space-y-8 relative z-10">
                 <div>
                   <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
                     <span>코스 완료율</span>
                     <span className="text-blue-600">65%</span>
                   </div>
                   <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                     <div className="h-full bg-blue-600 rounded-full" style={{ width: '65%' }}></div>
                   </div>
                 </div>
                 <div>
                   <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
                     <span>평균 시험 점수</span>
                     <span className="text-blue-600">82%</span>
                   </div>
                   <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                     <div className="h-full bg-indigo-500 rounded-full" style={{ width: '82%' }}></div>
                   </div>
                 </div>
                 <div className="bg-blue-50 p-6 rounded-2xl">
                   <div className="text-xs font-bold text-blue-400 mb-1 uppercase tracking-widest">누적 학습 시간</div>
                   <div className="text-3xl font-black text-blue-900 tracking-tighter">15:30 <span className="text-sm font-bold text-blue-400 uppercase ml-2 tracking-normal">H:M</span></div>
                 </div>
               </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex-grow">
                <h3 className="text-xl font-bold mb-4">내 진도 (My Progress)</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  <strong>내 진도</strong> 버튼을 클릭하면 유닛별 상세 레슨 이름, 완료 여부, 그리고 최종 시험 점수를 한눈에 확인할 수 있습니다.
                </p>
                <div className="space-y-3">
                  {['Not Started (미시작)', 'In Progress (진행 중)', 'Completed (완료)'].map((status, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                      <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-slate-200' : i === 1 ? 'bg-yellow-400' : 'bg-green-500'}`}></div>
                      {status}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: 강의 구조 이해 */}
        <section id="structure" className="mb-24 scroll-mt-32">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-blue-600 p-2 rounded-xl text-white"><Network className="w-6 h-6" /></div>
            <h2 className="text-3xl font-black text-blue-950 tracking-tight">강의 구조 이해</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-blue-900 text-white p-10 rounded-[2.5rem] shadow-xl">
              <h3 className="text-2xl font-bold mb-8 italic">Hierarchy</h3>
              <div className="space-y-8">
                {[
                  { n: '01', l: 'Course (코스)', d: '전체 학습 과정' },
                  { n: '02', l: 'Unit (유닛)', d: '주제별 학습 단위' },
                  { n: '03', l: 'Lesson (레슨)', d: '개별 학습 내용' },
                  { n: '04', l: 'Section (섹션)', d: '실습 단계' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-blue-400 font-black text-lg">{item.n}</span>
                    <div>
                      <div className="font-bold text-lg">{item.l}</div>
                      <p className="text-xs text-blue-300/70">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { t: '탐색 (Explore)', d: '새로운 내용 학습. 하단 화살표로 진행.', i: <ChevronRight className="w-5 h-5" /> },
                { t: '연습 (Practice)', d: '다양한 활동 형식으로 이해도 확인.', i: <ChevronRight className="w-5 h-5" /> },
                { t: '평가 (Test)', d: '최종 성취도 측정 및 피드백 확인.', i: <ChevronRight className="w-5 h-5" /> },
              ].map((step, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 flex flex-col">
                  <div className="w-10 h-10 bg-slate-50 text-blue-600 rounded-full flex items-center justify-center mb-6 font-black">{i + 1}</div>
                  <h4 className="font-bold text-blue-900 mb-3">{step.t}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: 사전 사용법 */}
        <section id="dictionary" className="mb-24 scroll-mt-32">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-blue-600 p-2 rounded-xl text-white"><Library className="w-6 h-6" /></div>
            <h2 className="text-3xl font-black text-blue-950 tracking-tight">내장 사전 사용법</h2>
          </div>
          
          <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-6">모르는 단어 즉시 검색</h3>
                <div className="space-y-6">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0 font-bold">1</div>
                    <div>
                      <h4 className="font-bold text-slate-800">우클릭 검색</h4>
                      <p className="text-sm text-slate-500">학습 화면 내의 단어 위에서 우클릭하여 사전을 엽니다.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0 font-bold">2</div>
                    <div>
                      <h4 className="font-bold text-slate-800">아이콘 검색</h4>
                      <p className="text-sm text-slate-500">우측 상단 <strong>책 아이콘</strong>을 클릭하여 직접 검색합니다.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-80 bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <div className="text-xs font-bold text-blue-400 mb-4 uppercase tracking-widest">Dictionary Result</div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <div className="font-black text-blue-600 text-lg">shade <span className="text-xs font-normal text-slate-400 ml-1">/ʃeɪd/</span></div>
                  <div className="text-[10px] text-slate-400 italic mb-2">noun</div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">그늘, 햇빛을 막아주는 것. 어둠.</p>
                  <p className="text-[10px] text-blue-400 mt-2 font-bold italic">"It's cooler in the shade of the tree."</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: 커뮤니티 활용 */}
        <section id="community" className="mb-24 scroll-mt-32">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-blue-600 p-2 rounded-xl text-white"><Users className="w-6 h-6" /></div>
            <h2 className="text-3xl font-black text-blue-950 tracking-tight">커뮤니티 활용</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { t: '토론 포럼', d: '다른 학습자와의 의견 교환.', icon: <Users className="w-6 h-6" /> },
              { t: '매거진', d: '수준별 뉴스 및 아티클 독해.', icon: <BookOpen className="w-6 h-6" /> },
              { t: '게임', d: '어휘력을 확장하는 재미있는 활동.', icon: <PlayCircle className="w-6 h-6" /> },
              { t: '관용어 연습', d: '실생활 유용한 표현 학습.', icon: <Star className="w-6 h-6" /> },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 text-center group hover:bg-blue-600 transition-all">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white transition-colors">{item.icon}</div>
                <h4 className="font-bold text-slate-800 mb-2 group-hover:text-white transition-colors">{item.t}</h4>
                <p className="text-xs text-slate-400 group-hover:text-blue-100 transition-colors">{item.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: 안전한 로그아웃 */}
        <section id="logout" className="mb-24 scroll-mt-32">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-blue-600 p-2 rounded-xl text-white"><LogOut className="w-6 h-6" /></div>
            <h2 className="text-3xl font-black text-blue-950 tracking-tight">안전한 로그아웃</h2>
          </div>
          
          <div className="bg-red-50 border border-red-100 p-12 rounded-[3rem]">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg text-red-500 shrink-0">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-red-900 mb-4 tracking-tight">중요: 학습 종료 시 반드시 로그아웃</h3>
                <p className="text-red-700 font-medium leading-relaxed mb-6">
                  브라우저를 그냥 닫으면 학습 진행 상황이 안전하게 저장되지 않을 수 있습니다. 
                  반드시 우측 상단의 <strong>로그아웃</strong> 버튼을 클릭하여 세션을 정상 종료하세요.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white px-5 py-2 rounded-full text-xs font-bold text-red-600 border border-red-200">진도 유실 방지</div>
                  <div className="bg-white px-5 py-2 rounded-full text-xs font-bold text-red-600 border border-red-200">개인정보 보호</div>
                  <div className="bg-white px-5 py-2 rounded-full text-xs font-bold text-red-600 border border-red-200">정확한 학습 통계</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Manual Footer Message */}
        <div className="text-center py-20 border-t border-slate-200">
           <h4 className="text-2xl font-black text-blue-950 mb-4 tracking-tight">모든 준비가 되셨나요?</h4>
           <p className="text-slate-500 font-medium mb-10 max-w-lg mx-auto leading-relaxed">
             이제 English Discoveries의 체계적인 학습 로드맵을 따라 실제 영어 의사소통 능력을 한 단계 업그레이드할 시간입니다.
           </p>
           <button onClick={onExit} className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30">
             지금 바로 학습 시작하기
           </button>
        </div>
      </main>

      <footer className="py-12 bg-white border-t border-slate-100 text-center">
        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
          © Edusoft Ltd. Official Quick Reference Guide for Students
        </p>
      </footer>
    </div>
  );
};

export default Manual;
