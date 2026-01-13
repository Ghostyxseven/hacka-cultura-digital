// src/app/api/pdf/slides/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ReactPDFGenerator } from '@/infrastructure/pdf/ReactPDFGenerator';
import type { LessonPlan } from '@/core/entities/LessonPlan';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lessonPlan, options } = body;

    if (!lessonPlan) {
      return NextResponse.json(
        { error: 'lessonPlan é obrigatório' },
        { status: 400 }
      );
    }

    const pdfGenerator = new ReactPDFGenerator();
    const pdfBuffer = await pdfGenerator.generateSlidesPDF(lessonPlan as LessonPlan, options || {});

    // Retorna o PDF como resposta
    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="slides-${lessonPlan.id || 'slides'}.pdf"`,
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
