'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';

interface AnalysisResult {
  candidateName: string | null;
  score: number;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      setError('Por favor, envie apenas arquivos em formato PDF.');
      setFile(null);
      return;
    }
    // Limite de 5MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('O tamanho do arquivo excede o limite de 5MB.');
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const analyzeResume = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro inesperado ao analisar currículo.');
      }

      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro ao conectar com o servidor. Verifique se configurou o .env corretamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Função para retornar a cor do score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-indigo-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreBgCircle = (score: number) => {
    if (score >= 80) return 'stroke-emerald-500';
    if (score >= 60) return 'stroke-indigo-500';
    if (score >= 40) return 'stroke-amber-500';
    return 'stroke-rose-500';
  };

  return (
    <div className="flex-1 flex flex-col justify-between py-10 px-4 md:px-10 max-w-6xl mx-auto w-full">
      {/* Header */}
      <header className="flex flex-col items-center mb-10 text-center">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 text-white font-bold text-xl">
            AI
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-200 to-white">
            Resume Analyzer
          </h1>
        </div>
        <p className="text-slate-400 text-sm md:text-base max-w-md">
          Otimize seu currículo gratuitamente em segundos com o poder da Inteligência Artificial do Gemini.
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center">
        {!result && !isAnalyzing ? (
          /* Upload Section */
          <div className="w-full max-w-2xl flex flex-col gap-6">
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
              className={`glass-card rounded-2xl p-10 md:p-16 border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                dragActive
                  ? 'border-violet-500 bg-violet-600/10 shadow-lg shadow-violet-500/25 scale-[1.01]'
                  : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/10'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
              
              <div className="w-16 h-16 rounded-full bg-slate-800/60 flex items-center justify-center mb-6 text-violet-400 border border-slate-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 animate-bounce"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-slate-200 mb-2">
                {file ? file.name : 'Arraste seu currículo PDF aqui'}
              </h3>
              
              <p className="text-slate-500 text-xs md:text-sm max-w-sm mb-6">
                {file
                  ? `${(file.size / 1024 / 1024).toFixed(2)} MB • PDF Pronto para analisar`
                  : 'Ou clique para selecionar o arquivo no seu computador (máximo 5MB)'}
              </p>

              {file && (
                <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={removeFile}
                    className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-colors"
                  >
                    Remover
                  </button>
                  <button
                    onClick={analyzeResume}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-500/20 hover:shadow-violet-500/35 transition-all"
                  >
                    Analisar Currículo
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex gap-3 text-rose-300 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 flex-shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>
        ) : isAnalyzing ? (
          /* Loading State */
          <div className="w-full max-w-md flex flex-col items-center text-center p-8">
            <div className="w-24 h-24 rounded-3xl bg-slate-900 border-2 border-violet-500 flex items-center justify-center glow-active mb-8">
              <svg
                className="animate-spin h-10 w-10 text-violet-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Analisando seu currículo...</h3>
            <p className="text-slate-400 text-sm max-w-xs animate-pulse">
              A inteligência artificial está extraindo o texto e estruturando o seu feedback. Isso leva cerca de 5 a 10 segundos.
            </p>
          </div>
        ) : (
          /* Result Section */
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            {/* Score Card */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl"></div>

                <h3 className="text-slate-400 font-medium text-sm mb-4">Nota do Currículo</h3>
                
                {/* Circular Score */}
                <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    {/* Background track */}
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      className="fill-none stroke-slate-800"
                      strokeWidth="8"
                    />
                    {/* Active progress */}
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      className={`fill-none ${getScoreBgCircle(result!.score)} transition-all duration-1000 ease-out`}
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 50}
                      strokeDashoffset={2 * Math.PI * 50 * (1 - result!.score / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className={`text-4xl md:text-5xl font-black ${getScoreColor(result!.score)}`}>
                      {result!.score}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">de 100</span>
                  </div>
                </div>

                {result!.candidateName && (
                  <div className="mb-4">
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-widest block mb-1">Candidato</span>
                    <h4 className="text-lg font-bold text-slate-200">{result!.candidateName}</h4>
                  </div>
                )}

                <div className="w-full border-t border-slate-800/80 pt-4 mt-2 flex flex-col gap-3">
                  <button
                    onClick={removeFile}
                    className="w-full py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Analisar Outro
                  </button>
                </div>
              </div>

              {/* Tips Card */}
              <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-violet-900/10 to-indigo-900/10 border border-violet-500/10">
                <h4 className="text-slate-300 font-bold text-sm mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-violet-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096L3 15.187m6 0.813L15 15.187m-6 0.813l.813-5.096M21 9.813L15.904 9m0 0L15 3m0 0l-.813 5.096M21 9.813L15.904 9.813m0 0L21 9.813" />
                  </svg>
                  Como usar esse feedback?
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Utilize os pontos de melhoria e as sugestões práticas fornecidas ao lado para ajustar a redação e estrutura do seu currículo. Em seguida, reenvie-o aqui para recalcular sua nota!
                </p>
              </div>
            </div>

            {/* Detailed Feedback Cards */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Strengths */}
              <div className="glass-card rounded-2xl p-6">
                <h4 className="text-emerald-400 font-bold text-base mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                    ✓
                  </span>
                  Pontos Fortes
                </h4>
                <ul className="space-y-3">
                  {result!.strengths.map((strength, index) => (
                    <li key={index} className="flex gap-3 text-slate-300 text-sm leading-relaxed items-start">
                      <span className="text-emerald-400 mt-1 flex-shrink-0">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="glass-card rounded-2xl p-6">
                <h4 className="text-rose-400 font-bold text-base mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20">
                    !
                  </span>
                  Pontos a Melhorar
                </h4>
                <ul className="space-y-3">
                  {result!.improvements.map((improvement, index) => (
                    <li key={index} className="flex gap-3 text-slate-300 text-sm leading-relaxed items-start">
                      <span className="text-rose-400 mt-1 flex-shrink-0">•</span>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestions */}
              <div className="glass-card rounded-2xl p-6">
                <h4 className="text-violet-400 font-bold text-base mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20">
                    💡
                  </span>
                  Sugestões de Otimização
                </h4>
                <ul className="space-y-3">
                  {result!.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex gap-3 text-slate-300 text-sm leading-relaxed items-start">
                      <span className="text-violet-400 mt-1 flex-shrink-0">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 text-center text-slate-600 text-xs border-t border-slate-900/60 pt-6">
        <p>&copy; {new Date().getFullYear()} AI Resume Analyzer • Desenvolvido passo a passo com economia e inteligência.</p>
      </footer>
    </div>
  );
}
