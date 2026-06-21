export interface AnalysisResult {
  candidateName: string | null;
  score: number; // 0 to 100
  strengths: string[];
  improvements: string[];
  suggestions: string[];
}

export interface IAProvider {
  /**
   * Analisa o texto bruto de um currículo e retorna uma análise estruturada.
   * @param text O texto extraído do currículo.
   */
  analyzeResume(text: string): Promise<AnalysisResult>;
}
