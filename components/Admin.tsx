
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Download, LogOut, Search, Users, ShieldAlert, ArrowLeft } from 'lucide-react';

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  provider?: string;
}

interface AdminProps {
  onExit: () => void;
}

const Admin: React.FC<AdminProps> = ({ onExit }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      const storedUsers = JSON.parse(localStorage.getItem('edstudy_users') || '[]');
      setUsers(storedUsers);
    }
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (id === 'edstudy' && password === 'pass1234') {
      setIsLoggedIn(true);
    } else {
      alert('관리자 정보가 일치하지 않습니다.');
    }
  };

  const downloadExcel = () => {
    if (users.length === 0) return alert('내보낼 데이터가 없습니다.');
    
    // Create CSV content
    const headers = ['성명', '이메일', '핸드폰 번호', '가입일', '가입경로'];
    const rows = users.map(u => [
      u.name,
      u.email,
      u.phone,
      new Date(u.createdAt).toLocaleDateString(),
      u.provider || '직접가입'
    ]);
    
    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `EDStudy_UserList_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone.includes(searchTerm)
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
            <input 
              type="text" 
              placeholder="Admin ID" 
              className="w-full px-5 py-4 bg-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full px-5 py-4 bg-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all">
              관리자 로그인
            </button>
            <button 
              type="button" 
              onClick={onExit}
              className="w-full py-4 text-slate-400 font-medium flex items-center justify-center gap-2 hover:text-slate-600 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> 메인으로 돌아가기
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar / Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 text-white p-1 px-2 rounded font-bold">ED</div>
            <h1 className="text-xl font-bold tracking-tight">Management Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={downloadExcel}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
            >
              <Download className="w-4 h-4" /> 엑셀 다운로드
            </button>
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="flex items-center gap-2 text-slate-500 hover:text-red-600 px-4 py-2 text-sm font-bold transition-all"
            >
              <LogOut className="w-4 h-4" /> 로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6">
            <div className="bg-blue-100 p-4 rounded-2xl text-blue-600"><Users className="w-8 h-8" /></div>
            <div>
              <p className="text-slate-500 text-sm font-medium">총 회원수</p>
              <h3 className="text-3xl font-bold">{users.length}명</h3>
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h4 className="text-lg font-bold">회원 명단</h4>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="이름, 이메일, 번호 검색..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-8 py-4 font-bold">성명</th>
                  <th className="px-8 py-4 font-bold">이메일</th>
                  <th className="px-8 py-4 font-bold">핸드폰 번호</th>
                  <th className="px-8 py-4 font-bold">가입일</th>
                  <th className="px-8 py-4 font-bold">가입경로</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5 font-bold text-slate-900">{user.name}</td>
                    <td className="px-8 py-5 text-slate-600">{user.email}</td>
                    <td className="px-8 py-5 text-slate-600">{user.phone}</td>
                    <td className="px-8 py-5 text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-8 py-5">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${user.provider === 'google' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                        {user.provider || 'Direct'}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic">가입된 회원이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <button 
            onClick={onExit}
            className="text-slate-400 hover:text-blue-600 font-medium transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> 메인 화면으로 복귀
          </button>
        </div>
      </main>
    </div>
  );
};

export default Admin;
