
import React, { useState, useEffect } from 'react';
import { Megaphone, ChevronRight, X } from 'lucide-react';

interface Notice {
  id: number;
  title: string;
  content: string;
  date: string;
  isPinned: boolean;
}

const NoticeBar: React.FC = () => {
  const [latestNotice, setLatestNotice] = useState<Notice | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('edstudy_notices') || '[]');
    if (stored.length > 0) {
      // 중요 공지 우선, 그 다음 최신 순
      const sorted = [...stored].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.id - a.id;
      });
      setLatestNotice(sorted[0]);
    }
  }, []);

  if (!latestNotice || !isVisible) return null;

  return (
    <div className="relative z-[45] bg-yellow-400 py-3 animate-fade-in">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-blue-600 text-white p-1 rounded shadow-sm flex-shrink-0">
            <Megaphone className="w-4 h-4" />
          </div>
          <span className="text-blue-900 font-bold text-xs uppercase tracking-widest flex-shrink-0">Notice</span>
          <p className="text-blue-950 font-medium text-sm truncate">
            {latestNotice.isPinned && <span className="mr-2 text-red-600 font-black">[중요]</span>}
            {latestNotice.title}
          </p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <button className="flex items-center gap-1 text-blue-900 font-bold text-xs hover:underline">
            자세히 보기 <ChevronRight className="w-4 h-4" />
          </button>
          <button onClick={() => setIsVisible(false)} className="text-blue-900/50 hover:text-blue-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeBar;
