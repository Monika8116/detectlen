import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { AnalysisResult } from '../types';
import { motion } from 'motion/react';

interface AnalysisResultProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const AnalysisResultPanel: React.FC<AnalysisResultProps> = ({ result, onReset }) => {
  const isPass = result.inspectionResult === 'PASS';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 w-full max-w-2xl mx-auto"
    >
      <div className={`p-6 rounded-3xl border ${!isPass ? 'bg-red-500/5 border-red-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
        <div className="flex items-center gap-4 mb-6">
          {!isPass ? (
            <AlertTriangle className="w-8 h-8 text-red-500" />
          ) : (
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          )}
          <div>
            <h2 className={`text-2xl font-black tracking-tighter ${!isPass ? 'text-red-500' : 'text-emerald-500'}`}>
              INSPECTION: {result.inspectionResult}
            </h2>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
              Confidence: {result.confidenceLevel}
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl">
            <p className="text-[10px] font-bold uppercase text-zinc-500 mb-1">Defect Identified</p>
            <p className="text-zinc-100 font-medium">{result.defectIdentified}</p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl">
            <p className="text-[10px] font-bold uppercase text-zinc-500 mb-1">Location of Defect</p>
            <p className="text-zinc-100 font-medium">{result.locationOfDefect}</p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl">
            <p className="text-[10px] font-bold uppercase text-zinc-500 mb-1">Severity Level</p>
            <span className={`inline-block text-xs font-bold uppercase px-2 py-0.5 rounded-full mt-1 ${
              result.severityLevel === 'High' ? 'bg-red-500/20 text-red-400' :
              result.severityLevel === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
              result.severityLevel === 'Low' ? 'bg-emerald-500/20 text-emerald-400' :
              'bg-zinc-500/20 text-zinc-400'
            }`}>
              {result.severityLevel}
            </span>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl">
            <p className="text-[10px] font-bold uppercase text-zinc-500 mb-1">Suggested Fix</p>
            <p className="text-zinc-100 font-medium">{result.suggestedFix}</p>
          </div>
        </div>
      </div>

      <button
        onClick={onReset}
        className="flex items-center justify-center gap-2 w-full py-4 bg-zinc-100 text-zinc-900 rounded-2xl font-bold hover:bg-white transition-colors group"
      >
        Start New Scan
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
};
