// src/core/constants/Badges.ts
import { Badge } from '../entities/Badge';

export const INITIAL_BADGES: Badge[] = [
    {
        id: 'badge_perfect_score',
        name: 'Mestre da Perfeição',
        description: 'Conseguiu 100% de acerto em um quiz',
        icon: '🎯',
        type: 'quiz_score',
        criteriaValue: 100
    },
    {
        id: 'badge_first_step',
        name: 'Primeiro Passo',
        description: 'Completou sua primeira atividade',
        icon: '🌱',
        type: 'participation',
        criteriaValue: 1
    },
    {
        id: 'badge_diligent_student',
        name: 'Estudante Aplicado',
        description: 'Completou 5 atividades',
        icon: '📚',
        type: 'participation',
        criteriaValue: 5
    },
    {
        id: 'badge_fast_learner',
        name: 'Flash da Tecnologia',
        description: 'Completou um quiz em menos de 60 segundos com boa nota',
        icon: '⚡',
        type: 'speed',
        criteriaValue: 60
    }
];
