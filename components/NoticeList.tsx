
import React, { useState, useEffect } from 'react';
import { Megaphone, ChevronRight, ArrowLeft, Calendar, User, Search } from 'lucide-react';

interface Notice {
  id: number;
  title: string;
  content: string;
  date: string;
  isPinned: boolean;
}

interface NoticeListProps {
  onExit: () => void;
}

const NoticeList: React.FC<NoticeListProps> = ({ onExit }) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('edstudy_notices') || '[]');
    // Pin 우선, 날짜 역순
    const sorted = [...stored].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.id - a.id;
    });
    setNotices(sorted);
  }, []);

  const filteredNotices = notices.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={onExit} className="mb-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-all">
          <ArrowLeft className="w-5 h-5" /> 메인으로 돌아가기
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black text-blue-950 tracking-tight flex items-center gap-3">
              <Megaphone className="w-8 h-8 text-blue-600" /> 공지사항
            </h2>
            <p className="text-slate-500 mt-2 font-medium">ED Study의 새로운 소식을 확인하세요.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="제목 또는 내용 검색" 
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredNotices.length > 0 ? filteredNotices.map(notice => (
            <div 
              key={notice.id} 
              onClick={() => setSelectedNotice(selectedNotice?.id === notice.id ? null : notice)}
              className={`bg-white rounded-[2rem] border transition-all cursor-pointer overflow-hidden ${selectedNotice?.id === notice.id ? 'border-blue-500 shadow-xl scale-[1.01]' : 'border-slate-100 hover:border-blue-200 shadow-sm'}`}
            >
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  {notice.isPinned && (
                    <span className="bg-red-50 text-red-500 text-[10px] font-black px-2.5 py-1 rounded-full border border-red-100 uppercase tracking-wider">Notice</span>
                  )}
                  <div className="flex items-center gap-3 text-slate-400 text-xs font-bold">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(notice.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> Admin</span>
                  </div>
                </div>
                
                <h3 className={`text-xl font-bold tracking-tight mb-2 ${notice.isPinned ? 'text-blue-600' : 'text-slate-900'}`}>{notice.title}</h3>
                <p className={`text-slate-500 leading-relaxed ${selectedNotice?.id === notice.id ? '' : 'line-clamp-2 text-sm'}`}>
                  {notice.content}
                </p>
                
                <div className="mt-4 flex items-center text-xs font-bold text-blue-600 uppercase tracking-widest gap-1 group">
                  {selectedNotice?.id === notice.id ? 'Close' : 'Read more'} 
                  <ChevronRight className={`w-3 h-3 transition-transform ${selectedNotice?.id === notice.id ? 'rotate-90' : ''}`} />
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 border-dashed">
              <Megaphone className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-bold">등록된 공지사항이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticeList;
