// src/app/api/pdf/prova/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getGenerateProvaPDFUseCase } from '@/lib/pdfService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lessonPlanId, options } = body;

    if (!lessonPlanId) {
      return NextResponse.json(
        { error: 'lessonPlanId é obrigatório' },
        { status: 400 }
      );
    }

    const useCase = getGenerateProvaPDFUseCase();
    const pdfBuffer = await useCase.execute(lessonPlanId, options || {});

    // Retorna o PDF como resposta
    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="prova-${lessonPlanId}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Erro ao gerar PDF de prova:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao gerar PDF de prova' },
      { status: 500 }
    );
  }
}
