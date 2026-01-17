'use client';

import { useState, useRef, useEffect } from 'react';
import { AIService } from '@/infrastructure/services/AIService';
import { ApplicationServiceFactory } from '@/application';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/hooks';
import { LoadingSpinner } from './LoadingSpinner';

// Evento customizado para atualizar dashboard
const DASHBOARD_UPDATE_EVENT = 'dashboard:update';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Sugestões de comandos rápidos
const QUICK_SUGGESTIONS = [
  { text: 'Criar disciplina de Matemática', icon: '📐' },
  { text: 'Criar disciplina de História', icon: '📚' },
  { text: 'Gerar atividade de Português', icon: '✍️' },
  { text: 'Criar unidade sobre Frações', icon: '🔢' },
];

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
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
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

  // Navegação do histórico com setas do teclado
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Navega pelo histórico apenas quando o input está focado
      if (document.activeElement === inputRef.current) {
        if (e.key === 'ArrowUp' && commandHistory.length > 0) {
          e.preventDefault();
          const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
          setHistoryIndex(newIndex);
          setInput(commandHistory[commandHistory.length - 1 - newIndex]);
          setShowSuggestions(false);
        } else if (e.key === 'ArrowDown' && historyIndex >= 0) {
          e.preventDefault();
          const newIndex = historyIndex - 1;
          if (newIndex >= 0) {
            setHistoryIndex(newIndex);
            setInput(commandHistory[commandHistory.length - 1 - newIndex]);
          } else {
            setHistoryIndex(-1);
            setInput('');
            setShowSuggestions(true);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, commandHistory, historyIndex]);

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
      // Padrão 1: "crie uma disciplina de historia" ou "crie uma diciplina de historia"
      let match = lowerText.match(/(?:crie|criar|adicionar)(?:\s+uma|\s+um)?\s+(?:disciplina|diciplina|matéria)(?:\s+de)?\s+([^,\n]+?)(?:\s+para\s+([^\n]+))?$/);
      
      // Padrão 2: "criar disciplina Matemática" (sem "de")
      if (!match) {
        match = lowerText.match(/(?:crie|criar|adicionar)(?:\s+uma|\s+um)?\s+(?:disciplina|diciplina|matéria)\s+([^,\n]+?)(?:\s+para\s+([^\n]+))?$/);
      }
      
      // Padrão 3: Apenas "disciplina de X" (mais permissivo)
      if (!match) {
        match = lowerText.match(/(?:disciplina|diciplina|matéria)(?:\s+de)?\s+([a-záàâãéêíóôõúç\s]+?)(?:\s+para\s+([^\n]+))?$/i);
      }
      
      let subjectName = match?.[1]?.trim() || '';
      const schoolYears = match?.[2]?.trim() || '';
      
      // Remove palavras desnecessárias do início do nome
      subjectName = subjectName.replace(/^(de|da|do|para|com|sobre|em)\s+/i, '').trim();
      
      // Remove palavras desnecessárias do final do nome
      subjectName = subjectName.replace(/\s+(de|da|do|para|com|sobre|em)$/i, '').trim();
      
      // Se não encontrou pelo regex, tenta extração manual mais agressiva
      if (!subjectName || subjectName.length < 2) {
        // Procura por palavras comuns de disciplinas
        const commonSubjects = ['historia', 'história', 'matematica', 'matemática', 'ciencias', 'ciências', 'portugues', 'português', 'geografia', 'ingles', 'inglês', 'fisica', 'física', 'quimica', 'química', 'biologia', 'artes', 'educacao fisica', 'educação física'];
        for (const subj of commonSubjects) {
          if (lowerText.includes(subj)) {
            subjectName = subj;
            break;
          }
        }
      }
      
      // Debug: log para verificar o que foi extraído
      console.log('AIAgent - Parse Command:', { 
        originalText: text,
        lowerText, 
        hasCreateWord,
        hasSubjectWord,
        match: match ? match[0] : null,
        subjectName, 
        schoolYears,
        willExecute: subjectName && subjectName.length >= 2
      });

      // Se encontrou algum nome de disciplina, executa a ação
      if (subjectName && subjectName.length >= 2) {
        // Capitaliza primeira letra
        subjectName = subjectName.charAt(0).toUpperCase() + subjectName.slice(1);
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
      // Melhor padrão para extrair nome da disciplina
      // Ex: "Gerar atividade de Português" -> "Português"
      // Ex: "Gerar atividade de História sobre Brasil" -> "História", "Brasil"
      let match = lowerText.match(/gerar\s+atividade\s+(?:de|para|da)?\s+([a-záàâãéêíóôõúç\s]+?)(?:\s+sobre\s+([^\n]+))?$/i);
      
      // Se não encontrou, tenta padrão alternativo
      if (!match) {
        match = lowerText.match(/atividade\s+(?:de|para|da)?\s+([a-záàâãéêíóôõúç\s]+?)(?:\s+sobre\s+([^\n]+))?$/i);
      }
      
      // Se ainda não encontrou, extrai tudo depois de "de/da/para"
      if (!match) {
        const deIndex = lowerText.search(/\s+(de|da|para)\s+/);
        if (deIndex >= 0) {
          const afterDe = lowerText.substring(deIndex).replace(/\s+(de|da|para)\s+/, ' ').trim();
          const words = afterDe.split(/\s+/);
          
          // Procura por "sobre" para separar disciplina de tópico
          const sobreIndex = words.findIndex(w => w === 'sobre');
          if (sobreIndex >= 0) {
            match = [null, words.slice(0, sobreIndex).join(' '), words.slice(sobreIndex + 1).join(' ')];
          } else {
            match = [null, afterDe, ''];
          }
        }
      }
      
      let subjectName = match?.[1]?.trim() || '';
      const topic = match?.[2]?.trim() || '';
      
      // Remove palavras desnecessárias
      subjectName = subjectName.replace(/^(de|da|do|para|com|sobre|em)\s+/i, '').trim();
      subjectName = subjectName.replace(/\s+(de|da|do|para|com|sobre|em)$/i, '').trim();

      // Se não encontrou, procura por disciplinas comuns
      if (!subjectName || subjectName.length < 2) {
        const commonSubjects = ['português', 'portugues', 'matematica', 'matemática', 'historia', 'história', 'ciencias', 'ciências', 'geografia', 'ingles', 'inglês', 'fisica', 'física', 'quimica', 'química', 'biologia', 'artes', 'educacao fisica', 'educação física'];
        for (const subj of commonSubjects) {
          if (lowerText.includes(subj)) {
            subjectName = subj;
            break;
          }
        }
      }

      if (subjectName && subjectName.length >= 2) {
        return {
          action: 'generate_activity',
          params: {
            subjectName: subjectName,
            topic: topic,
          },
        };
      }
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
          
          // Dispara evento para atualizar dashboard instantaneamente
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent(DASHBOARD_UPDATE_EVENT, { 
              detail: { type: 'subject_created', subject } 
            }));
          }
          
          // Também recarrega a página após um pequeno delay para garantir
          setTimeout(() => {
            router.refresh();
          }, 500);

          return `✅ Disciplina "${subject.name}" criada com sucesso para ${years.join(', ')}!\n\nA disciplina já está disponível no seu dashboard!`;
        }

        case 'generate_activity': {
          const { subjectName, topic } = params;
          if (!subjectName || subjectName.length < 2) {
            return '❌ Não consegui identificar a disciplina.\n\n📝 Para gerar uma atividade, você precisa:\n\n1️⃣ Primeiro criar a disciplina (ex: "Criar disciplina de Português")\n2️⃣ Depois criar uma unidade na disciplina\n3️⃣ Então gerar a atividade\n\n💡 Exemplo de comando completo:\n"Criar disciplina de Português para 6º ano"';
          }

          const subjectService = ApplicationServiceFactory.createSubjectService();
          const subjects = await subjectService.findAll();
          const subject = subjects.find((s) => s.name.toLowerCase().includes(subjectName.toLowerCase()));

          if (!subject) {
            return `❌ Não encontrei a disciplina "${subjectName}".\n\n📚 Para gerar uma atividade, primeiro você precisa criar a disciplina!\n\n💡 Use o comando:\n"Criar disciplina de ${subjectName}"\n\nDepois de criar a disciplina e uma unidade, você poderá gerar atividades.`;
          }

          const unitService = ApplicationServiceFactory.createUnitService();
          const units = await unitService.findBySubject(subject.id);

          if (units.length === 0) {
            return `❌ A disciplina "${subject.name}" não possui unidades.\n\n📝 Para gerar uma atividade, você precisa:\n\n1️⃣ Criar uma unidade na disciplina "${subject.name}"\n2️⃣ Depois gerar a atividade para essa unidade\n\n💡 Comando para criar unidade:\n"Criar unidade de ${subject.name} sobre [tema da aula]"`;
          }

          const unit = units[0]; // Usa a primeira unidade

          const materialService = ApplicationServiceFactory.createMaterialGenerationService();
          const activity = await materialService.generateActivity({
            unitId: unit.id,
          });

          showToast(`Atividade gerada com sucesso para "${unit.title}"!`, 'success');
          
          // Dispara evento para atualizar dashboard instantaneamente
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent(DASHBOARD_UPDATE_EVENT, { 
              detail: { type: 'activity_created', activity } 
            }));
          }
          
          setTimeout(() => {
            router.refresh();
          }, 500);

          return `✅ Atividade gerada com sucesso para a unidade "${unit.title}" da disciplina "${subject.name}"!\n\nA atividade já está disponível!`;
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
          
          // Dispara evento para atualizar dashboard instantaneamente
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent(DASHBOARD_UPDATE_EVENT, { 
              detail: { type: 'unit_created', unit } 
            }));
          }
          
          setTimeout(() => {
            router.refresh();
          }, 500);

          return `✅ Unidade "${unit.title}" criada com sucesso na disciplina "${subject.name}"!\n\nA unidade já está disponível!`;
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
    setShowSuggestions(false);
    setHistoryIndex(-1);
    
    // Adiciona ao histórico (máximo 50 comandos)
    setCommandHistory((prev) => {
      const newHistory = [userMessage, ...prev.filter(cmd => cmd !== userMessage)].slice(0, 50);
      return newHistory;
    });
    
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

      {/* Sugestões Rápidas */}
      {showSuggestions && messages.length === 1 && (
        <div className="px-4 pt-2 pb-2 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 mb-2 font-semibold">Sugestões rápidas:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInput(suggestion.text);
                  setShowSuggestions(false);
                  inputRef.current?.focus();
                }}
                className="px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-all flex items-center gap-1.5"
              >
                <span>{suggestion.icon}</span>
                <span className="text-gray-700">{suggestion.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(false);
              setHistoryIndex(-1);
            }}
            onFocus={() => {
              if (input === '' && commandHistory.length === 0) {
                setShowSuggestions(true);
              }
            }}
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
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500">
            Ex: "Criar disciplina Matemática" | Use ↑↓ para histórico
          </p>
          {commandHistory.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setShowSuggestions(!showSuggestions);
                if (!showSuggestions && input === '') {
                  inputRef.current?.focus();
                }
              }}
              className="text-xs text-teal-600 hover:text-teal-700 transition-colors"
            >
              {showSuggestions ? 'Ocultar' : 'Mostrar'} histórico ({commandHistory.length})
            </button>
          )}
        </div>
        
        {/* Histórico de Comandos */}
        {showSuggestions && commandHistory.length > 0 && input === '' && (
          <div className="mt-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg bg-white">
            {commandHistory.slice(0, 5).map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInput(cmd);
                  setShowSuggestions(false);
                  inputRef.current?.focus();
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-teal-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                {cmd}
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}
