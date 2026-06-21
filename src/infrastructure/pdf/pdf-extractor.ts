import { createRequire } from 'module';

// pdf-parse é um módulo CommonJS (v1). Usamos createRequire para carregá-lo
// com segurança em ambientes ESM (Next.js App Router).
const require = createRequire(import.meta.url);
// pdf-parse v1 exporta a função diretamente como module.exports
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse');
const pdf = typeof pdfParse === 'function' ? pdfParse : pdfParse.default;

/**
 * Extrai o texto de um buffer de arquivo PDF usando a biblioteca pdf-parse.
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    return data.text || '';
  } catch (error) {
    console.error('Erro ao extrair texto do PDF:', error);
    throw new Error('Falha ao processar o arquivo PDF. Verifique se o arquivo não está corrompido.');
  }
}
