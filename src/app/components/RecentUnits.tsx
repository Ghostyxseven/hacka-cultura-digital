import { UnitsList } from './UnitsList';
import { UnitViewModel, SubjectViewModel } from '@/application/viewmodels';

interface RecentUnitsProps {
    units: UnitViewModel[];
    subjects?: SubjectViewModel[];
}

export function RecentUnits({ units, subjects = [] }: RecentUnitsProps) {
    if (units.length === 0) {
        return null;
    }

    return (
        <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-gray-50/50">
                <h3 className="font-heading font-bold text-lg text-text-main flex items-center gap-2">
                    <span>⚡</span> Aulas Recentes
                </h3>
            </div>
            <div className="p-4">
                <UnitsList
                    units={units}
                    subjects={subjects}
                    showSubject={true}
                    canDelete={false}
                />
            </div>
        </div>
    );
}
