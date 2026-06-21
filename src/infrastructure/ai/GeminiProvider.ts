import { GoogleGenAI } from '@google/genai';
import { IAProvider, AnalysisResult } from '../../core/interfaces/IAProvider';

export class GeminiProvider implements IAProvider {
  private ai: GoogleGenAI;
  private modelName = 'gemini-2.5-flash-lite';

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'A variável de ambiente GEMINI_API_KEY não está configurada. Por favor, adicione-a ao seu arquivo .env'
      );
    }
    // Inicializa o cliente oficial do Google GenAI
    this.ai = new GoogleGenAI({ apiKey });
  }

  async analyzeResume(text: string): Promise<AnalysisResult> {
    try {
      const prompt = `
Você é um recrutador profissional e especialista em análise de currículos.
Analise o currículo a seguir extraído de um arquivo PDF.
Avalie a estrutura, a clareza das informações, os pontos fortes, pontos a melhorar e forneça sugestões práticas de otimização.
Extraia também o nome do candidato se conseguir identificá-lo claramente.

Texto do Currículo:
"""
${text}
"""
`;

      const response = await this.ai.models.generateContent({
        model: this.modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              candidateName: {
                type: 'STRING',
                description: 'O nome completo do candidato encontrado no currículo. Retorne null se não for possível identificar.',
                nullable: true,
              },
              score: {
                type: 'INTEGER',
                description: 'Uma nota geral para o currículo de 0 a 100 baseada na qualidade, formatação e impacto das informações.',
              },
              strengths: {
                type: 'ARRAY',
                items: { type: 'STRING' },
                description: 'Lista de pontos fortes identificados no currículo (mínimo 3 itens).',
              },
              improvements: {
                type: 'ARRAY',
                items: { type: 'STRING' },
                description: 'Lista de pontos de melhoria, áreas mal explicadas ou erros (mínimo 3 itens).',
              },
              suggestions: {
                type: 'ARRAY',
                items: { type: 'STRING' },
                description: 'Sugestões práticas de alteração (ex: inclusão de palavras-chave, formatação, reescrita de conquistas com dados quantitativos, etc.).',
              },
            },
            required: ['candidateName', 'score', 'strengths', 'improvements', 'suggestions'],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('O modelo do Gemini retornou uma resposta vazia.');
      }

      const parsed: AnalysisResult = JSON.parse(responseText);
      return parsed;
    } catch (error) {
      console.error('Erro na análise com o Gemini:', error);
      const err = error as { status?: number };
      if (err.status === 429) {
        throw new Error('Cota da API do Gemini esgotada. Verifique sua chave de API e plano de uso.');
      }
      if (err.status === 401 || err.status === 403) {
        throw new Error('Chave de API do Gemini inválida ou sem permissão.');
      }
      throw new Error('Ocorreu um erro ao processar a análise com o serviço de Inteligência Artificial.');
    }
  }
}
