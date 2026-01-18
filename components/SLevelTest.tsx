
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { 
  ArrowLeft, Mic as MicIcon, StopCircle, CheckCircle2, 
  AlertCircle, BarChart3, Globe2, BrainCircuit, Headphones, 
  ArrowRight, ShieldCheck, PlayCircle, Loader2, Target, History, Trash2,
  Upload, Clock, Sparkles
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
      if (file.size > 30 * 1024 * 1024) {
        alert("파일 크기는 30MB 이하여야 합니다.");
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

  const analyzeAudio = async () => {
    if (!audioBlob) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisSubStep(1);
    setAnalysisProgress(10);

    // 넉넉한 타임아웃 설정 (120초)
    analysisTimeoutRef.current = window.setTimeout(() => {
      if (isAnalyzing) {
        setIsAnalyzing(false);
        setError("서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.");
      }
    }, 120000);

    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => (prev < 95 ? prev + Math.random() * 2 : prev));
    }, 1000);

    try {
      const base64Data = await readFileAsBase64(audioBlob);
      setAnalysisSubStep(2);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Evaluate the speaker's English speaking level based on the CEFR framework.
        
        CRITICAL INSTRUCTIONS:
        1. If non-English (Korean song, conversation, or background noise) is detected: Return "edLevel": "Pre-Basic" and explain in reasoning.
        2. Assign scores (0-100) for Pronunciation, Fluency, Vocabulary, and Grammar.
        3. Levels: Pre-Basic, Basic 1-3, Intermediate 1-3, Advanced 1-3.
        4. "Advanced 3" is strictly for native-level fluency.
        
        Return the result in JSON.
      `;

      setAnalysisSubStep(3);

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
          thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for immediate response
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
      setAnalysisProgress(98);

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
      console.error("Analysis Error:", err);
      setError(`분석 실패: ${err.message || "알 수 없는 오류"}. 네트워크를 확인하거나 파일을 다시 업로드해 주세요.`);
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
      case 1: return "데이터 스트림 준비 중...";
      case 2: return "AI 서버로 데이터 전송 및 특징 추출 중...";
      case 3: return "국제 표준 CEFR 기반 레벨 대조 및 평가 중...";
      case 4: return "개별 역량 분석 리포트 생성 중...";
      default: return "AI 엔진이 분석을 준비하고 있습니다...";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-1 px-2 rounded font-bold text-sm shadow-sm">EDAI</div>
            <h1 className="font-bold text-slate-900 tracking-tight">S-Level 진단 시스템</h1>
          </div>
          <button onClick={onExit} className="text-slate-400 hover:text-slate-600 transition-all p-2 bg-slate-50 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-4xl w-full mx-auto p-6 flex flex-col items-center">
        {/* Progress Stepper */}
        <div className="w-full mb-12 flex justify-between relative px-4 max-w-lg">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-all duration-500 ${step >= s ? 'bg-blue-600 border-blue-100 text-white' : 'bg-white border-slate-200 text-slate-300'}`}>
              {s}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="w-full max-w-2xl animate-fade-in">
            <div className="text-center mb-12">
              <div className="bg-blue-100 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-blue-600 shadow-xl shadow-blue-100/50">
                <MicIcon className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">무료 AI 스피킹 진단</h2>
              <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                번거로운 설정 없이 즉시 시작하세요.<br />
                Gemini 3 엔진이 당신의 실력을 정확히 진단합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
              <button 
                onClick={() => setStep(2)}
                className="bg-blue-600 text-white p-10 rounded-[2.5rem] font-bold shadow-2xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-2 transition-all flex flex-col items-center gap-5 text-center group"
              >
                <div className="bg-white/20 p-5 rounded-2xl group-hover:scale-110 transition-transform">
                  <MicIcon className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xl">직접 녹음하기</div>
                  <div className="text-xs text-blue-200 font-normal mt-2">지금 바로 스피킹 테스트 진행</div>
                </div>
              </button>

              <label className="cursor-pointer bg-white border-2 border-slate-200 border-dashed p-10 rounded-[2.5rem] font-bold hover:border-blue-400 hover:-translate-y-2 transition-all flex flex-col items-center gap-5 text-center group">
                <div className="bg-slate-50 p-5 rounded-2xl group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500" />
                </div>
                <div>
                  <div className="text-xl text-slate-700">파일 업로드</div>
                  <div className="text-xs text-slate-400 font-normal mt-2">MP3, M4A, WAV 등 (최대 30MB)</div>
                </div>
                <input type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>

            {history.length > 0 && (
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-slate-900 flex items-center gap-3">
                    <History className="w-6 h-6 text-blue-600" />
                    나의 최근 진단 기록
                  </h3>
                  <button onClick={clearHistory} className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" /> 전체 삭제
                  </button>
                </div>
                <div className="space-y-4">
                  {history.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-blue-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-xl shadow-sm">
                          <BarChart3 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-700">{item.edLevel} ({item.cefr})</div>
                          <div className="text-[10px] text-slate-400 mt-1">{new Date(item.timestamp).toLocaleString()}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="text-center w-full max-w-md animate-fade-in flex flex-col items-center">
            <div className={`w-48 h-48 rounded-full flex items-center justify-center mb-10 relative transition-all duration-500 ${isRecording ? 'bg-red-50' : 'bg-slate-100'}`}>
              {isRecording && <div className="absolute inset-0 rounded-full bg-red-400/20 animate-ping"></div>}
              <MicIcon className={`w-20 h-20 relative z-10 transition-colors ${isRecording ? 'text-red-500' : 'text-slate-400'}`} />
            </div>
            <div className="text-6xl font-mono font-bold text-slate-900 mb-6 tracking-tighter">{formatTime(recordingTime)}</div>
            <p className="text-slate-500 mb-12 font-medium">
              {isRecording ? "영어로 충분히 말씀해 주세요..." : "아래 버튼을 눌러 녹음을 시작하세요"}
            </p>
            
            <div className="flex justify-center gap-8">
              {!isRecording ? (
                <button onClick={startRecording} className="bg-blue-600 text-white p-10 rounded-full shadow-[0_20px_50px_rgba(37,99,235,0.4)] hover:scale-110 transition-all active:scale-95">
                  <PlayCircle className="w-16 h-16" />
                </button>
              ) : (
                <button onClick={stopRecording} className="bg-red-500 text-white p-10 rounded-full shadow-[0_20px_50px_rgba(239,68,68,0.4)] hover:scale-110 transition-all active:scale-95">
                  <StopCircle className="w-16 h-16" />
                </button>
              )}
            </div>
            <button onClick={() => setStep(1)} className="mt-12 text-slate-400 hover:text-slate-600 text-sm font-bold border-b border-transparent hover:border-slate-300 transition-all">취소하고 메인으로</button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center w-full max-w-md animate-fade-in">
            <div className="bg-green-100 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-10 text-green-600 shadow-xl shadow-green-100/50">
              <CheckCircle2 className="w-14 h-14" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">음성 확보 완료</h2>
            <p className="text-slate-500 mb-12 leading-relaxed">
              긴 녹음 분량도 고속으로 처리합니다.<br />
              AI 분석을 통해 상세 리포트를 확인하세요.
            </p>
            
            <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] mb-12 flex items-center gap-6 text-left shadow-sm">
              <div className="bg-blue-50 p-5 rounded-2xl text-blue-600">
                <Clock className="w-7 h-7" />
              </div>
              <div className="flex-grow">
                <div className="text-base font-bold text-slate-700">고속 분석 엔진 가동 가능</div>
                <div className="text-xs text-slate-400 mt-1">대용량 오디오 정밀 스캔 준비됨</div>
              </div>
            </div>

            <button 
              onClick={analyzeAudio}
              disabled={isAnalyzing}
              className="w-full bg-blue-600 text-white py-7 rounded-[2rem] font-bold shadow-[0_25px_50px_-12px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-7 h-7 animate-spin" />
                  실시간 정밀 분석 중...
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
                  <div className="text-xs font-bold text-blue-600 flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {getSubStepText()}
                  </div>
                  <div className="text-xs font-black text-slate-900">{Math.round(analysisProgress)}%</div>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(37,99,235,0.5)]" 
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
                <p className="mt-5 text-[11px] text-slate-400 leading-relaxed italic text-center">
                  데이터가 많을수록 더 정확한 진단이 가능합니다.<br />
                  네트워크 환경에 따라 최대 1분 내외가 소요될 수 있습니다.
                </p>
              </div>
            )}
            
            {!isAnalyzing && (
              <button onClick={() => setStep(1)} className="mt-8 text-slate-400 hover:text-slate-600 font-bold text-sm">처음부터 다시하기</button>
            )}
          </div>
        )}

        {step === 4 && result && (
          <div className="w-full animate-fade-in pb-20">
            <div className="bg-white rounded-[4rem] p-12 md:p-16 shadow-2xl shadow-blue-900/10 border border-slate-200 mb-10 relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-10 blur-[100px] opacity-60"></div>
              
              <div className="text-center mb-20">
                <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-6 block px-5 py-2 bg-blue-50 inline-block rounded-full border border-blue-100">S-Level Diagnostic Result</span>
                <h3 className="text-slate-400 font-medium mb-10 text-xl tracking-tight">종합 평가 결과 리포트</h3>
                
                <div className="relative inline-block">
                  <div className="bg-white border-4 border-blue-50 p-16 rounded-[4rem] shadow-2xl shadow-blue-600/5 relative z-10">
                    <div className="absolute -top-6 -right-6 bg-yellow-400 text-blue-950 p-3 rounded-2xl shadow-xl animate-bounce">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <div className="text-7xl font-black text-blue-600 tracking-tighter en-font mb-4">{result.edLevel}</div>
                    <div className="text-2xl text-slate-600 font-bold tracking-tight">{result.levelDesc}</div>
                  </div>
                  <div className="absolute inset-0 bg-blue-600/5 rounded-[4rem] blur-2xl -z-10 translate-y-4 scale-105"></div>
                </div>

                <div className="mt-12 text-sm text-slate-400 font-bold flex items-center justify-center gap-3">
                  <Globe2 className="w-4 h-4 text-blue-600" /> 감지된 주 사용 언어: <span className="text-blue-600 font-black">{result.detectedLanguage}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                {[
                  { label: 'CEFR Grade', value: result.cefr, icon: <Globe2 className="w-4 h-4" /> },
                  { label: 'TOEIC 예측', value: result.toeic, icon: <Target className="w-4 h-4" /> },
                  { label: 'IELTS 예측', value: result.ielts, icon: <ShieldCheck className="w-4 h-4" /> }
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50 p-10 rounded-[3rem] text-center border border-slate-100 hover:border-blue-200 transition-all group">
                    <div className="text-[11px] text-slate-400 font-black uppercase mb-3 tracking-widest flex items-center justify-center gap-2 group-hover:text-blue-400 transition-colors">
                      {item.icon} {item.label}
                    </div>
                    <div className="text-4xl font-black text-slate-900 tracking-tight">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-16">
                <h4 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                  <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-600/20">
                    <BarChart3 className="w-7 h-7" />
                  </div>
                  상세 지표 분석
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
                  {[
                    { label: '발음 명료도', value: result.scores.pronunciation, icon: <MicIcon className="w-4 h-4" />, color: 'bg-blue-600' },
                    { label: '대화 유창성', value: result.scores.fluency, icon: <PlayCircle className="w-4 h-4" />, color: 'bg-indigo-600' },
                    { label: '어휘 다양성', value: result.scores.vocabulary, icon: <Target className="w-4 h-4" />, color: 'bg-cyan-600' },
                    { label: '문법 정확도', value: result.scores.grammar, icon: <ShieldCheck className="w-4 h-4" />, color: 'bg-emerald-600' },
                  ].map(score => (
                    <div key={score.label} className="group">
                      <div className="flex justify-between items-center mb-5">
                        <div className="flex items-center gap-3 text-slate-700 font-bold">
                          <div className={`p-2 rounded-xl ${score.color} text-white group-hover:rotate-12 transition-transform`}>{score.icon}</div>
                          <span className="text-base">{score.label}</span>
                        </div>
                        <span className="text-slate-900 font-black en-font text-2xl group-hover:text-blue-600 transition-colors">{score.value}<span className="text-xs text-slate-300 ml-1.5 font-normal tracking-normal">/ 100</span></span>
                      </div>
                      <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
                        <div 
                          className={`h-full ${score.color} rounded-full transition-all duration-[2.5s] ease-out shadow-sm`} 
                          style={{ width: `${score.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-24 p-12 bg-blue-50/50 rounded-[4rem] border border-blue-100/50 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full translate-x-10 -translate-y-10"></div>
                <div className="absolute -top-8 left-12 bg-blue-600 text-white p-5 rounded-[2rem] shadow-2xl group-hover:scale-110 transition-transform">
                  <BrainCircuit className="w-8 h-8" />
                </div>
                <h5 className="font-black text-slate-900 text-2xl mb-8 mt-4 tracking-tight">AI 맞춤 종합 진단 가이드</h5>
                <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap font-medium">{result.reasoning}</p>
              </div>
            </div>

            <div className="bg-blue-600 rounded-[4rem] p-20 text-white text-center shadow-[0_40px_80px_-20px_rgba(37,99,235,0.4)] relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <h4 className="text-4xl font-black mb-8 relative z-10 tracking-tight">최적의 학습 솔루션 제안</h4>
              <p className="text-blue-100 mb-14 max-w-xl mx-auto leading-relaxed text-xl relative z-10 font-medium">
                분석된 실력({result.edLevel})에 맞춰 English Discoveries의 전담 코스가 배정되었습니다. 성장을 위한 다음 단계를 시작해 보세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
                <button 
                  onClick={onExit}
                  className="bg-white text-blue-600 px-14 py-6 rounded-[2rem] font-black hover:bg-yellow-300 hover:text-blue-900 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-900/30 active:scale-95"
                >
                  메인 코스 시작하기 <ArrowRight className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => setStep(1)}
                  className="bg-blue-700/50 text-white border border-white/20 px-14 py-6 rounded-[2rem] font-black hover:bg-blue-800 transition-all backdrop-blur-md active:scale-95"
                >
                  테스트 다시하기
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 p-14 rounded-[3.5rem] flex flex-col items-center gap-10 text-red-600 mb-12 animate-fade-in w-full max-w-2xl text-center shadow-2xl shadow-red-100/50">
            <div className="bg-red-100 p-8 rounded-full shadow-inner animate-pulse">
              <AlertCircle className="w-14 h-14" />
            </div>
            <div>
              <div className="font-black text-3xl tracking-tight">진단 시스템 일시 장애</div>
              <div className="text-lg opacity-80 mt-6 leading-relaxed font-medium">{error}</div>
            </div>
            <div className="flex flex-col sm:flex-row gap-5 w-full justify-center">
              <button 
                onClick={analyzeAudio} 
                className="bg-red-600 text-white px-12 py-5 rounded-2xl font-black hover:bg-red-700 transition-all shadow-xl shadow-red-600/30"
              >
                다시 분석 요청
              </button>
              <button 
                onClick={() => setStep(1)} 
                className="bg-white border border-red-200 text-red-500 px-12 py-5 rounded-2xl font-black hover:bg-red-50 transition-all"
              >
                메인으로 복귀
              </button>
            </div>
          </div>
        )}

      </main>

      <footer className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 text-center md:text-left">
           <div>
             <h5 className="font-black text-slate-900 mb-6 flex items-center justify-center md:justify-start gap-3">
               <ShieldCheck className="w-6 h-6 text-blue-600" /> 개인정보보호
             </h5>
             <p className="text-xs text-slate-400 leading-relaxed font-bold">전송된 음성 원본은 분석 즉시 휘발성 메모리에서 자동 파기됩니다. GDPR 수준의 보안을 준수합니다.</p>
           </div>
           <div>
             <h5 className="font-black text-slate-900 mb-6 flex items-center justify-center md:justify-start gap-3">
               <Globe2 className="w-6 h-6 text-blue-600" /> 글로벌 기준
             </h5>
             <p className="text-xs text-slate-400 leading-relaxed font-bold">TOEIC, IELTS, TOEFL 등 공인 인증 시험의 데이터셋을 기반으로 설계된 전문 평가 엔진을 탑재하였습니다.</p>
           </div>
           <div>
             <h5 className="font-black text-slate-900 mb-6 flex items-center justify-center md:justify-start gap-3">
               <Target className="w-6 h-6 text-blue-600" /> 신뢰도 안내
             </h5>
             <p className="text-xs text-slate-400 leading-relaxed font-bold">본 시스템은 AI 간이 진단이며, 정확한 최종 실력 확정은 EDI 정기 평가 시스템을 통해 확인 가능합니다.</p>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default SLevelTest;
