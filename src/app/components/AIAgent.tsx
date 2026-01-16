'use client';

import { useState, useRef, useEffect } from 'react';
import { AIService } from '@/infrastructure/services/AIService';
import { ApplicationServiceFactory } from '@/application';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/hooks';
import { LoadingSpinner } from './LoadingSpinner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * Agente de IA Conversacional
 * 
 * Permite interagir com o sistema através de comandos em linguagem natural:
 * - "Criar disciplina Matemática para 6º ano"
 * - "Gerar atividade de matemática sobre frações"
 * - "Gerar PDF da disciplina História"
 */
export function AIAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou seu assistente de IA. Posso ajudar você a:\n\n• Criar disciplinas\n• Gerar atividades\n• Gerar PDFs de materiais\n• Criar unidades de ensino\n\nComo posso ajudar?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { showToast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const parseCommand = (text: string): {
    action: 'create_subject' | 'generate_activity' | 'generate_pdf' | 'create_unit' | 'unknown';
    params: Record<string, string>;
  } => {
    const lowerText = text.toLowerCase();

    // Criar disciplina - Melhorado para aceitar variações: "crie", "criar", "adicionar", "criar uma", etc.
    // Também aceita erros de digitação como "diciplina" (sem "s")
    const hasCreateWord = lowerText.includes('crie') || lowerText.includes('criar') || lowerText.includes('adicionar');
    const hasSubjectWord = lowerText.includes('disciplina') || lowerText.includes('diciplina') || lowerText.includes('matéria');
    
    if (hasCreateWord && hasSubjectWord) {
      
      // Padrões mais flexíveis para extrair nome e anos
      // Ex: "crie uma disciplina de historia" -> "historia"
      // Ex: "criar disciplina Matemática para 6º ano" -> "Matemática", "6º ano"
      // Ex: "adicionar matéria de ciências para 7º e 8º ano" -> "ciências", "7º e 8º ano"
      
      // Tenta múltiplos padrões para extrair nome e anos
      // Padrão 1: "crie uma disciplina de historia" -> captura "historia"
      let match = lowerText.match(/(?:crie|criar|adicionar)(?:\s+uma|\s+um)?\s+(?:disciplina|matéria)(?:\s+de)?\s+([^,\n]+?)(?:\s+para\s+([^\n]+))?$/);
      
      // Padrão 2: "criar disciplina Matemática" (sem "de")
      if (!match) {
        match = lowerText.match(/(?:crie|criar|adicionar)(?:\s+uma|\s+um)?\s+(?:disciplina|matéria)\s+([^,\n]+?)(?:\s+para\s+([^\n]+))?$/);
      }
      
      // Padrão 3: Apenas "disciplina de X" (mais permissivo)
      if (!match) {
        match = lowerText.match(/(?:disciplina|matéria)(?:\s+de)?\s+([a-záàâãéêíóôõúç\s]+?)(?:\s+para\s+([^\n]+))?$/i);
      }
      
      let subjectName = match?.[1]?.trim() || '';
      const schoolYears = match?.[2]?.trim() || '';
      
      // Remove palavras desnecessárias do início do nome
      subjectName = subjectName.replace(/^(de|da|do|para|com|sobre|em)\s+/i, '').trim();
      
      // Remove palavras desnecessárias do final do nome
      subjectName = subjectName.replace(/\s+(de|da|do|para|com|sobre|em)$/i, '').trim();
      
      // Debug: log para verificar o que foi extraído
      if (process.env.NODE_ENV === 'development') {
        console.log('AIAgent - Parse:', { text: lowerText, subjectName, schoolYears, match });
      }

      // Se encontrou algum nome de disciplina, executa a ação
      if (subjectName && subjectName.length >= 2) {
        return {
          action: 'create_subject',
          params: {
            name: subjectName,
            schoolYears: schoolYears,
          },
        };
      }
    }

    // Gerar atividade
    if (lowerText.includes('gerar') && lowerText.includes('atividade')) {
      const subjectMatch = lowerText.match(/(?:de|para|da)\s+([^,\n]+?)(?:\s+sobre\s+([^\n]+))?/);
      const subjectName = subjectMatch?.[1]?.trim() || '';
      const topic = subjectMatch?.[2]?.trim() || '';

      return {
        action: 'generate_activity',
        params: {
          subjectName: subjectName,
          topic: topic,
        },
      };
    }

    // Gerar PDF
    if (lowerText.includes('gerar') && lowerText.includes('pdf')) {
      const match = lowerText.match(/(?:de|da)\s+([^\n]+)/);
      const subjectName = match?.[1]?.trim() || '';

      return {
        action: 'generate_pdf',
        params: {
          subjectName: subjectName,
        },
      };
    }

    // Criar unidade
    if (lowerText.includes('criar') && (lowerText.includes('unidade') || lowerText.includes('aula'))) {
      const match = lowerText.match(/(?:criar|adicionar)\s+(?:a\s+)?(?:unidade|aula)\s+(?:de\s+)?([^,\n]+?)(?:\s+sobre\s+([^\n]+))?/);
      const subjectName = match?.[1]?.trim() || '';
      const topic = match?.[2]?.trim() || '';

      return {
        action: 'create_unit',
        params: {
          subjectName: subjectName,
          topic: topic,
        },
      };
    }

    return { action: 'unknown', params: {} };
  };

  const executeAction = async (action: string, params: Record<string, string>): Promise<string> => {
    try {
      switch (action) {
        case 'create_subject': {
          const { name, schoolYears } = params;
          if (!name) {
            return 'Não consegui identificar o nome da disciplina. Por favor, especifique.';
          }

          const subjectService = ApplicationServiceFactory.createSubjectService();
          const years = schoolYears
            ? schoolYears.split(/[,\s]+/).map((y) => y.trim())
            : ['6º ano', '7º ano', '8º ano']; // Default

          const subject = await subjectService.create({
            name: name,
            description: `Disciplina de ${name}`,
            schoolYears: years,
          });

          showToast(`Disciplina "${subject.name}" criada com sucesso!`, 'success');
          router.refresh();

          return `✅ Disciplina "${subject.name}" criada com sucesso para ${years.join(', ')}!`;
        }

        case 'generate_activity': {
          const { subjectName, topic } = params;
          if (!subjectName) {
            return 'Não consegui identificar a disciplina. Por favor, especifique qual disciplina você quer gerar atividade.';
          }

          const subjectService = ApplicationServiceFactory.createSubjectService();
          const subjects = await subjectService.findAll();
          const subject = subjects.find((s) => s.name.toLowerCase().includes(subjectName.toLowerCase()));

          if (!subject) {
            return `Não encontrei a disciplina "${subjectName}". Por favor, verifique o nome.`;
          }

          const unitService = ApplicationServiceFactory.createUnitService();
          const units = await unitService.findBySubject(subject.id);

          if (units.length === 0) {
            return `A disciplina "${subject.name}" não possui unidades. Crie uma unidade primeiro.`;
          }

          const unit = units[0]; // Usa a primeira unidade

          const materialService = ApplicationServiceFactory.createMaterialGenerationService();
          const activity = await materialService.generateActivity({
            unitId: unit.id,
          });

          showToast(`Atividade gerada com sucesso para "${unit.title}"!`, 'success');
          router.refresh();

          return `✅ Atividade gerada com sucesso para a unidade "${unit.title}" da disciplina "${subject.name}"!`;
        }

        case 'create_unit': {
          const { subjectName, topic } = params;
          if (!subjectName) {
            return 'Não consegui identificar a disciplina. Por favor, especifique.';
          }
          if (!topic) {
            return 'Não consegui identificar o tema da unidade. Por favor, especifique.';
          }

          const subjectService = ApplicationServiceFactory.createSubjectService();
          const subjects = await subjectService.findAll();
          const subject = subjects.find((s) => s.name.toLowerCase().includes(subjectName.toLowerCase()));

          if (!subject) {
            return `Não encontrei a disciplina "${subjectName}". Por favor, verifique o nome.`;
          }

          const unitService = ApplicationServiceFactory.createUnitService();
          const unit = await unitService.create({
            subjectId: subject.id,
            title: topic,
            theme: topic,
            isAIGenerated: true,
          });

          showToast(`Unidade "${unit.title}" criada com sucesso!`, 'success');
          router.refresh();

          return `✅ Unidade "${unit.title}" criada com sucesso na disciplina "${subject.name}"!`;
        }

        case 'generate_pdf': {
          const { subjectName } = params;
          if (!subjectName) {
            return 'Não consegui identificar a disciplina. Por favor, especifique.';
          }

          router.push(`/professor/disciplinas?pdf=${encodeURIComponent(subjectName)}`);
          return `📄 Redirecionando para visualizar os materiais da disciplina "${subjectName}". Você pode exportar o PDF na página.`;
        }

        default:
          return 'Desculpe, não entendi o comando. Posso ajudar com:\n\n• Criar disciplinas\n• Gerar atividades\n• Gerar PDFs\n• Criar unidades';
      }
    } catch (error: any) {
      console.error('Erro ao executar ação:', error);
      return `❌ Erro: ${error.message || 'Não foi possível executar a ação.'}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);

    setIsProcessing(true);

    try {
      const command = parseCommand(userMessage);
      let response = '';

      if (command.action === 'unknown') {
        // Usa IA para gerar resposta geral
        const aiService = new AIService();
        const aiResponse = await aiService.generateText({
          prompt: `Você é um assistente educacional. O usuário disse: "${userMessage}". Responda de forma amigável e ofereça ajuda para criar disciplinas, gerar atividades, criar unidades ou gerar PDFs.`,
        });
        response = aiResponse.content;
      } else {
        response = await executeAction(command.action, command.params);
      }

      addMessage('assistant', response);
    } catch (error: any) {
      addMessage('assistant', `❌ Erro: ${error.message || 'Não foi possível processar sua solicitação.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-teal-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-50"
        aria-label="Abrir assistente de IA"
      >
        <span className="text-3xl">🤖</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-purple-600 text-white p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <h3 className="font-bold text-lg">Assistente de IA</h3>
            <p className="text-xs text-teal-100">Como posso ajudar?</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
          aria-label="Fechar"
        >
          <span className="text-xl">✕</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <LoadingSpinner message="Processando..." size="sm" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite seu comando..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            ➤
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Ex: "Criar disciplina Matemática para 6º ano" | "Gerar atividade de História"
        </p>
      </form>
    </div>
  );
}
