export interface AnalysisResult {
  inspectionResult: 'PASS' | 'FAIL';
  defectIdentified: string;
  locationOfDefect: string;
  severityLevel: 'Low' | 'Medium' | 'High' | 'N/A';
  suggestedFix: string;
  confidenceLevel: string;
}

