// src/lib/pdfService.ts
// Factory para criar instâncias dos serviços de PDF
import { GenerateProvaPDFUseCase } from '@/application/usecases/GenerateProvaPDFUseCase';
import { GenerateSlidesPDFUseCase } from '@/application/usecases/GenerateSlidesPDFUseCase';
import { LocalStorageRepository } from '@/repository/implementations/LocalStorageRepository';
import { ReactPDFGenerator } from '@/infrastructure/pdf/ReactPDFGenerator';

let provaPDFUseCaseInstance: GenerateProvaPDFUseCase | null = null;
let slidesPDFUseCaseInstance: GenerateSlidesPDFUseCase | null = null;

export function getGenerateProvaPDFUseCase(): GenerateProvaPDFUseCase {
  if (!provaPDFUseCaseInstance) {
    const lessonRepository = LocalStorageRepository.getInstance();
    const pdfGenerator = new ReactPDFGenerator();
    provaPDFUseCaseInstance = new GenerateProvaPDFUseCase(lessonRepository, pdfGenerator);
  }
  return provaPDFUseCaseInstance;
}

export function getGenerateSlidesPDFUseCase(): GenerateSlidesPDFUseCase {
  if (!slidesPDFUseCaseInstance) {
    const lessonRepository = LocalStorageRepository.getInstance();
    const pdfGenerator = new ReactPDFGenerator();
    slidesPDFUseCaseInstance = new GenerateSlidesPDFUseCase(lessonRepository, pdfGenerator);
  }
  return slidesPDFUseCaseInstance;
}
