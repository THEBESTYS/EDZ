
import React, { useState, useEffect } from 'react';
import { LogIn, UserPlus, X, Mail, Lock, Chrome, User, Phone, LockKeyhole, CalendarCheck2, Megaphone, BookOpen, Info, Youtube } from 'lucide-react';

interface NavbarProps {
  onAdminClick?: () => void;
  onTestClick?: () => void;
  onBookingClick?: () => void;
  onNoticeClick?: () => void;
  onManualClick?: () => void;
  onIntroClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAdminClick, onTestClick, onBookingClick, onNoticeClick, onManualClick, onIntroClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  
  const youtubeUrl = "https://www.youtube.com/watch?v=a4IU0ibrBDI&autoplay=1";
  const edsUrl = "https://thebestys.github.io/EDS/";

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    name: '',
    password: ''
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    const session = sessionStorage.getItem('edstudy_session');
    if (session) setIsUserLoggedIn(true);

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
    setFormData({ email: '', phone: '', name: '', password: '' });
    setLoginData({ email: '', password: '' });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const existingUsers = JSON.parse(localStorage.getItem('edstudy_users') || '[]');
      const newUser = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        level: 'Silver'
      };
      
      localStorage.setItem('edstudy_users', JSON.stringify([...existingUsers, newUser]));
      sessionStorage.setItem('edstudy_session', JSON.stringify(newUser));
      setIsUserLoggedIn(true);
      setIsLoading(false);
      alert(`${formData.name}님, 회원가입 및 로그인이 완료되었습니다!`);
      closeModal();
    }, 1000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const existingUsers = JSON.parse(localStorage.getItem('edstudy_users') || '[]');
      const user = existingUsers.find((u: any) => u.email === loginData.email && u.password === loginData.password);

      if (user) {
        sessionStorage.setItem('edstudy_session', JSON.stringify(user));
        setIsUserLoggedIn(true);
        setIsLoading(false);
        alert(`${user.name}님, 환영합니다!`);
        closeModal();
      } else {
        setIsLoading(false);
        alert('이메일 또는 비밀번호가 일치하지 않습니다.');
      }
    }, 800);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const existingUsers = JSON.parse(localStorage.getItem('edstudy_users') || '[]');
      const googleUser = {
        email: 'google_user@gmail.com',
        phone: '010-0000-0000',
        name: '구글 사용자',
        password: '***',
        id: Date.now(),
        createdAt: new Date().toISOString(),
        provider: 'google',
        level: 'Silver'
      };
      
      if (!existingUsers.find((u: any) => u.email === googleUser.email)) {
        localStorage.setItem('edstudy_users', JSON.stringify([...existingUsers, googleUser]));
      }
      
      sessionStorage.setItem('edstudy_session', JSON.stringify(googleUser));
      setIsUserLoggedIn(true);
      setIsLoading(false);
      alert('Google 계정으로 로그인되었습니다.');
      closeModal();
    }, 1200);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('edstudy_session');
    setIsUserLoggedIn(false);
    alert('로그아웃 되었습니다.');
    window.location.reload();
  };

  const checkLogin = (callback: () => void) => {
    if (!isUserLoggedIn) {
      alert('이 서비스는 회원 전용 메뉴입니다. 먼저 로그인해 주세요.');
      openModal('login');
    } else {
      callback();
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-blue-600/90 backdrop-blur-md shadow-lg h-16' : 'h-20'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-full flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <div className="bg-white text-blue-600 p-1 px-2 rounded font-bold en-font text-lg group-hover:bg-yellow-300 transition-colors">
              ED
            </div>
            <span className="font-sans text-xl font-bold tracking-tight text-white italic">Study</span>
          </a>
          
          <div className="hidden md:flex items-center gap-6">
            <button onClick={onIntroClick} className="text-sm font-bold text-white hover:text-yellow-300 transition-colors flex items-center gap-1">
              <Info className="w-3 h-3" /> About
            </button>
            <button onClick={onManualClick} className="text-sm font-medium text-white hover:text-yellow-300 transition-colors flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> 매뉴얼
            </button>
            <button onClick={onNoticeClick} className="text-sm font-medium text-white hover:text-yellow-300 transition-colors flex items-center gap-1">
              <Megaphone className="w-3 h-3" /> 공지사항
            </button>
            <button onClick={() => checkLogin(() => onBookingClick?.())} className="text-sm font-medium text-white hover:text-yellow-300 transition-colors flex items-center gap-1">
              <CalendarCheck2 className="w-3 h-3" /> 상담 예약
            </button>
            <div className="h-4 w-px bg-white/20 mx-2"></div>
            <a href={edsUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-yellow-300 hover:text-white transition-colors">EDI</a>
            <button 
              onClick={() => checkLogin(() => onTestClick?.())}
              className={`text-sm font-bold flex items-center gap-1 transition-colors ${isUserLoggedIn ? 'text-green-300 hover:text-white' : 'text-white/60 hover:text-white'}`}
            >
              {!isUserLoggedIn && <LockKeyhole className="w-3 h-3" />}
              S-Level Test
            </button>
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white/60 hover:text-yellow-300 transition-colors flex items-center gap-1">
              <Youtube className="w-3 h-3" /> 영상
            </a>
          </div>

          <div className="flex items-center gap-3">
            {isUserLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-2 rounded-full text-white transition-all font-bold text-sm border border-white/20"
              >
                <span>로그아웃</span>
              </button>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal (Login/Signup) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-blue-950/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-fade-in-up">
            <button onClick={closeModal} className="absolute top-6 right-6 text-slate-400 hover:text-blue-600 transition-colors">
              <X className="w-6 h-6" />
            </button>

            <div className="p-10 max-h-[90vh] overflow-y-auto">
              <div className="text-center mb-8">
                <div className="inline-block bg-blue-600 text-white p-2 px-3 rounded-lg font-bold mb-4">ED Study</div>
                <h3 className="text-2xl font-bold text-blue-950">
                  {authMode === 'login' ? '환영합니다!' : '회원가입'}
                </h3>
                <p className="text-slate-500 text-sm mt-2">
                  {authMode === 'login' ? 'LMS 계정으로 로그인하세요' : 'ED Study와 함께 변화를 시작하세요'}
                </p>
              </div>

              {authMode === 'login' ? (
                <form className="space-y-4" onSubmit={handleLogin}>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required
                      type="email" 
                      placeholder="이메일 주소" 
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required
                      type="password" 
                      placeholder="비밀번호" 
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <button 
                    disabled={isLoading}
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
                  >
                    {isLoading ? '인증 중...' : '로그인'}
                  </button>
                  <div className="text-center mt-6">
                    <p className="text-sm text-slate-500">
                      계정이 없으신가요? <button type="button" onClick={() => setAuthMode('signup')} className="text-blue-600 font-bold hover:underline">회원가입</button>
                    </p>
                  </div>
                </form>
              ) : (
                <form className="space-y-4" onSubmit={handleSignup}>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required
                      type="text" 
                      placeholder="성명" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required
                      type="email" 
                      placeholder="이메일 주소" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required
                      type="tel" 
                      placeholder="핸드폰 번호 (010-0000-0000)" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required
                      type="password" 
                      placeholder="비밀번호" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <button 
                    disabled={isLoading}
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
                  >
                    {isLoading ? '처리 중...' : '가입 완료'}
                  </button>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Or continue with</span></div>
                  </div>

                  <button 
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full py-4 px-6 border-2 border-slate-100 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all group disabled:opacity-50"
                  >
                    <Chrome className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-slate-700">Google 계정으로 계속하기</span>
                  </button>

                  <div className="text-center mt-6">
                    <p className="text-sm text-slate-500">
                      이미 계정이 있으신가요? <button type="button" onClick={() => setAuthMode('login')} className="text-blue-600 font-bold hover:underline">로그인</button>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
