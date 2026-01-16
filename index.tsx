
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("ED Study: Application initializing...");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("ED Study Error: Root element '#root' not found.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("ED Study: React render complete.");
  } catch (error) {
    console.error("ED Study Error during rendering:", error);
    rootElement.innerHTML = `<div style="color: white; padding: 20px; text-align: center;">실행 중 오류가 발생했습니다. 콘솔을 확인해주세요.</div>`;
  }
}
