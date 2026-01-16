// src/components/lazy/index.tsx
// Lazy loading de componentes pesados para melhorar performance

import dynamic from 'next/dynamic';
import { Loading } from '../ui/Loading';

// Loading component para lazy loaded components
const LazyLoading = () => <Loading />;

// Componentes pesados com lazy loading
export const LazyTeacherMural = dynamic(
  () => import('@/app/components/TeacherMural').then(mod => ({ default: mod.TeacherMural })),
  {
    loading: () => <LazyLoading />,
    ssr: false
  }
);

export const LazyTutorChat = dynamic(
  () => import('@/app/components/TutorChat').then(mod => ({ default: mod.TutorChat })),
  {
    loading: () => <LazyLoading />,
    ssr: false
  }
);

export const LazyInstitutionalPerformance = dynamic(
  () => import('@/app/components/InstitutionalPerformance').then(mod => ({ default: mod.InstitutionalPerformance })),
  {
    loading: () => <LazyLoading />,
    ssr: false
  }
);

export const LazyMaterialRAGManager = dynamic(
  () => import('@/app/components/MaterialRAGManager').then(mod => ({ default: mod.MaterialRAGManager })),
  {
    loading: () => <LazyLoading />,
    ssr: false
  }
);

export const LazyLessonPlanRefiner = dynamic(
  () => import('@/app/components/LessonPlanRefiner').then(mod => ({ default: mod.LessonPlanRefiner })),
  {
    loading: () => <LazyLoading />,
    ssr: false
  }
);
