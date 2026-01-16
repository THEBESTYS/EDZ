
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("ED Study: React Bootstrapping...");

// 로딩 화면 제거 함수
const hideLoading = () => {
  const display = document.getElementById('status-display');
  if (display) {
    display.classList.add('hidden');
    console.log("ED Study: Loading screen hidden.");
  }
};

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    // 렌더링 시작 직후 로딩 화면 제거 (React 18+ render는 비동기적이므로 즉시 호출 가능)
    hideLoading();
  } catch (err) {
    console.error("ED Study: Render initialization failed", err);
    const errorMsg = document.getElementById('error-message');
    if (errorMsg) errorMsg.innerText = "애플리케이션 초기화 중 오류가 발생했습니다: " + err.message;
  }
} else {
  console.error("Critical: #root not found");
}
