
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Download, LogOut, Search, Users, ShieldAlert, ArrowLeft, Trash2, ShieldCheck, Gem, Medal, Award, Megaphone, FileText, PlusCircle, CalendarCheck2 } from 'lucide-react';

type UserLevel = 'Diamond' | 'Gold' | 'Silver';

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  provider?: string;
  level?: UserLevel;
}

interface Notice {
  id: number;
  title: string;
  content: string;
  date: string;
  isPinned: boolean;
}

interface BookingData {
  id: string;
  userEmail: string;
  userName: string;
  date: string;
  time: string;
  message?: string;
  status: 'confirmed' | 'cancelled';
}

interface AdminProps {
  onExit: () => void;
}

const Admin: React.FC<AdminProps> = ({ onExit }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [adminPw, setAdminPw] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'notices' | 'bookings'>('users');
  
  // States
  const [users, setUsers] = useState<UserData[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [notices, setNotices] = useState<Notice[]>([]);
  const [newNotice, setNewNotice] = useState({ title: '', content: '', isPinned: false });
  const [showAddNotice, setShowAddNotice] = useState(false);
  const [bookings, setBookings] = useState<BookingData[]>([]);

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  const loadData = () => {
    const storedUsers = JSON.parse(localStorage.getItem('edstudy_users') || '[]');
    const storedNotices = JSON.parse(localStorage.getItem('edstudy_notices') || '[]');
    const storedBookings = JSON.parse(localStorage.getItem('edstudy_bookings') || '[]');
    setUsers(storedUsers);
    setNotices(storedNotices);
    setBookings(storedBookings);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminId === 'edstudy' && adminPw === 'pass1234') {
      setIsLoggedIn(true);
    } else {
      alert('관리자 정보가 일치하지 않습니다.');
    }
  };

  const deleteUser = (userId: number) => {
    if (window.confirm('정말 이 회원을 삭제하시겠습니까?')) {
      const updated = users.filter(u => u.id !== userId);
      localStorage.setItem('edstudy_users', JSON.stringify(updated));
      setUsers(updated);
    }
  };

  const updateLevel = (userId: number, newLevel: UserLevel) => {
    const updated = users.map(u => u.id === userId ? { ...u, level: newLevel } : u);
    localStorage.setItem('edstudy_users', JSON.stringify(updated));
    setUsers(updated);
  };

  const addNotice = () => {
    if (!newNotice.title || !newNotice.content) return alert('제목과 내용을 모두 입력해주세요.');
    const notice: Notice = {
      id: Date.now(),
      title: newNotice.title,
      content: newNotice.content,
      date: new Date().toISOString(),
      isPinned: newNotice.isPinned
    };
    const updated = [notice, ...notices];
    localStorage.setItem('edstudy_notices', JSON.stringify(updated));
    setNotices(updated);
    setNewNotice({ title: '', content: '', isPinned: false });
    setShowAddNotice(false);
    alert('공지사항이 등록되었습니다.');
  };

  const deleteNotice = (id: number) => {
    if (window.confirm('공지사항을 삭제하시겠습니까?')) {
      const updated = notices.filter(n => n.id !== id);
      localStorage.setItem('edstudy_notices', JSON.stringify(updated));
      setNotices(updated);
    }
  };

  const cancelBookingAdmin = (id: string) => {
    if (window.confirm('이 예약을 취소 처리하시겠습니까?')) {
      const updated = bookings.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b);
      localStorage.setItem('edstudy_bookings', JSON.stringify(updated));
      setBookings(updated);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-md rounded-3xl p-10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-red-100 rounded-2xl mb-4">
              <ShieldAlert className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Admin Login</h2>
            <p className="text-slate-500 text-sm mt-2">관리자 전용 페이지입니다.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Admin ID" className="w-full px-5 py-4 bg-slate-100 rounded-xl outline-none" value={adminId} onChange={(e) => setAdminId(e.target.value)} />
            <input type="password" placeholder="Password" className="w-full px-5 py-4 bg-slate-100 rounded-xl outline-none" value={adminPw} onChange={(e) => setAdminPw(e.target.value)} />
            <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">관리자 로그인</button>
            <button type="button" onClick={onExit} className="w-full py-4 text-slate-400 font-medium flex items-center justify-center gap-2"><ArrowLeft className="w-4 h-4" /> 메인으로 돌아가기</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1 px-2 rounded font-bold">ED</div>
              <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
            </div>
            <nav className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'users' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                <Users className="w-4 h-4" /> 회원 관리
              </button>
              <button onClick={() => setActiveTab('notices')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'notices' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                <Megaphone className="w-4 h-4" /> 공지사항 관리
              </button>
              <button onClick={() => setActiveTab('bookings')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'bookings' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                <CalendarCheck2 className="w-4 h-4" /> 예약 관리
              </button>
            </nav>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-2 text-slate-500 hover:text-red-600 px-4 py-2 text-sm font-bold"><LogOut className="w-4 h-4" /> 로그아웃</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {activeTab === 'users' ? (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h4 className="text-lg font-bold">회원 명단</h4>
              <div className="relative w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="이름, 이메일 검색..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
              </div>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-8 py-4 font-bold">정보</th>
                  <th className="px-8 py-4 font-bold">등급</th>
                  <th className="px-8 py-4 font-bold text-center">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-8 py-5">
                      <p className="font-bold">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </td>
                    <td className="px-8 py-5">
                      <select value={user.level || 'Silver'} onChange={(e) => updateLevel(user.id, e.target.value as UserLevel)} className="text-xs p-1 border rounded">
                        <option value="Diamond">Diamond</option>
                        <option value="Gold">Gold</option>
                        <option value="Silver">Silver</option>
                      </select>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <button onClick={() => deleteUser(user.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'notices' ? (
          <div className="space-y-6">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">공지사항 관리</h2>
              <button onClick={() => setShowAddNotice(!showAddNotice)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><PlusCircle className="w-4 h-4" /> 새 공지</button>
            </div>
            {showAddNotice && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
                <input type="text" placeholder="제목" className="w-full p-3 border rounded-xl" value={newNotice.title} onChange={(e) => setNewNotice({...newNotice, title: e.target.value})} />
                <textarea placeholder="내용" className="w-full p-3 border rounded-xl h-32" value={newNotice.content} onChange={(e) => setNewNotice({...newNotice, content: e.target.value})} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={newNotice.isPinned} onChange={(e) => setNewNotice({...newNotice, isPinned: e.target.checked})} /> 중요 공지</label>
                <button onClick={addNotice} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold">등록</button>
              </div>
            )}
            <table className="w-full bg-white rounded-3xl overflow-hidden border">
              <thead><tr className="bg-slate-50 text-xs">
                <th className="p-4">고정</th><th className="p-4">제목</th><th className="p-4 text-center">삭제</th>
              </tr></thead>
              <tbody className="divide-y">
                {notices.map(n => (
                  <tr key={n.id}>
                    <td className="p-4 text-center">{n.isPinned ? '📌' : ''}</td>
                    <td className="p-4 font-bold">{n.title}</td>
                    <td className="p-4 text-center"><button onClick={() => deleteNotice(n.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">예약 현황 관리</h2>
            <div className="bg-white rounded-3xl border overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-xs">
                    <th className="p-4">사용자</th><th className="p-4">날짜/시간</th><th className="p-4">상태</th><th className="p-4 text-center">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td className="p-4">
                        <p className="font-bold">{b.userName}</p>
                        <p className="text-xs text-slate-400">{b.userEmail}</p>
                      </td>
                      <td className="p-4">{b.date} / {b.time}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {b.status === 'confirmed' ? '예약완료' : '취소됨'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {b.status === 'confirmed' && (
                          <button onClick={() => cancelBookingAdmin(b.id)} className="text-xs font-bold text-red-600 hover:underline">취소 처리</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <button onClick={onExit} className="mt-8 text-slate-400 flex items-center gap-1 hover:text-blue-600"><ArrowLeft className="w-4 h-4" /> 복귀</button>
      </main>
    </div>
  );
};

export default Admin;
