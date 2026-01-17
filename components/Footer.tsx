
import React from 'react';
import { Facebook, Instagram, Youtube, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onAdminClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  const edsUrl = "https://thebestys.github.io/EDS/";

  return (
    <footer className="bg-blue-950 border-t border-blue-900 pt-20 pb-10 relative z-30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <a href={edsUrl} className="flex items-center gap-2 mb-6">
              <div className="bg-blue-600 text-white p-1 px-2 rounded font-bold en-font text-md">ED</div>
              <span className="font-sans text-xl font-bold tracking-tight text-white italic">Study</span>
            </a>
            <p className="text-blue-200/60 text-sm max-w-sm mb-8 leading-relaxed font-light">
              ED Study는 세계적인 교육 기업 Pearson의 English Discoveries 플랫폼을 기반으로 최상의 온라인 영어 교육 서비스를 제공합니다.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white hover:bg-blue-600 transition-colors border border-white/5">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white hover:bg-blue-600 transition-colors border border-white/5">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white hover:bg-blue-600 transition-colors border border-white/5">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-6">수강 과정</h4>
            <ul className="space-y-4">
              <li><a href="#curriculum" className="text-sm text-blue-200/60 hover:text-yellow-400 transition-colors">기초 영어 (Basic)</a></li>
              <li><a href="#curriculum" className="text-sm text-blue-200/60 hover:text-yellow-400 transition-colors">비즈니스 영어</a></li>
              <li><a href="#curriculum" className="text-sm text-blue-200/60 hover:text-yellow-400 transition-colors">시험 대비반 (TOEIC)</a></li>
              <li><a href="#curriculum" className="text-sm text-blue-200/60 hover:text-yellow-400 transition-colors">스피킹 집중 훈련</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-6">고객 센터</h4>
            <ul className="space-y-4">
              <li><a href={edsUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-200/60 hover:text-yellow-400 transition-colors">공지사항</a></li>
              <li><a href={edsUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-200/60 hover:text-yellow-400 transition-colors">자주 묻는 질문</a></li>
              <li><a href={edsUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-200/60 hover:text-yellow-400 transition-colors">1:1 문의하기</a></li>
              <li><a href={edsUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-200/60 hover:text-yellow-400 transition-colors">기업 출강 문의</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-blue-200/40 tracking-wider text-center md:text-left">
              © 2024 ED Study. All Rights Reserved. English Discoveries is a trademark of Edusoft.
            </span>
            <button 
              onClick={onAdminClick}
              className="text-[10px] text-blue-200/20 hover:text-blue-200/50 flex items-center gap-1 justify-center md:justify-start"
            >
              <ShieldCheck className="w-3 h-3" /> 관리자 전용
            </button>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-[11px] text-blue-200/40 hover:text-white tracking-wider">이용약관</a>
            <a href="#" className="text-[11px] text-blue-200/40 hover:text-white tracking-wider font-bold">개인정보처리방침</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
