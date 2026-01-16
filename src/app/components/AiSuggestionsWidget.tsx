import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface Suggestion {
    id: string;
    title: string;
    description: string;
    subject: string; // Disciplina
    image: string; // Emoji ou ícone
    type: 'activity' | 'content' | 'methodology';
}

const MOCK_SUGGESTIONS: Suggestion[] = [
    {
        id: '1',
        title: 'Gamificação em Frações',
        description: 'Use jogos de cartas para ensinar somas de frações de forma competitiva e divertida.',
        subject: 'Matemática',
        image: '🃏',
        type: 'methodology'
    },
    {
        id: '2',
        title: 'Debate: Revolução Industrial',
        description: 'Organize um debate simulado entre "operários" e "donos de fábrica" para explorar tensões sociais.',
        subject: 'História',
        image: '🏭',
        type: 'activity'
    },
    {
        id: '3',
        title: 'Experimento de Densidade',
        description: 'Crie uma torre de líquidos com diferentes densidades para visualizar conceitos de física.',
        subject: 'Ciências',
        image: '🧪',
        type: 'activity'
    },
    {
        id: '4',
        title: 'Storytelling Digital',
        description: 'Use ferramentas digitais para que alunos criem narrativas interativas sobre clássicos da literatura.',
        subject: 'Português',
        image: '📱',
        type: 'methodology'
    }
];

const SUBJECTS = ['Todos', 'Matemática', 'História', 'Ciências', 'Português', 'Geografia'];

export function AiSuggestionsWidget() {
    const [selectedSubject, setSelectedSubject] = useState('Todos');

    const filteredSuggestions = selectedSubject === 'Todos'
        ? MOCK_SUGGESTIONS
        : MOCK_SUGGESTIONS.filter(s => s.subject === selectedSubject);

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">💡</span>
                        <h2 className="text-xl font-bold font-heading text-primary">Sugestões da IA</h2>
                    </div>
                    <p className="text-text-secondary text-sm">Ideias personalizadas para suas aulas.</p>
                </div>

                {/* Filtros de Disciplina */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {SUBJECTS.map(subject => (
                        <button
                            key={subject}
                            onClick={() => setSelectedSubject(subject)}
                            className={`
                px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
                ${selectedSubject === subject
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-white text-text-secondary border border-border hover:bg-gray-50'
                                }
              `}
                        >
                            {subject}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid de Cards Temáticos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredSuggestions.map((suggestion) => (
                    <div
                        key={suggestion.id}
                        className="group relative bg-white rounded-2xl p-6 border border-border hover:border-primary/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-start"
                    >
                        <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4
              bg-gradient-to-br from-primary/10 to-transparent group-hover:scale-110 transition-transform
            `}>
                            {suggestion.image}
                        </div>

                        <span className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                            {suggestion.subject} • {suggestion.type === 'activity' ? 'Atividade' : 'Metodologia'}
                        </span>

                        <h3 className="text-lg font-bold text-text-main mb-2 font-heading group-hover:text-primary transition-colors">
                            {suggestion.title}
                        </h3>

                        <p className="text-sm text-text-secondary mb-6 line-clamp-3">
                            {suggestion.description}
                        </p>

                        <Button
                            className="mt-auto w-full bg-surface border border-primary text-primary hover:bg-primary hover:text-white transition-all"
                        >
                            Usar Ideia
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
