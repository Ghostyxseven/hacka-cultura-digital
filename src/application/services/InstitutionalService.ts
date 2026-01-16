// src/application/services/InstitutionalService.ts
import { InstitutionalOverview } from '../../core/entities/SchoolPerformance';
import { GetInstitutionalOverviewUseCase } from '../usecases/GetInstitutionalOverviewUseCase';

export class InstitutionalService {
    constructor(
        private getInstitutionalOverviewUseCase: GetInstitutionalOverviewUseCase
    ) { }

    getOverview(): InstitutionalOverview {
        return this.getInstitutionalOverviewUseCase.execute();
    }
}
