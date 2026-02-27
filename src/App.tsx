import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera } from './components/Camera';
import { AnalysisResultPanel } from './components/AnalysisResultPanel';
import { analyzeImage } from './lib/gemini';
import { AnalysisResult } from './types';
import { Scan, ShieldCheck, Loader2, History, Settings } from 'lucide-react';

export default function App() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = async (base64: string) => {
    setCapturedImage(base64);
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const analysis = await analyzeImage(base64);
      setResult(analysis);
    } catch (err) {
      setError("Analysis failed. Please try again.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 font-sans selection:bg-zinc-100 selection:text-black">
      {/* Header */}
      <header className="border-b border-zinc-900/50 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-black" />
            </div>
            <h1 className="font-bold tracking-tight text-lg">DefectLens AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-500 hover:text-zinc-100 transition-colors">
              <History className="w-5 h-5" />
            </button>
            <button className="p-2 text-zinc-500 hover:text-zinc-100 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Capture/Preview */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Visual Inspection</h2>
              <p className="text-zinc-500">Capture a high-resolution photo of the object to begin AI defect analysis.</p>
            </div>

            <div className="relative">
              <AnimatePresence mode="wait">
                {!capturedImage ? (
                  <motion.div
                    key="camera"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Camera onCapture={handleCapture} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-zinc-900"
                  >
                    <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
                    
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 text-white animate-spin" />
                        <div className="text-center">
                          <p className="font-bold text-white">Analyzing Surface</p>
                          <p className="text-zinc-400 text-sm">Gemini AI is processing pixels...</p>
                        </div>
                        {/* Scanning animation line */}
                        <motion.div 
                          className="absolute left-0 right-0 h-0.5 bg-zinc-100 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                          animate={{ top: ['0%', '100%', '0%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                    )}

                    {error && (
                      <div className="absolute inset-0 bg-red-500/10 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                        <p className="text-red-500 font-bold mb-4">{error}</p>
                        <button onClick={reset} className="px-6 py-2 bg-white text-black rounded-full font-bold">Try Again</button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Right Column: Results */}
          <section className="lg:sticky lg:top-24 space-y-8">
            {!result && !isAnalyzing && (
              <div className="p-8 rounded-3xl border border-zinc-900 bg-zinc-900/30 flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center">
                  <Scan className="w-8 h-8 text-zinc-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Awaiting Input</h3>
                  <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                    Take a photo to generate a detailed defect report using advanced computer vision.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-left">
                    <p className="text-[10px] font-bold uppercase text-zinc-500 mb-1">Accuracy</p>
                    <p className="text-lg font-bold">99.2%</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-left">
                    <p className="text-[10px] font-bold uppercase text-zinc-500 mb-1">Latency</p>
                    <p className="text-lg font-bold">~1.2s</p>
                  </div>
                </div>
              </div>
            )}

            {result && !isAnalyzing && (
              <AnalysisResultPanel result={result} onReset={reset} />
            )}
          </section>
        </div>
      </main>

      {/* Footer info */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-zinc-900 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-500 text-xs">
          <p>© 2024 DefectLens AI Systems. All rights reserved.</p>
          <div className="flex gap-8 uppercase tracking-widest font-bold">
            <a href="#" className="hover:text-zinc-100 transition-colors">Documentation</a>
            <a href="#" className="hover:text-zinc-100 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-100 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

