// src/app/components/TutorChat.tsx
'use client';

import { useState } from 'react';
import { getLessonPlanService } from '@/lib/service';
import { getAuthService } from '@/lib/authService';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { LessonPlanViewModel } from '@/application/viewmodels';
import { getTutorService } from '@/lib/tutorService';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface TutorChatProps {
    lessonPlan: LessonPlanViewModel;
}

export function TutorChat({ lessonPlan }: TutorChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: `Olá! Sou seu Tutor Digital. Em que posso te ajudar sobre a aula "${lessonPlan.title}"?` }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const tutorService = getTutorService();

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
        setLoading(true);

        try {
            // Usamos a entidade original para o service (simulação aqui pegando via ID)
            const lpService = getLessonPlanService();
            const entity = lpService.getLessonPlanById(lessonPlan.id);

            if (!entity) throw new Error('Plano não encontrado');

            const response = await tutorService.getTutorResponse({
                lessonPlanId: lessonPlan.id,
                message: userMessage,
                history: messages
            }, entity);

            setMessages([...newMessages, { role: 'assistant', content: response }]);
        } catch (error) {
            setMessages([...newMessages, { role: 'assistant', content: 'Ops, tive um probleminha para pensar agora. Pode repetir?' }]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center text-3xl hover:scale-110 transition-all z-50 border-4 border-white"
                title="Falar com o Tutor"
            >
                🤖
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-indigo-100 overflow-hidden animate-in slide-in-from-bottom-5">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🤖</span>
                    <div>
                        <h3 className="font-bold text-sm">Tutor Digital</h3>
                        <p className="text-[10px] text-indigo-100 italic">Sempre pronto para ensinar</p>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-lg p-1 transition-colors">
                    ✕
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((m, idx) => (
                    <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${m.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                            }`}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Tire sua dúvida..."
                    className="flex-1 text-sm px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                    🚀
                </button>
            </div>
        </div>
    );
}
