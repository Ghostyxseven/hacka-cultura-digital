// src/app/api/pdf/prova/route.ts
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

    if (!lessonPlan.quiz || lessonPlan.quiz.length === 0) {
      return NextResponse.json(
        { error: 'Este plano de aula não possui quiz para gerar prova' },
        { status: 400 }
      );
    }

    const pdfGenerator = new ReactPDFGenerator();
    const pdfBuffer = await pdfGenerator.generateProvaPDF(lessonPlan as LessonPlan, options || {});

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
