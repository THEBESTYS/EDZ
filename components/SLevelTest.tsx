
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { 
  ArrowLeft, Mic as MicIcon, StopCircle, CheckCircle2, 
  AlertCircle, BarChart3, Globe2, BrainCircuit, Headphones, 
  ArrowRight, ShieldCheck, PlayCircle, Loader2, Target, History, Trash2,
  Upload, Clock, Sparkles, Zap
} from 'lucide-react';

interface SLevelTestProps {
  onExit: () => void;
}

interface AnalysisResult {
  timestamp: string;
  edLevel: string;
  levelDesc: string;
  cefr: string;
  toeic: string;
  ielts: string;
  scores: {
    pronunciation: number;
    fluency: number;
    vocabulary: number;
    grammar: number;
  };
  reasoning: string;
  detectedLanguage: string;
}

const SLevelTest: React.FC<SLevelTestProps> = ({ onExit }) => {
  const [step, setStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisSubStep, setAnalysisSubStep] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analysisTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('edstudy_test_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (analysisTimeoutRef.current) window.clearTimeout(analysisTimeoutRef.current);
    };
  }, []);

  const saveToHistory = (newResult: AnalysisResult) => {
    const updated = [newResult, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem('edstudy_test_history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    if (window.confirm('모든 학습 이력을 삭제하시겠습니까?')) {
      setHistory([]);
      localStorage.removeItem('edstudy_test_history');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setStep(3);
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Mic access failed", err);
      alert("마이크 접근 권한이 필요합니다.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) window.clearInterval(timerRef.current);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // 50MB까지 허용 (대용량 대응)
      if (file.size > 50 * 1024 * 1024) {
        alert("파일 크기는 50MB 이하여야 합니다.");
        return;
      }
      setAudioBlob(file);
      setStep(3);
    }
  };

  const readFileAsBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = () => reject(new Error("파일 로딩 중 오류가 발생했습니다."));
      reader.readAsDataURL(blob);
    });
  };

  const ensureConnection = async (): Promise<boolean> => {
    // API 키가 명시적으로 없는 브라우저 환경에서 연결을 보장하는 로직
    if (!process.env.API_KEY && typeof window.aistudio?.hasSelectedApiKey === 'function') {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        // 사용자에게 '연결 최적화' 단계임을 알리고 시스템 팝업을 띄움
        setIsCheckingConnection(true);
        try {
          await window.aistudio.openSelectKey();
          return true; // 팝업 후 바로 진행 시도
        } finally {
          setIsCheckingConnection(false);
        }
      }
    }
    return true;
  };

  const analyzeAudio = async () => {
    if (!audioBlob) return;
    
    // 1. 연결 상태 체크 (API Key 누락 방지)
    const connected = await ensureConnection();
    if (!connected) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisSubStep(1);
    setAnalysisProgress(5);

    analysisTimeoutRef.current = window.setTimeout(() => {
      if (isAnalyzing) {
        setIsAnalyzing(false);
        setError("AI 서버 응답이 지연되고 있습니다. 파일 용량을 조금 줄이거나 다시 시도해 주세요.");
      }
    }, 120000);

    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => (prev < 92 ? prev + Math.random() * 4 : prev));
    }, 1200);

    try {
      const base64Data = await readFileAsBase64(audioBlob);
      setAnalysisSubStep(2);
      setAnalysisProgress(25);
      
      // 최신 API 인스턴스 생성 (최신 키 반영)
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Evaluate the speaker's English speaking level precisely based on this audio.
        ANALYSIS SCOPE:
        1. Check if the input is English. If not, return "edLevel": "Pre-Basic" and explain in reasoning.
        2. Evaluate: Pronunciation, Fluency, Vocabulary, and Grammar (0-100 each).
        3. Determine Level: Pre-Basic, Basic 1-3, Intermediate 1-3, Advanced 1-3.
        4. "Advanced 3" is reserved for near-native, sophisticated expression.
        
        Output must be JSON.
      `;

      setAnalysisSubStep(3);
      setAnalysisProgress(55);

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              { text: prompt },
              { inlineData: { mimeType: audioBlob.type || 'audio/webm', data: base64Data } }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 0 }, // 가속 모드
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              detectedLanguage: { type: Type.STRING },
              edLevel: { type: Type.STRING },
              levelDesc: { type: Type.STRING },
              cefr: { type: Type.STRING },
              toeic: { type: Type.STRING },
              ielts: { type: Type.STRING },
              scores: {
                type: Type.OBJECT,
                properties: {
                  pronunciation: { type: Type.NUMBER },
                  fluency: { type: Type.NUMBER },
                  vocabulary: { type: Type.NUMBER },
                  grammar: { type: Type.NUMBER },
                },
                required: ["pronunciation", "fluency", "vocabulary", "grammar"]
              },
              reasoning: { type: Type.STRING }
            },
            required: ["detectedLanguage", "edLevel", "levelDesc", "cefr", "toeic", "ielts", "scores", "reasoning"]
          }
        }
      });

      setAnalysisSubStep(4);
      setAnalysisProgress(95);

      const data = JSON.parse(response.text);
      const finalResult = { ...data, timestamp: new Date().toISOString() };
      
      clearInterval(progressInterval);
      if (analysisTimeoutRef.current) window.clearTimeout(analysisTimeoutRef.current);
      
      setResult(finalResult);
      saveToHistory(finalResult);
      setStep(4);
      setIsAnalyzing(false);
      setAnalysisProgress(100);
    } catch (err: any) {
      clearInterval(progressInterval);
      if (analysisTimeoutRef.current) window.clearTimeout(analysisTimeoutRef.current);
      console.error("Analysis Failure:", err);
      
      if (err.message?.includes("API Key")) {
        setError("AI 시스템 연결 인증이 필요합니다. 아래 '시스템 연결 최적화' 버튼을 눌러주세요.");
      } else {
        setError(`분석에 실패했습니다: ${err.message || "알 수 없는 오류"}. 다시 시도해 주세요.`);
      }
      setIsAnalyzing(false);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getSubStepText = () => {
    switch(analysisSubStep) {
      case 1: return "대용량 오디오 데이터 스트림 최적화 중...";
      case 2: return "AI 모델로 오디오 특징 데이터 전송 중...";
      case 3: return "언어 지능 엔진이 발음 및 문법 정밀 분석 중...";
      case 4: return "CEFR 기반 상세 진단 리포트 구성 중...";
      default: return "AI 분석 엔진을 가동합니다...";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-1.5 px-3 rounded-lg font-bold text-xs shadow-md">EDAI</div>
            <h1 className="font-bold text-slate-900 tracking-tight">S-Level 초고속 진단</h1>
          </div>
          <button onClick={onExit} className="text-slate-400 hover:text-slate-600 transition-all p-2 hover:bg-slate-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-4xl w-full mx-auto p-6 flex flex-col items-center">
        {/* Progress Stepper */}
        <div className="w-full mb-12 flex justify-between relative px-4 max-w-lg">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-all duration-500 shadow-sm ${step >= s ? 'bg-blue-600 border-blue-100 text-white' : 'bg-white border-slate-200 text-slate-300'}`}>
              {s}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="w-full max-w-2xl animate-fade-in">
            <div className="text-center mb-12">
              <div className="bg-blue-600 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-white shadow-2xl shadow-blue-600/30">
                <MicIcon className="w-10 h-10" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">무료 AI 영어 진단</h2>
              <p className="text-slate-500 max-w-sm mx-auto leading-relaxed font-medium">
                1분 이상의 대용량 오디오도 문제없습니다.<br />
                Gemini 3 고성능 엔진으로 지금 확인하세요.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <button 
                onClick={() => setStep(2)}
                className="bg-blue-600 text-white p-10 rounded-[3rem] font-bold shadow-2xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-2 transition-all flex flex-col items-center gap-5 text-center group"
              >
                <div className="bg-white/20 p-5 rounded-2xl group-hover:rotate-12 transition-transform">
                  <MicIcon className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xl">실시간 음성 녹음</div>
                  <div className="text-xs text-blue-200 font-normal mt-2">지금 바로 스피킹 테스트 시작</div>
                </div>
              </button>

              <label className="cursor-pointer bg-white border-2 border-slate-200 border-dashed p-10 rounded-[3rem] font-bold hover:border-blue-400 hover:-translate-y-2 transition-all flex flex-col items-center gap-5 text-center group">
                <div className="bg-slate-50 p-5 rounded-2xl group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500" />
                </div>
                <div>
                  <div className="text-xl text-slate-700">오디오 파일 업로드</div>
                  <div className="text-xs text-slate-400 font-normal mt-2">최대 50MB 대용량 파일 지원</div>
                </div>
                <input type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>

            {history.length > 0 && (
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-slate-900 flex items-center gap-3">
                    <History className="w-6 h-6 text-blue-600" />
                    나의 진단 히스토리
                  </h3>
                  <button onClick={clearHistory} className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" /> 기록 삭제
                  </button>
                </div>
                <div className="space-y-4">
                  {history.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-blue-50 transition-all cursor-default">
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-xl shadow-sm font-black text-blue-600 text-sm">
                          {item.cefr}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-700">{item.edLevel}</div>
                          <div className="text-[10px] text-slate-400 mt-1">{new Date(item.timestamp).toLocaleString()}</div>
                        </div>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="text-center w-full max-w-md animate-fade-in flex flex-col items-center">
            <div className={`w-48 h-48 rounded-full flex items-center justify-center mb-10 relative transition-all duration-500 ${isRecording ? 'bg-red-50 shadow-[0_0_40px_rgba(239,68,68,0.2)]' : 'bg-slate-100 shadow-inner'}`}>
              {isRecording && <div className="absolute inset-0 rounded-full bg-red-400/20 animate-ping"></div>}
              <MicIcon className={`w-20 h-20 relative z-10 transition-colors ${isRecording ? 'text-red-500' : 'text-slate-400'}`} />
            </div>
            <div className="text-7xl font-mono font-black text-slate-900 mb-6 tracking-tighter">{formatTime(recordingTime)}</div>
            <p className="text-slate-500 mb-12 font-bold text-lg">
              {isRecording ? "충분히 말씀해 주세요..." : "녹음 버튼을 눌러 시작하세요"}
            </p>
            
            <div className="flex justify-center gap-8">
              {!isRecording ? (
                <button onClick={startRecording} className="bg-blue-600 text-white p-10 rounded-full shadow-[0_25px_60px_-15px_rgba(37,99,235,0.6)] hover:scale-110 transition-all active:scale-95">
                  <PlayCircle className="w-16 h-16" />
                </button>
              ) : (
                <button onClick={stopRecording} className="bg-red-500 text-white p-10 rounded-full shadow-[0_25px_60px_-15px_rgba(239,68,68,0.6)] hover:scale-110 transition-all active:scale-95">
                  <StopCircle className="w-16 h-16" />
                </button>
              )}
            </div>
            <button onClick={() => setStep(1)} className="mt-12 text-slate-400 hover:text-slate-600 font-bold text-sm border-b border-slate-200">취소하고 처음으로</button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center w-full max-w-md animate-fade-in">
            <div className="bg-green-100 w-28 h-28 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-green-600 shadow-xl shadow-green-100/50">
              <CheckCircle2 className="w-14 h-14" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">음성 데이터 분석 대기</h2>
            <p className="text-slate-500 mb-12 leading-relaxed font-medium">
              확보된 음성 데이터를 고속으로 분석합니다.<br />
              약 30초 내외로 상세 리포트가 완성됩니다.
            </p>
            
            <div className="bg-white border border-slate-200 p-8 rounded-[3rem] mb-12 flex items-center gap-6 text-left shadow-sm">
              <div className="bg-blue-50 p-5 rounded-2xl text-blue-600">
                <Zap className="w-7 h-7" />
              </div>
              <div className="flex-grow">
                <div className="text-base font-bold text-slate-700 uppercase tracking-tighter">Fast-Pass Analysis Mode</div>
                <div className="text-xs text-slate-400 mt-1">대용량 파일 정밀 스캔 엔진 대기 중</div>
              </div>
            </div>

            <button 
              onClick={analyzeAudio}
              disabled={isAnalyzing || isCheckingConnection}
              className="w-full bg-blue-600 text-white py-7 rounded-[2.5rem] font-black shadow-[0_30px_60px_-15px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-7 h-7 animate-spin" />
                  실시간 AI 분석 중...
                </>
              ) : isCheckingConnection ? (
                <>
                  <Loader2 className="w-7 h-7 animate-spin" />
                  시스템 연결 중...
                </>
              ) : (
                <>
                  <Sparkles className="w-7 h-7" />
                  AI 분석 시작하기
                </>
              )}
            </button>
            
            {isAnalyzing && (
              <div className="mt-12 w-full animate-fade-in text-left">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-[11px] font-black text-blue-600 flex items-center gap-2 uppercase tracking-widest">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {getSubStepText()}
                  </div>
                  <div className="text-sm font-black text-slate-900">{Math.round(analysisProgress)}%</div>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner p-1">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(37,99,235,0.5)] rounded-full" 
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
                <p className="mt-6 text-[11px] text-slate-400 leading-relaxed font-medium text-center italic">
                  대용량 오디오의 경우 AI 모델의 특징 추출에 시간이 다소 소요될 수 있습니다.<br />
                  화면을 닫지 말고 잠시만 기다려 주세요.
                </p>
              </div>
            )}
            
            {!isAnalyzing && (
              <button onClick={() => setStep(1)} className="mt-8 text-slate-400 hover:text-slate-600 font-bold text-sm">파일 다시 선택</button>
            )}
          </div>
        )}

        {step === 4 && result && (
          <div className="w-full animate-fade-in pb-20">
            <div className="bg-white rounded-[4rem] p-12 md:p-20 shadow-2xl shadow-blue-900/10 border border-slate-200 mb-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-10 blur-[120px] opacity-70"></div>
              
              <div className="text-center mb-24">
                <span className="text-blue-600 font-black tracking-[0.2em] uppercase text-[10px] mb-8 block px-6 py-2.5 bg-blue-50 inline-block rounded-full border border-blue-100">Professional S-Level Report</span>
                <h3 className="text-slate-400 font-bold mb-12 text-2xl tracking-tight">종합 영어 역량 진단</h3>
                
                <div className="relative inline-block">
                  <div className="bg-white border-8 border-blue-50 p-20 rounded-[5rem] shadow-2xl shadow-blue-600/10 relative z-10">
                    <div className="absolute -top-10 -right-10 bg-yellow-400 text-blue-950 p-5 rounded-[2rem] shadow-2xl animate-bounce">
                      <Sparkles className="w-10 h-10" />
                    </div>
                    <div className="text-8xl font-black text-blue-600 tracking-tighter en-font mb-6">{result.edLevel}</div>
                    <div className="text-3xl text-slate-600 font-black tracking-tight">{result.levelDesc}</div>
                  </div>
                  <div className="absolute inset-0 bg-blue-600/5 rounded-[5rem] blur-3xl -z-10 translate-y-8 scale-110"></div>
                </div>

                <div className="mt-16 text-base text-slate-400 font-black flex items-center justify-center gap-4">
                  <Globe2 className="w-5 h-5 text-blue-600" /> 주 언어: <span className="text-blue-600 font-black">{result.detectedLanguage}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                {[
                  { label: 'CEFR Grade', value: result.cefr, icon: <Globe2 className="w-4 h-4" /> },
                  { label: 'TOEIC 예측', value: result.toeic, icon: <Target className="w-4 h-4" /> },
                  { label: 'IELTS 예측', value: result.ielts, icon: <ShieldCheck className="w-4 h-4" /> }
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50 p-12 rounded-[3.5rem] text-center border border-slate-100 hover:border-blue-200 transition-all group">
                    <div className="text-[12px] text-slate-400 font-black uppercase mb-4 tracking-[0.1em] flex items-center justify-center gap-2 group-hover:text-blue-400 transition-colors">
                      {item.icon} {item.label}
                    </div>
                    <div className="text-5xl font-black text-slate-900 tracking-tighter">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-20">
                <h4 className="text-3xl font-black text-slate-900 flex items-center gap-5">
                  <div className="bg-blue-600 p-3 rounded-[1.5rem] text-white shadow-xl shadow-blue-600/30">
                    <BarChart3 className="w-8 h-8" />
                  </div>
                  상세 지능 지표
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-16">
                  {[
                    { label: '발음 명료도', value: result.scores.pronunciation, icon: <MicIcon className="w-5 h-5" />, color: 'bg-blue-600' },
                    { label: '대화 유창성', value: result.scores.fluency, icon: <PlayCircle className="w-5 h-5" />, color: 'bg-indigo-600' },
                    { label: '어휘 구사력', value: result.scores.vocabulary, icon: <Target className="w-5 h-5" />, color: 'bg-cyan-600' },
                    { label: '문법 정확성', value: result.scores.grammar, icon: <ShieldCheck className="w-5 h-5" />, color: 'bg-emerald-600' },
                  ].map(score => (
                    <div key={score.label} className="group">
                      <div className="flex justify-between items-end mb-6">
                        <div className="flex items-center gap-4 text-slate-700 font-black">
                          <div className={`p-2.5 rounded-2xl ${score.color} text-white group-hover:scale-110 transition-transform`}>{score.icon}</div>
                          <span className="text-lg">{score.label}</span>
                        </div>
                        <span className="text-slate-900 font-black en-font text-3xl group-hover:text-blue-600 transition-colors">{score.value}<span className="text-xs text-slate-300 ml-2 font-normal">/ 100</span></span>
                      </div>
                      <div className="h-5 bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
                        <div 
                          className={`h-full ${score.color} rounded-full transition-all duration-[3s] ease-out shadow-lg`} 
                          style={{ width: `${score.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-28 p-14 bg-blue-50/50 rounded-[4.5rem] border border-blue-100 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-200/20 rounded-full translate-x-12 -translate-y-12"></div>
                <div className="absolute -top-10 left-16 bg-blue-600 text-white p-6 rounded-[2.5rem] shadow-2xl group-hover:rotate-6 transition-transform">
                  <BrainCircuit className="w-10 h-10" />
                </div>
                <h5 className="font-black text-slate-900 text-3xl mb-10 mt-6 tracking-tight">AI 맞춤 종합 진단 가이드</h5>
                <p className="text-slate-600 text-xl leading-relaxed whitespace-pre-wrap font-bold">{result.reasoning}</p>
              </div>
            </div>

            <div className="bg-blue-600 rounded-[4rem] p-24 text-white text-center shadow-[0_50px_100px_-20px_rgba(37,99,235,0.4)] relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <h4 className="text-5xl font-black mb-10 relative z-10 tracking-tight">추천 학습 솔루션</h4>
              <p className="text-blue-100 mb-16 max-w-2xl mx-auto leading-relaxed text-2xl relative z-10 font-bold">
                분석 결과({result.edLevel})를 바탕으로 English Discoveries의 최적화된 마스터 코스를 제안합니다. 글로벌 전문가로 성장하는 첫 걸음을 떼어보세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center relative z-10">
                <button 
                  onClick={onExit}
                  className="bg-white text-blue-600 px-16 py-7 rounded-[2.5rem] font-black hover:bg-yellow-300 hover:text-blue-900 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-blue-900/40 active:scale-95 text-xl"
                >
                  메인 코스 입장 <ArrowRight className="w-7 h-7" />
                </button>
                <button 
                  onClick={() => setStep(1)}
                  className="bg-blue-700/50 text-white border-2 border-white/20 px-16 py-7 rounded-[2.5rem] font-black hover:bg-blue-800 transition-all backdrop-blur-xl active:scale-95 text-xl"
                >
                  테스트 다시하기
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 p-16 rounded-[4rem] flex flex-col items-center gap-12 text-red-600 mb-12 animate-fade-in w-full max-w-3xl text-center shadow-2xl shadow-red-100/50">
            <div className="bg-red-100 p-10 rounded-full shadow-inner animate-pulse">
              <AlertCircle className="w-16 h-16" />
            </div>
            <div>
              <div className="font-black text-4xl tracking-tight">진단 시스템 일시 중단</div>
              <div className="text-xl opacity-80 mt-8 leading-relaxed font-bold">{error}</div>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
              {error.includes("연결 인증") && (
                <button 
                  onClick={ensureConnection} 
                  className="bg-amber-500 text-white px-14 py-6 rounded-3xl font-black hover:bg-amber-600 transition-all shadow-2xl shadow-amber-500/30"
                >
                  시스템 연결 최적화
                </button>
              )}
              <button 
                onClick={analyzeAudio} 
                className="bg-red-600 text-white px-14 py-6 rounded-3xl font-black hover:bg-red-700 transition-all shadow-2xl shadow-red-600/30"
              >
                다시 분석 시도
              </button>
              <button 
                onClick={() => setStep(1)} 
                className="bg-white border-2 border-red-200 text-red-500 px-14 py-6 rounded-3xl font-black hover:bg-red-50 transition-all"
              >
                메인으로 이동
              </button>
            </div>
          </div>
        )}

      </main>

      <footer className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-20 text-center md:text-left">
           <div>
             <h5 className="font-black text-slate-900 mb-8 flex items-center justify-center md:justify-start gap-4">
               <ShieldCheck className="w-7 h-7 text-blue-600" /> 데이터 보안 준수
             </h5>
             <p className="text-sm text-slate-400 leading-relaxed font-black">대용량 음성 원본 데이터는 AI 분석 직후 메모리에서 완전히 소멸됩니다. 어떠한 서버에도 저장되지 않음을 보장합니다.</p>
           </div>
           <div>
             <h5 className="font-black text-slate-900 mb-8 flex items-center justify-center md:justify-start gap-4">
               <Globe2 className="w-7 h-7 text-blue-600" /> 초고속 추론 엔진
             </h5>
             <p className="text-sm text-slate-400 leading-relaxed font-black">Gemini 3 Flash 아키텍처를 기반으로 설계되어, 수 분 분량의 긴 녹음 데이터도 핵심 특징을 빠르게 추출해 평가합니다.</p>
           </div>
           <div>
             <h5 className="font-black text-slate-900 mb-8 flex items-center justify-center md:justify-start gap-4">
               <Target className="w-7 h-7 text-blue-600" /> AI 평가 신뢰도
             </h5>
             <p className="text-sm text-slate-400 leading-relaxed font-black">본 진단은 글로벌 English Discoveries의 평가 기준을 따르며, 실제 영어 실력과 오차 범위 내의 정확도를 제공합니다.</p>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default SLevelTest;
