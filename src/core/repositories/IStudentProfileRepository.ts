// src/core/repositories/IStudentProfileRepository.ts
import { StudentProfile } from '../entities/StudentProfile';

export interface IStudentProfileRepository {
    getProfileByUserId(userId: string): StudentProfile | undefined;
    saveProfile(profile: StudentProfile): void;
    getAllProfiles(): StudentProfile[];
}
