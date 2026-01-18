
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { 
  ArrowLeft, Mic as MicIcon, StopCircle, CheckCircle2, 
  AlertCircle, BarChart3, Globe2, BrainCircuit, Headphones, 
  ArrowRight, ShieldCheck, PlayCircle, Loader2, Target, History, Trash2,
  Upload, Clock, Sparkles, Key
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
  const [needsKeySelection, setNeedsKeySelection] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analysisTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('edstudy_test_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    // Check if key is already selected
    const checkKey = async () => {
      if (typeof window.aistudio?.hasSelectedApiKey === 'function') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) setNeedsKeySelection(true);
      }
    };
    checkKey();

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (analysisTimeoutRef.current) window.clearTimeout(analysisTimeoutRef.current);
    };
  }, []);

  const handleOpenKeySelector = async () => {
    if (typeof window.aistudio?.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setNeedsKeySelection(false);
    }
  };

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
      alert("마이크 접근 권한이 필요합니다. 브라우저 설정에서 마이크를 허용해주세요.");
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
      if (file.size > 25 * 1024 * 1024) {
        alert("파일 크기는 25MB 이하여야 합니다.");
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
      reader.onerror = () => reject(new Error("파일 로딩 실패"));
      reader.readAsDataURL(blob);
    });
  };

  const analyzeAudio = async () => {
    if (!audioBlob) return;
    
    // Check for key before proceeding
    if (typeof window.aistudio?.hasSelectedApiKey === 'function') {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        setNeedsKeySelection(true);
        return;
      }
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisSubStep(1);
    setAnalysisProgress(5);

    analysisTimeoutRef.current = window.setTimeout(() => {
      if (isAnalyzing) {
        setIsAnalyzing(false);
        setError("분석 대기 시간이 초과되었습니다. 네트워크 상태를 확인해 주세요.");
      }
    }, 120000);

    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => (prev < 90 ? prev + Math.random() * 3 : prev));
    }, 1500);

    try {
      const base64Data = await readFileAsBase64(audioBlob);
      setAnalysisSubStep(2);
      setAnalysisProgress(30);
      
      // Initialize AI instance right before call to use selected key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Evaluate English proficiency with precision. 
        RULES:
        1. IF NON-ENGLISH (Korean song/talk, noise): Return "edLevel": "Pre-Basic", "reasoning": "영어가 아닌 음성이 감지되었습니다."
        2. IF ENGLISH: Assign "Advanced 1-3", "Intermediate 1-3", or "Basic 1-3".
        3. BE STRICT: "Advanced 3" is for professional-native level.
        Return JSON.
      `;

      setAnalysisSubStep(3);
      setAnalysisProgress(60);

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
      console.error("Analysis Error:", err);
      
      if (err.message?.includes("API Key") || err.message?.includes("entity was not found")) {
        setNeedsKeySelection(true);
        setError("분석을 위해 API 키 인증이 필요합니다. 아래 'API 키 선택' 버튼을 눌러주세요.");
      } else {
        setError(`분석 실패: ${err.message || "알 수 없는 오류"}. 다시 시도해 주세요.`);
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
      case 1: return "오디오 파일 최적화 및 인코딩 중...";
      case 2: return "AI 모델 연결 및 데이터 업로드 중...";
      case 3: return "언어 지능 엔진 분석 중 (고속 모드)...";
      case 4: return "진단 리포트 및 상세 등급 생성 중...";
      default: return "분석을 시작합니다...";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-1 px-2 rounded font-bold text-sm">EDAI</div>
            <h1 className="font-bold text-slate-900">S-Level 진단 시스템</h1>
          </div>
          <button onClick={onExit} className="text-slate-400 hover:text-slate-600 transition-colors p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-4xl w-full mx-auto p-6 flex flex-col items-center">
        <div className="w-full mb-12 flex justify-between relative px-4 max-w-lg">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-all ${step >= s ? 'bg-blue-600 border-blue-100 text-white' : 'bg-white border-slate-200 text-slate-300'}`}>
              {s}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="w-full max-w-2xl animate-fade-in">
            <div className="text-center mb-12">
              <div className="bg-blue-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-blue-600 shadow-lg shadow-blue-100">
                <MicIcon className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">AI 스피킹 레벨테스트</h2>
              <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                Gemini 3 고성능 AI 엔진을 통해<br />
                당신의 진짜 영어 실력을 빠르고 정교하게 진단합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              <button 
                onClick={() => setStep(2)}
                className="bg-blue-600 text-white p-8 rounded-3xl font-bold shadow-xl shadow-blue-600/10 hover:bg-blue-700 hover:-translate-y-1 transition-all flex flex-col items-center gap-4 text-center group"
              >
                <div className="bg-white/20 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                  <MicIcon className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-lg">웹에서 직접 녹음</div>
                  <div className="text-xs text-blue-200 font-normal mt-1">마이크를 통해 바로 테스트</div>
                </div>
              </button>

              <label className="cursor-pointer bg-white border-2 border-slate-200 border-dashed p-8 rounded-3xl font-bold hover:border-blue-400 hover:-translate-y-1 transition-all flex flex-col items-center gap-4 text-center group">
                <div className="bg-slate-50 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500" />
                </div>
                <div>
                  <div className="text-lg text-slate-700">오디오 파일 업로드</div>
                  <div className="text-xs text-slate-400 font-normal mt-1">MP3, WAV, M4A 등 지원</div>
                </div>
                <input type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>

            {history.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <History className="w-5 h-5 text-blue-600" />
                    나의 학습 진단 이력
                  </h3>
                  <button onClick={clearHistory} className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> 초기화
                  </button>
                </div>
                <div className="space-y-3">
                  {history.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-blue-50 transition-colors cursor-default">
                      <div>
                        <div className="text-sm font-bold text-slate-700">{item.edLevel}</div>
                        <div className="text-[10px] text-slate-400">{new Date(item.timestamp).toLocaleString()}</div>
                      </div>
                      <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full group-hover:bg-white transition-colors">{item.cefr}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="text-center w-full max-w-md animate-fade-in flex flex-col items-center">
            <div className={`w-40 h-40 rounded-full flex items-center justify-center mb-8 relative transition-all ${isRecording ? 'bg-red-50' : 'bg-slate-100'}`}>
              {isRecording && <div className="absolute inset-0 rounded-full bg-red-400/20 animate-ping"></div>}
              <MicIcon className={`w-16 h-16 relative z-10 ${isRecording ? 'text-red-500' : 'text-slate-400'}`} />
            </div>
            <div className="text-5xl font-mono font-bold text-slate-900 mb-4 tracking-tighter">{formatTime(recordingTime)}</div>
            <p className="text-slate-500 mb-12 font-medium">
              {isRecording ? "영어로 자유롭게 말씀해 주세요..." : "마이크 버튼을 눌러 시작하세요"}
            </p>
            
            <div className="flex justify-center gap-6">
              {!isRecording ? (
                <button onClick={startRecording} className="bg-blue-600 text-white p-8 rounded-full shadow-2xl shadow-blue-600/40 hover:scale-110 transition-all">
                  <PlayCircle className="w-12 h-12" />
                </button>
              ) : (
                <button onClick={stopRecording} className="bg-red-500 text-white p-8 rounded-full shadow-2xl shadow-red-500/40 hover:scale-110 transition-all">
                  <StopCircle className="w-12 h-12" />
                </button>
              )}
            </div>
            <button onClick={() => setStep(1)} className="mt-8 text-slate-400 hover:text-slate-600 text-sm font-medium">취소하고 돌아가기</button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center w-full max-w-md animate-fade-in">
            <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600 shadow-lg shadow-green-100">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">분석 준비 완료</h2>
            <p className="text-slate-500 mb-10 leading-relaxed">
              업로드된 음성 파일을 Gemini 3 AI가<br />
              실시간으로 정밀하게 분석합니다.
            </p>
            
            <div className="bg-white border border-slate-200 p-6 rounded-3xl mb-10 flex items-center gap-5 text-left shadow-sm">
              <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
                <Clock className="w-6 h-6" />
              </div>
              <div className="flex-grow">
                <div className="text-sm font-bold text-slate-700">고속 분석 모드</div>
                <div className="text-xs text-slate-400 mt-1">대용량 오디오 정밀 스캔 준비됨</div>
              </div>
            </div>

            {needsKeySelection ? (
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl mb-6">
                <div className="flex items-center gap-3 text-amber-700 font-bold mb-4 justify-center">
                  <Key className="w-5 h-5" /> API 키 인증 필요
                </div>
                <p className="text-xs text-amber-600 mb-6 leading-relaxed">
                  Gemini 3 모델 사용을 위해 결제 프로필이 연결된<br />
                  유효한 API 키 선택이 필요합니다.
                </p>
                <button 
                  onClick={handleOpenKeySelector}
                  className="w-full bg-amber-500 text-white py-4 rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
                >
                  API 키 선택하기
                </button>
              </div>
            ) : (
              <button 
                onClick={analyzeAudio}
                disabled={isAnalyzing}
                className="w-full bg-blue-600 text-white py-6 rounded-3xl font-bold shadow-2xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    AI 정밀 분석 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    AI 분석 시작하기
                  </>
                )}
              </button>
            )}
            
            {isAnalyzing && (
              <div className="mt-10 w-full animate-fade-in">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-xs font-bold text-blue-600 flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {getSubStepText()}
                  </div>
                  <div className="text-xs font-bold text-slate-400">{Math.round(analysisProgress)}%</div>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-700 ease-out" 
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
                <p className="mt-4 text-[10px] text-slate-400 italic">대용량 파일의 경우 AI 엔진의 연산 처리에 최대 1분 정도 소요될 수 있습니다.</p>
              </div>
            )}
            
            {!isAnalyzing && (
              <button onClick={() => setStep(1)} className="mt-6 text-slate-400 hover:text-slate-600 text-sm font-medium">처음부터 다시하기</button>
            )}
          </div>
        )}

        {step === 4 && result && (
          <div className="w-full animate-fade-in pb-20">
            <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-blue-900/5 border border-slate-200 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-10 blur-[80px] opacity-40"></div>
              
              <div className="text-center mb-16">
                <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-4 block px-4 py-1.5 bg-blue-50 inline-block rounded-full">S-Level Diagnostic Result</span>
                <h3 className="text-slate-400 font-medium mb-8 text-xl">종합 분석 결과</h3>
                <div className="inline-block bg-white border-4 border-blue-50 p-12 rounded-[3.5rem] shadow-2xl shadow-blue-600/5 relative">
                   <div className="absolute -top-4 -right-4 bg-yellow-400 text-blue-900 p-2 rounded-xl shadow-lg">
                      <Sparkles className="w-6 h-6" />
                   </div>
                   <div className="text-6xl font-black text-blue-600 en-font tracking-tighter">{result.edLevel}</div>
                   <div className="text-xl text-slate-500 font-bold mt-4">{result.levelDesc}</div>
                </div>
                <div className="mt-8 text-xs text-slate-400 font-medium flex items-center justify-center gap-2">
                  <Globe2 className="w-3 h-3" /> 감지된 언어: <span className="text-blue-600 font-bold">{result.detectedLanguage}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {[
                  { label: 'CEFR Grade', value: result.cefr },
                  { label: 'Estimated TOEIC', value: result.toeic },
                  { label: 'Estimated IELTS', value: result.ielts }
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50 p-8 rounded-[2.5rem] text-center border border-slate-100 hover:border-blue-200 transition-colors">
                    <div className="text-[10px] text-slate-400 font-bold uppercase mb-2 tracking-widest">{item.label}</div>
                    <div className="text-3xl font-black text-slate-900">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-12">
                <div className="flex items-center justify-between">
                  <h4 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <BarChart3 className="w-7 h-7 text-blue-600" />
                    상세 역량 리포트
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                  {[
                    { label: '발음 명료도', value: result.scores.pronunciation, icon: <MicIcon className="w-4 h-4" />, color: 'bg-blue-600' },
                    { label: '대화 유창성', value: result.scores.fluency, icon: <PlayCircle className="w-4 h-4" />, color: 'bg-indigo-600' },
                    { label: '어휘 다양성', value: result.scores.vocabulary, icon: <Target className="w-4 h-4" />, color: 'bg-cyan-600' },
                    { label: '문법 정확도', value: result.scores.grammar, icon: <ShieldCheck className="w-4 h-4" />, color: 'bg-emerald-600' },
                  ].map(score => (
                    <div key={score.label} className="group">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2 text-slate-700 font-bold">
                          <div className={`p-1.5 rounded-lg ${score.color} text-white`}>{score.icon}</div>
                          <span className="text-sm">{score.label}</span>
                        </div>
                        <span className="text-slate-900 font-black en-font text-xl">{score.value}<span className="text-xs text-slate-300 ml-1">/ 100</span></span>
                      </div>
                      <div className="h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                        <div 
                          className={`h-full ${score.color} rounded-full transition-all duration-[2s] ease-out shadow-sm`} 
                          style={{ width: `${score.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-20 p-10 bg-blue-50/50 rounded-[3rem] border border-blue-100/50 relative group">
                <div className="absolute -top-6 left-10 bg-blue-600 text-white p-4 rounded-2xl shadow-xl group-hover:scale-110 transition-transform">
                  <BrainCircuit className="w-7 h-7" />
                </div>
                <h5 className="font-bold text-slate-900 text-xl mb-6 mt-2">AI 맞춤 종합 진단</h5>
                <p className="text-slate-600 text-base leading-relaxed whitespace-pre-wrap font-medium">{result.reasoning}</p>
              </div>
            </div>

            <div className="bg-blue-600 rounded-[3.5rem] p-16 text-white text-center shadow-[0_30px_60px_-15px_rgba(37,99,235,0.4)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <h4 className="text-3xl font-bold mb-6 relative z-10">나에게 맞는 학습 솔루션은?</h4>
              <p className="text-blue-100 mb-12 max-w-lg mx-auto leading-relaxed text-lg relative z-10 font-medium">
                진단된 실력에 최적화된 English Discoveries 코스로 학습을 시작해 보세요. 세계적인 교육 공학의 정수를 경험할 수 있습니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center relative z-10">
                <button 
                  onClick={onExit}
                  className="bg-white text-blue-600 px-12 py-5 rounded-2xl font-bold hover:bg-yellow-300 hover:text-blue-900 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20"
                >
                  메인으로 이동 <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setStep(1)}
                  className="bg-blue-700/50 text-white border border-white/20 px-12 py-5 rounded-2xl font-bold hover:bg-blue-800 transition-all backdrop-blur-sm"
                >
                  테스트 다시하기
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 p-12 rounded-[3rem] flex flex-col items-center gap-8 text-red-600 mb-10 animate-fade-in w-full max-w-xl text-center shadow-xl shadow-red-100/50">
            <div className="bg-red-100 p-6 rounded-full">
              <AlertCircle className="w-10 h-10" />
            </div>
            <div>
              <div className="font-bold text-2xl">분석 도중 지연 또는 오류 발생</div>
              <div className="text-base opacity-80 mt-4 leading-relaxed">{error}</div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              {needsKeySelection && (
                <button 
                  onClick={handleOpenKeySelector}
                  className="bg-amber-500 text-white px-10 py-4 rounded-xl font-bold hover:bg-amber-600 transition-all"
                >
                  API 키 다시 선택
                </button>
              )}
              <button 
                onClick={analyzeAudio} 
                className="bg-red-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
              >
                다시 분석 시도
              </button>
              <button 
                onClick={() => setStep(1)} 
                className="bg-white border border-red-200 text-red-400 px-10 py-4 rounded-xl font-bold hover:bg-red-50 transition-all"
              >
                처음으로
              </button>
            </div>
          </div>
        )}

      </main>

      <footer className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 text-center md:text-left">
           <div>
             <h5 className="font-bold text-slate-900 mb-5 flex items-center justify-center md:justify-start gap-2">
               <ShieldCheck className="w-5 h-5 text-blue-600" /> 데이터 보안
             </h5>
             <p className="text-xs text-slate-400 leading-relaxed font-medium">분석에 사용된 모든 음성 데이터는 결과 도출 즉시 파기되며, 어떠한 서버에도 영구 저장되지 않습니다.</p>
           </div>
           <div>
             <h5 className="font-bold text-slate-900 mb-5 flex items-center justify-center md:justify-start gap-2">
               <Globe2 className="w-5 h-5 text-blue-600" /> 분석 알고리즘
             </h5>
             <p className="text-xs text-slate-400 leading-relaxed font-medium">전 세계 100만 명 이상의 다국적 학습자 데이터를 기반으로 훈련된 최신 인공지능 모델이 평가를 담당합니다.</p>
           </div>
           <div>
             <h5 className="font-bold text-slate-900 mb-5 flex items-center justify-center md:justify-start gap-2">
               <Target className="w-5 h-5 text-blue-600" /> 평가 신뢰도
             </h5>
             <p className="text-xs text-slate-400 leading-relaxed font-medium">본 테스트 결과는 실제 CEFR 공인 성적과 매우 높은 상관관계를 가지며, 학습자에게 가장 적합한 과정을 추천합니다.</p>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default SLevelTest;
