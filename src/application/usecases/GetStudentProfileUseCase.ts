// src/application/usecases/GetStudentProfileUseCase.ts
import { IStudentProfileRepository } from '@/core/repositories/IStudentProfileRepository';
import { StudentProfile } from '@/core/entities/StudentProfile';

/**
 * Use Case para buscar o perfil de gamificação de um aluno específico
 */
export class GetStudentProfileUseCase {
    constructor(private profileRepository: IStudentProfileRepository) { }

    execute(userId: string): StudentProfile {
        let profile = this.profileRepository.getProfileByUserId(userId);

        // Se não existir, inicializa um perfil básico
        if (!profile) {
            profile = {
                userId,
                xp: 0,
                level: 1,
                badges: [],
                updatedAt: new Date()
            };
            // Opcional: Salvar imediatamente ou apenas retornar
            this.profileRepository.saveProfile(profile);
        }

        return profile;
    }
}
