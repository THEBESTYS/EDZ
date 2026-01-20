
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Download, LogOut, Search, Users, ShieldAlert, ArrowLeft, Trash2, ShieldCheck, Gem, Medal, Award, Megaphone, FileText, PlusCircle } from 'lucide-react';

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

interface AdminProps {
  onExit: () => void;
}

const Admin: React.FC<AdminProps> = ({ onExit }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [adminPw, setAdminPw] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'notices'>('users');
  
  // User States
  const [users, setUsers] = useState<UserData[]>([]);
  const [userSearch, setUserSearch] = useState('');
  
  // Notice States
  const [notices, setNotices] = useState<Notice[]>([]);
  const [newNotice, setNewNotice] = useState({ title: '', content: '', isPinned: false });
  const [showAddNotice, setShowAddNotice] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  const loadData = () => {
    const storedUsers = JSON.parse(localStorage.getItem('edstudy_users') || '[]');
    const storedNotices = JSON.parse(localStorage.getItem('edstudy_notices') || '[]');
    setUsers(storedUsers);
    setNotices(storedNotices);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminId === 'edstudy' && adminPw === 'pass1234') {
      setIsLoggedIn(true);
    } else {
      alert('관리자 정보가 일치하지 않습니다.');
    }
  };

  // User Management Functions
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

  // Notice Management Functions
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

  const downloadExcel = () => {
    if (users.length === 0) return alert('내보낼 데이터가 없습니다.');
    const headers = ['성명', '이메일', '핸드폰 번호', '가입일', '가입경로', '회원등급'];
    const rows = users.map(u => [u.name, u.email, u.phone, new Date(u.createdAt).toLocaleDateString(), u.provider || '직접가입', u.level || 'Silver']);
    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `EDStudy_UserList_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.phone.includes(userSearch)
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
              <button 
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'users' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Users className="w-4 h-4" /> 회원 관리
              </button>
              <button 
                onClick={() => setActiveTab('notices')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'notices' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Megaphone className="w-4 h-4" /> 공지사항 관리
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={downloadExcel} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold"><Download className="w-4 h-4" /> 엑셀</button>
            <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-2 text-slate-500 hover:text-red-600 px-4 py-2 text-sm font-bold"><LogOut className="w-4 h-4" /> 로그아웃</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {activeTab === 'users' ? (
          /* User Management View */
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-2xl text-blue-600"><Users className="w-6 h-6" /></div>
                <div><p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">총 회원수</p><h3 className="text-xl font-bold">{users.length}명</h3></div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="bg-cyan-100 p-3 rounded-2xl text-cyan-600"><Gem className="w-6 h-6" /></div>
                <div><p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">다이아몬드</p><h3 className="text-xl font-bold">{users.filter(u => u.level === 'Diamond').length}명</h3></div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-2xl text-yellow-600"><Medal className="w-6 h-6" /></div>
                <div><p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">골드</p><h3 className="text-xl font-bold">{users.filter(u => u.level === 'Gold').length}명</h3></div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="bg-slate-100 p-3 rounded-2xl text-slate-600"><Award className="w-6 h-6" /></div>
                <div><p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">실버</p><h3 className="text-xl font-bold">{users.filter(u => !u.level || u.level === 'Silver').length}명</h3></div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h4 className="text-lg font-bold">회원 명단</h4>
                <div className="relative w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="이름, 이메일, 번호 검색..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="px-8 py-4 font-bold">성명 / 정보</th>
                      <th className="px-8 py-4 font-bold">핸드폰 번호</th>
                      <th className="px-8 py-4 font-bold">등급 설정</th>
                      <th className="px-8 py-4 font-bold">가입일 / 경로</th>
                      <th className="px-8 py-4 font-bold text-center">작업</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-5">
                          <p className="font-bold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                        </td>
                        <td className="px-8 py-5 text-slate-600 font-medium">{user.phone}</td>
                        <td className="px-8 py-5">
                          <select 
                            value={user.level || 'Silver'} 
                            onChange={(e) => updateLevel(user.id, e.target.value as UserLevel)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-none ${user.level === 'Diamond' ? 'bg-cyan-50 text-cyan-600' : user.level === 'Gold' ? 'bg-yellow-50 text-yellow-600' : 'bg-slate-50 text-slate-500'}`}
                          >
                            <option value="Diamond">💎 Diamond</option>
                            <option value="Gold">🥇 Gold</option>
                            <option value="Silver">🥈 Silver</option>
                          </select>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-slate-600 font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${user.provider === 'google' ? 'bg-blue-50 text-blue-500' : 'bg-slate-50 text-slate-400'}`}>{user.provider || 'Direct'}</span>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <button onClick={() => deleteUser(user.id)} className="p-2 text-slate-300 hover:text-red-600 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic">가입된 회원이 없습니다.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* Notice Management View */
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-3"><Megaphone className="w-7 h-7 text-blue-600" /> 공지사항 관리</h2>
              <button 
                onClick={() => setShowAddNotice(!showAddNotice)}
                className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
              >
                <PlusCircle className="w-5 h-5" /> 새 공지 작성
              </button>
            </div>

            {showAddNotice && (
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 animate-fade-in-up">
                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">공지 제목</label>
                    <input 
                      type="text" 
                      placeholder="공지사항 제목을 입력하세요"
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                      value={newNotice.title}
                      onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">공지 내용</label>
                    <textarea 
                      rows={5}
                      placeholder="공지사항 내용을 입력하세요"
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      value={newNotice.content}
                      onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="pin" 
                      className="w-4 h-4 text-blue-600" 
                      checked={newNotice.isPinned} 
                      onChange={(e) => setNewNotice({...newNotice, isPinned: e.target.checked})}
                    />
                    <label htmlFor="pin" className="text-sm font-bold text-slate-600 cursor-pointer">중요 공지로 고정</label>
                  </div>
                  <div className="flex gap-3 justify-end mt-4">
                    <button onClick={() => setShowAddNotice(false)} className="px-6 py-3 bg-slate-100 text-slate-500 font-bold rounded-xl">취소</button>
                    <button onClick={addNotice} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">작성 완료</button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-8 py-4 font-bold">구분</th>
                    <th className="px-8 py-4 font-bold">제목</th>
                    <th className="px-8 py-4 font-bold text-center">작성일</th>
                    <th className="px-8 py-4 font-bold text-center">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {notices.length > 0 ? notices.map((notice) => (
                    <tr key={notice.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5">
                        {notice.isPinned ? (
                          <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-1 rounded-md border border-red-100">중요</span>
                        ) : (
                          <span className="text-slate-400 text-[10px] font-bold">일반</span>
                        )}
                      </td>
                      <td className="px-8 py-5">
                        <p className={`font-bold text-slate-900 ${notice.isPinned ? 'text-blue-600' : ''}`}>{notice.title}</p>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-1">{notice.content}</p>
                      </td>
                      <td className="px-8 py-5 text-center text-sm text-slate-500">
                        {new Date(notice.date).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-5 text-center">
                        <button onClick={() => deleteNotice(notice.id)} className="p-2 text-slate-300 hover:text-red-500 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400 italic">등록된 공지사항이 없습니다.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        <div className="mt-10 text-center">
          <button onClick={onExit} className="text-slate-400 hover:text-blue-600 font-medium flex items-center gap-2 justify-center"><ArrowLeft className="w-4 h-4" /> 메인으로 복귀</button>
        </div>
      </main>
    </div>
  );
};

export default Admin;
