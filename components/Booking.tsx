
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, CheckCircle, ArrowLeft, XCircle } from 'lucide-react';

interface BookingProps {
  onExit: () => void;
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

const Booking: React.FC<BookingProps> = ({ onExit }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [message, setMessage] = useState('');
  const [myBookings, setMyBookings] = useState<BookingData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const userSession = JSON.parse(sessionStorage.getItem('edstudy_session') || '{}');
  
  const timeSlots = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    const all = JSON.parse(localStorage.getItem('edstudy_bookings') || '[]');
    const mine = all.filter((b: BookingData) => b.userEmail === userSession.email);
    setMyBookings(mine);
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return alert('날짜와 시간을 선택해주세요.');
    
    setIsSubmitting(true);
    setTimeout(() => {
      const all = JSON.parse(localStorage.getItem('edstudy_bookings') || '[]');
      
      const isTaken = all.some((b: BookingData) => b.date === selectedDate && b.time === selectedTime && b.status === 'confirmed');
      if (isTaken) {
        alert('이미 예약된 시간대입니다. 다른 시간을 선택해주세요.');
        setIsSubmitting(false);
        return;
      }

      const newBooking: BookingData = {
        id: `book_${Date.now()}`,
        userEmail: userSession.email,
        userName: userSession.name,
        date: selectedDate,
        time: selectedTime,
        message,
        status: 'confirmed'
      };

      localStorage.setItem('edstudy_bookings', JSON.stringify([...all, newBooking]));
      loadBookings();
      setSelectedDate('');
      setSelectedTime('');
      setMessage('');
      setIsSubmitting(false);
      alert('상담 예약이 완료되었습니다!');
    }, 800);
  };

  const cancelBooking = (id: string) => {
    if (window.confirm('예약을 취소하시겠습니까?')) {
      const all = JSON.parse(localStorage.getItem('edstudy_bookings') || '[]');
      const updated = all.map((b: BookingData) => b.id === id ? { ...b, status: 'cancelled' as const } : b);
      localStorage.setItem('edstudy_bookings', JSON.stringify(updated));
      loadBookings();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={onExit} className="mb-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-all">
          <ArrowLeft className="w-5 h-5" /> 메인으로 돌아가기
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* New Booking Section */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
            <h2 className="text-2xl font-black text-blue-950 mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-600" /> 신규 상담 예약
            </h2>
            
            <form onSubmit={handleBooking} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">날짜 선택</label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">시간 선택</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-3 rounded-xl text-sm font-bold transition-all border ${selectedTime === slot ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200'}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">상담 메모 (선택)</label>
                <textarea 
                  placeholder="상담 시 전달할 내용을 적어주세요."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button 
                disabled={isSubmitting}
                className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
              >
                {isSubmitting ? '처리 중...' : '상담 예약하기'}
              </button>
            </form>
          </div>

          {/* My Bookings Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-blue-950 flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-600" /> 내 예약 내역
            </h2>
            
            <div className="space-y-4">
              {myBookings.length > 0 ? myBookings.map(book => (
                <div key={book.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${book.status === 'confirmed' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-300'}`}>
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{book.date} {book.time}</div>
                      <div className={`text-[10px] font-bold uppercase mt-1 ${book.status === 'confirmed' ? 'text-green-600' : 'text-red-400'}`}>
                        {book.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}
                      </div>
                    </div>
                  </div>
                  {book.status === 'confirmed' && (
                    <button 
                      onClick={() => cancelBooking(book.id)}
                      className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-all"
                    >
                      취소
                    </button>
                  )}
                </div>
              )) : (
                <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 border-dashed text-center">
                  <p className="text-slate-400 font-bold">예약된 상담 내역이 없습니다.</p>
                </div>
              )}
            </div>
            
            <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-100">
              <h4 className="font-bold text-yellow-800 text-sm mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> 예약 유의사항
              </h4>
              <ul className="text-xs text-yellow-700/70 space-y-1 list-disc ml-4">
                <li>상담 예약은 최소 1일 전까지 가능합니다.</li>
                <li>당일 취소는 고객센터를 통해 문의해 주세요.</li>
                <li>상담은 비대면(전화/화상)으로 진행됩니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
