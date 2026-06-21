import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { extractTextFromPDF } from '../../../infrastructure/pdf/pdf-extractor';
import { GeminiProvider } from '../../../infrastructure/ai/GeminiProvider';
import { prisma } from '../../../infrastructure/db/prisma';

// Limite de tamanho de arquivo: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    // 1. Obter e validar o FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado. Por favor, faça o upload de um currículo.' },
        { status: 400 }
      );
    }

    // 2. Validar tipo do arquivo (apenas PDF)
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Apenas arquivos PDF são suportados.' },
        { status: 400 }
      );
    }

    // 3. Validar tamanho do arquivo
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'O arquivo é muito grande. O limite máximo é de 5MB.' },
        { status: 400 }
      );
    }

    // 4. Ler o arquivo em Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 5. Extrair o texto do PDF
    const text = await extractTextFromPDF(buffer);
    const cleanedText = text.trim();

    if (!cleanedText || cleanedText.length < 50) {
      return NextResponse.json(
        {
          error:
            'Não foi possível extrair texto legível do PDF. Certifique-se de que o arquivo não contém apenas imagens escaneadas.',
        },
        { status: 400 }
      );
    }

    // 6. Analisar com IA
    const aiProvider = new GeminiProvider();
    const analysis = await aiProvider.analyzeResume(cleanedText);

    // 7. Obter IP do usuário e fazer o hash para LGPD/Privacidade
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

    // 8. Gravar no banco de dados com tratamento de erro resiliente
    // Se o banco não estiver configurado ou falhar, a requisição não deve falhar para o usuário
    try {
      await prisma.analysis.create({
        data: {
          candidateName: analysis.candidateName,
          score: analysis.score,
          resumeText: cleanedText.substring(0, 10000), // Armazena os primeiros 10k caracteres
          result: {
            strengths: analysis.strengths,
            improvements: analysis.improvements,
            suggestions: analysis.suggestions,
          },
          ipHash: ipHash,
        },
      });
      console.log('Análise gravada no banco de dados com sucesso.');
    } catch (dbError) {
      // Apenas loga o erro e segue em frente
      console.error('Falha ao registrar análise no banco de dados (o banco está configurado e migrado?):', dbError);
    }

    // 9. Retornar a análise ao cliente
    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('Erro geral no endpoint /api/analyze:', error);
    return NextResponse.json(
      { error: error.message || 'Ocorreu um erro interno durante a análise do currículo.' },
      { status: 500 }
    );
  }
}
