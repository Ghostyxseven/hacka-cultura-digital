// src/app/api/pdf/slides/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getGenerateSlidesPDFUseCase } from '@/lib/pdfService';

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

    const useCase = getGenerateSlidesPDFUseCase();
    const pdfBuffer = await useCase.execute(lessonPlanId, options || {});

    // Retorna o PDF como resposta
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="slides-${lessonPlanId}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Erro ao gerar PDF de slides:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao gerar PDF de slides' },
      { status: 500 }
    );
  }
}
