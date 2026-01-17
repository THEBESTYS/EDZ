
import React, { useState, useEffect } from 'react';
import { LogIn, UserPlus, X, Mail, Lock, Chrome } from 'lucide-react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  const edsUrl = "https://thebestys.github.io/EDS/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-blue-600/90 backdrop-blur-md shadow-lg h-16' : 'h-20'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-full flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <div className="bg-white text-blue-600 p-1 px-2 rounded font-bold en-font text-lg group-hover:bg-yellow-300 transition-colors">
              ED
            </div>
            <span className="font-sans text-xl font-bold tracking-tight text-white italic">Study</span>
          </a>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm font-medium text-white hover:text-yellow-300 transition-colors">소개</a>
            <a href="#curriculum" className="text-sm font-medium text-white hover:text-yellow-300 transition-colors">커리큘럼</a>
            <a href="#features" className="text-sm font-medium text-white hover:text-yellow-300 transition-colors">특장점</a>
            <a href={edsUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-yellow-300 hover:text-white transition-colors border-b border-yellow-300/30">EDI</a>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => openModal('signup')}
              className="hidden md:flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium px-3 py-2 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign-up</span>
            </button>
            <button 
              onClick={() => openModal('login')}
              className="flex items-center gap-2 bg-white text-blue-600 hover:bg-yellow-300 px-5 py-2 rounded-full shadow-md transition-all font-bold text-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>LMS 로그인</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-blue-950/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-fade-in-up">
            <button onClick={closeModal} className="absolute top-6 right-6 text-slate-400 hover:text-blue-600 transition-colors">
              <X className="w-6 h-6" />
            </button>

            <div className="p-10">
              <div className="text-center mb-8">
                <div className="inline-block bg-blue-600 text-white p-2 px-3 rounded-lg font-bold mb-4">ED Study</div>
                <h3 className="text-2xl font-bold text-blue-950">
                  {authMode === 'login' ? '환영합니다!' : '새로운 시작'}
                </h3>
                <p className="text-slate-500 text-sm mt-2">
                  {authMode === 'login' ? 'LMS 계정으로 로그인하세요' : '구글 계정으로 간편하게 시작하세요'}
                </p>
              </div>

              {authMode === 'login' ? (
                /* Login Form */
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="email" 
                      placeholder="이메일 주소" 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="password" 
                      placeholder="비밀번호" 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
                    로그인
                  </button>
                  <div className="text-center mt-6">
                    <p className="text-sm text-slate-500">
                      계정이 없으신가요? <button onClick={() => setAuthMode('signup')} className="text-blue-600 font-bold hover:underline">Sign-up</button>
                    </p>
                  </div>
                </form>
              ) : (
                /* Sign-up View (Google) */
                <div className="space-y-6">
                  <button className="w-full py-4 px-6 border-2 border-slate-100 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all group">
                    <Chrome className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-slate-700">Google 계정으로 계속하기</span>
                  </button>
                  <p className="text-[11px] text-center text-slate-400 leading-relaxed">
                    가입 시 ED Study의 <span className="underline">이용약관</span> 및 <span className="underline">개인정보처리방침</span>에 동의하게 됩니다.
                  </p>
                  <div className="text-center pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-500">
                      이미 계정이 있으신가요? <button onClick={() => setAuthMode('login')} className="text-blue-600 font-bold hover:underline">로그인하기</button>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
