
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { 
  ArrowLeft, Mic as MicIcon, StopCircle, CheckCircle2, 
  AlertCircle, BarChart3, Globe2, BrainCircuit, Headphones, 
  ArrowRight, ShieldCheck, PlayCircle, Loader2, Target, History, Trash2,
  Upload
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
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('edstudy_test_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
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
      setAudioBlob(e.target.files[0]);
      setStep(3);
    }
  };

  const analyzeAudio = async () => {
    if (!audioBlob) return;
    setIsAnalyzing(true);
    setError(null);
    setAnalysisSubStep(1);

    const subStepTimer = setInterval(() => {
      setAnalysisSubStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 2000);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
          Task: Act as a Strict CEFR English Proficiency Evaluator. 
          Analyze the provided audio and return a detailed JSON evaluation.

          CRITICAL EVALUATION RULES:
          1. LANGUAGE DETECTION: First, identify the language. 
             - If the audio contains NO English (e.g., Korean singing, speaking in Korean, humming, or just noise), you MUST set "edLevel" to "Pre-Basic", "cefr" to "N/A", and all scores to 0. 
             - DO NOT hallucinate English from non-English audio.
          2. PROFICIENCY GRADING (Be Strict):
             - "Advanced 3" (C1/C2): Only for native-like, professional speakers (e.g., news anchors, spokespersons). Perfect grammar, rich vocabulary, and impeccable prosody.
             - "Intermediate 3" (B2): For confident speakers with minor errors.
             - "Basic 1-3" (A1/A2): For learners struggling with sentences.
          3. SCORING (0-100): Be discriminative. If one aspect is good but another is bad, the scores must reflect that. Do not give a flat "70" for everything.
          4. ED LEVELS: Pre-Basic, Basic 1, Basic 2, Basic 3, Intermediate 1, Intermediate 2, Intermediate 3, Advanced 1, Advanced 2, Advanced 3.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
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
                detectedLanguage: { type: Type.STRING, description: "Language detected in the audio." },
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
                reasoning: { type: Type.STRING, description: "Detailed explanation of the grade in Korean." }
              },
              required: ["detectedLanguage", "edLevel", "levelDesc", "cefr", "toeic", "ielts", "scores", "reasoning"]
            }
          }
        });

        const data = JSON.parse(response.text);
        const finalResult = { ...data, timestamp: new Date().toISOString() };
        
        clearInterval(subStepTimer);
        setResult(finalResult);
        saveToHistory(finalResult);
        setStep(4);
        setIsAnalyzing(false);
      };
    } catch (err) {
      clearInterval(subStepTimer);
      console.error("Analysis failed", err);
      setError("오디오 분석 중 오류가 발생했습니다. 파일 형식을 확인하거나 다시 녹음해 주세요.");
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
      case 1: return "음성 데이터의 특징점을 추출하는 중...";
      case 2: return "언어 및 발화 내용을 식별하는 중...";
      case 3: return "CEFR 기준에 따라 문법 및 어휘력을 평가하는 중...";
      case 4: return "최종 레벨 및 리포트를 생성하는 중...";
      default: return "잠시만 기다려 주세요...";
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
              <div className="bg-blue-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-blue-600">
                <MicIcon className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">무료 레벨테스트</h2>
              <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                세계적인 AI 엔진 Gemini 3 Pro를 통해<br />
                당신의 진짜 영어 실력을 1분 만에 확인하세요.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              <button 
                onClick={() => setStep(2)}
                className="bg-blue-600 text-white p-8 rounded-3xl font-bold shadow-xl shadow-blue-600/10 hover:bg-blue-700 transition-all flex flex-col items-center gap-4 text-center group"
              >
                <div className="bg-white/20 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                  <MicIcon className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-lg">웹에서 직접 녹음</div>
                  <div className="text-xs text-blue-200 font-normal mt-1">마이크를 통해 바로 테스트</div>
                </div>
              </button>

              <label className="cursor-pointer bg-white border-2 border-slate-200 border-dashed p-8 rounded-3xl font-bold hover:border-blue-400 transition-all flex flex-col items-center gap-4 text-center group">
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
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div>
                        <div className="text-sm font-bold text-slate-700">{item.edLevel}</div>
                        <div className="text-[10px] text-slate-400">{new Date(item.timestamp).toLocaleString()}</div>
                      </div>
                      <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{item.cefr}</div>
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
            <div className="text-5xl font-mono font-bold text-slate-900 mb-4">{formatTime(recordingTime)}</div>
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
            <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">분석 준비 완료</h2>
            <p className="text-slate-500 mb-10 leading-relaxed">
              업로드된 음성 파일을 정밀 분석하여<br />
              CEFR 기반의 상세 리포트를 생성합니다.
            </p>
            
            <div className="bg-white border border-slate-200 p-6 rounded-3xl mb-10 flex items-center gap-5 text-left shadow-sm">
              <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
                <Headphones className="w-6 h-6" />
              </div>
              <div className="flex-grow">
                <div className="text-sm font-bold text-slate-700">Speaking Sample</div>
                <div className="text-xs text-slate-400 mt-1">Ready for AI Analysis</div>
              </div>
            </div>

            <button 
              onClick={analyzeAudio}
              disabled={isAnalyzing}
              className="w-full bg-blue-600 text-white py-6 rounded-3xl font-bold shadow-2xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  분석하는 중...
                </>
              ) : (
                <>
                  <BrainCircuit className="w-6 h-6" />
                  AI 분석 시작하기
                </>
              )}
            </button>
            
            {isAnalyzing && (
              <div className="mt-6 animate-pulse">
                <div className="text-sm font-bold text-blue-600">{getSubStepText()}</div>
                <div className="mt-2 text-xs text-slate-400">네트워크 환경에 따라 최대 30초가 소요될 수 있습니다.</div>
              </div>
            )}
            
            {!isAnalyzing && (
              <button onClick={() => setStep(1)} className="mt-6 text-slate-400 hover:text-slate-600 text-sm font-medium">처음부터 다시하기</button>
            )}
          </div>
        )}

        {step === 4 && result && (
          <div className="w-full animate-fade-in pb-20">
            <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-200 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-10 blur-3xl opacity-50"></div>
              
              <div className="text-center mb-16">
                <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-4 block px-4 py-1 bg-blue-50 inline-block rounded-full">S-Level Diagnostic Result</span>
                <h3 className="text-slate-400 font-medium mb-6 text-lg">분석된 당신의 레벨은</h3>
                <div className="inline-block bg-white border-4 border-blue-100 p-10 rounded-[2.5rem] shadow-xl shadow-blue-600/5">
                   <div className="text-5xl font-black text-blue-600 en-font">{result.edLevel}</div>
                   <div className="text-lg text-slate-500 font-bold mt-3">{result.levelDesc}</div>
                </div>
                <div className="mt-4 text-xs text-slate-400 font-medium flex items-center justify-center gap-2">
                  <Globe2 className="w-3 h-3" /> 감지된 언어: <span className="text-blue-600">{result.detectedLanguage}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <div className="bg-slate-50 p-8 rounded-[2rem] text-center border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase mb-2 tracking-widest">CEFR Grade</div>
                  <div className="text-3xl font-black text-slate-900">{result.cefr}</div>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2rem] text-center border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase mb-2 tracking-widest">Estimated TOEIC</div>
                  <div className="text-3xl font-black text-slate-900">{result.toeic}</div>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2rem] text-center border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase mb-2 tracking-widest">Estimated IELTS</div>
                  <div className="text-3xl font-black text-slate-900">{result.ielts}</div>
                </div>
              </div>

              <div className="space-y-10">
                <h4 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="bg-blue-600 p-2 rounded-lg text-white">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  세부 역량 분석
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  {[
                    { label: '발음 명료도', value: result.scores.pronunciation, icon: <MicIcon className="w-4 h-4" /> },
                    { label: '대화 유창성', value: result.scores.fluency, icon: <PlayCircle className="w-4 h-4" /> },
                    { label: '어휘 다양성', value: result.scores.vocabulary, icon: <Target className="w-4 h-4" /> },
                    { label: '문법 정확도', value: result.scores.grammar, icon: <ShieldCheck className="w-4 h-4" /> },
                  ].map(score => (
                    <div key={score.label}>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2 text-slate-600 font-bold">
                          {score.icon}
                          <span className="text-sm">{score.label}</span>
                        </div>
                        <span className="text-blue-600 font-black en-font text-lg">{score.value}<span className="text-[10px] text-slate-300 ml-1">/ 100</span></span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 transition-all duration-[1.5s] ease-out shadow-[0_0_10px_rgba(37,99,235,0.4)]" 
                          style={{ width: `${score.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-20 p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100/50 relative">
                <div className="absolute -top-6 left-8 bg-blue-600 text-white p-3 rounded-2xl shadow-lg">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h5 className="font-bold text-slate-900 text-lg mb-4 mt-2">AI 진단 총평</h5>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{result.reasoning}</p>
              </div>
            </div>

            <div className="bg-blue-600 rounded-[3rem] p-12 text-white text-center shadow-2xl shadow-blue-600/30">
              <h4 className="text-2xl font-bold mb-4">맞춤형 학습 솔루션 시작하기</h4>
              <p className="text-blue-100 mb-10 max-w-md mx-auto leading-relaxed">진단된 레벨에 가장 적합한 English Discoveries 코스가 배정되었습니다. 지금 바로 성장을 경험하세요.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={onExit}
                  className="bg-white text-blue-600 px-10 py-5 rounded-[1.5rem] font-bold hover:bg-yellow-300 hover:text-blue-900 transition-all flex items-center justify-center gap-2"
                >
                  메인으로 돌아가기 <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setStep(1)}
                  className="bg-blue-700/50 text-white border border-white/20 px-10 py-5 rounded-[1.5rem] font-bold hover:bg-blue-800 transition-all"
                >
                  테스트 다시하기
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 p-8 rounded-[2rem] flex flex-col items-center gap-6 text-red-600 mb-10 animate-fade-in w-full max-w-md text-center">
            <div className="bg-red-100 p-4 rounded-full">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <div className="font-bold text-lg">분석 과정에서 문제가 발생했습니다</div>
              <div className="text-sm opacity-80 mt-2">{error}</div>
            </div>
            <button 
              onClick={() => setStep(1)} 
              className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-all"
            >
              다시 시도하기
            </button>
          </div>
        )}

      </main>

      <footer className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
           <div>
             <h5 className="font-bold text-slate-900 mb-4 flex items-center justify-center md:justify-start gap-2">
               <ShieldCheck className="w-4 h-4 text-blue-600" /> 데이터 보안
             </h5>
             <p className="text-[11px] text-slate-400 leading-relaxed">모든 음성 데이터는 분석 직후 자동 파기됩니다. 개인정보보호법을 준수하며 안전하게 관리됩니다.</p>
           </div>
           <div>
             <h5 className="font-bold text-slate-900 mb-4 flex items-center justify-center md:justify-start gap-2">
               <Globe2 className="w-4 h-4 text-blue-600" /> 분석 기준
             </h5>
             <p className="text-[11px] text-slate-400 leading-relaxed">국제 공인 영어 능력 척도인 CEFR(Common European Framework) 기준을 엄격히 적용합니다.</p>
           </div>
           <div>
             <h5 className="font-bold text-slate-900 mb-4 flex items-center justify-center md:justify-start gap-2">
               <Target className="w-4 h-4 text-blue-600" /> 정확도 안내
             </h5>
             <p className="text-[11px] text-slate-400 leading-relaxed">본 테스트는 AI 기반 간이 진단이며, 최종 수강 레벨은 EDI 종합 테스트를 통해 확정될 수 있습니다.</p>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default SLevelTest;
