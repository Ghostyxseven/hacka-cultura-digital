// src/app/components/TeacherCopilotWidget.tsx
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { getLessonPlanService } from '@/lib/service';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export function TeacherCopilotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: 'Olá, Professor! Sou seu assistente pedagógico. Como posso te ajudar hoje?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lessonPlanService = getLessonPlanService();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const rawResponse = await lessonPlanService.askCopilot(userMessage.content);
            let processedContent = rawResponse;

            // Tentar fazer parse se vier como JSON (ex: { "resposta": "..." })
            try {
                if (rawResponse.trim().startsWith('{')) {
                    const json = JSON.parse(rawResponse);
                    if (json.resposta) {
                        processedContent = json.resposta;
                    }
                }
            } catch (e) {
                // Se falhar o parse, usa a resposta original
                console.log('Resposta não é JSON ou falhou o parse');
            }

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: processedContent
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error asking copilot', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Desculpe, professor. Tive um problema ao processar sua solicitação. Tente novamente.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col" style={{ height: '500px' }}>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-indigo-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🤖</span>
                            <div>
                                <h3 className="font-bold">Copilot Pedagógico</h3>
                                <p className="text-xs text-primary-100">Seu assistente pessoal</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`
                                        max-w-[85%] p-3 rounded-2xl text-sm
                                        ${msg.role === 'user'
                                            ? 'bg-primary-600 text-white rounded-br-none'
                                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                        }
                                    `}
                                >
                                    <div className="whitespace-pre-wrap leading-relaxed">
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-100">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Digite sua dúvida ou comando..."
                                className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                disabled={isLoading}
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={isLoading || !input.trim()}
                                className="rounded-xl px-3"
                            >
                                ➤
                            </Button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-center">
                            IA pode cometer erros. Verifique as informações importantes.
                        </p>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-105
                    ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700'}
                `}
            >
                <span className="text-3xl">{isOpen ? '✕' : '🤖'}</span>
            </Button>
        </div>
    );
}
