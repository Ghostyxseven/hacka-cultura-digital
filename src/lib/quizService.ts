// src/lib/quizService.ts
// Factory para criar instâncias dos serviços de quiz
import { TakeQuizUseCase } from '@/application/usecases/TakeQuizUseCase';
import { GetQuizResultsUseCase } from '@/application/usecases/GetQuizResultsUseCase';
import { LocalStorageQuizRepository } from '@/repository/implementations/LocalStorageQuizRepository';
import { LocalStorageRepository } from '@/repository/implementations/LocalStorageRepository';

let takeQuizUseCaseInstance: TakeQuizUseCase | null = null;
let getQuizResultsUseCaseInstance: GetQuizResultsUseCase | null = null;

export function getTakeQuizUseCase(): TakeQuizUseCase {
  if (!takeQuizUseCaseInstance) {
    const quizRepository = LocalStorageQuizRepository.getInstance();
    const lessonRepository = LocalStorageRepository.getInstance();
    takeQuizUseCaseInstance = new TakeQuizUseCase(quizRepository, lessonRepository);
  }
  return takeQuizUseCaseInstance;
}

export function getGetQuizResultsUseCase(): GetQuizResultsUseCase {
  if (!getQuizResultsUseCaseInstance) {
    const quizRepository = LocalStorageQuizRepository.getInstance();
    getQuizResultsUseCaseInstance = new GetQuizResultsUseCase(quizRepository);
  }
  return getQuizResultsUseCaseInstance;
}
