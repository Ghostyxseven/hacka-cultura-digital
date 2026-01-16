# 📋 Plano de Implementação - Melhorias do Sistema

Este documento organiza as melhorias propostas por branch existente, sem criar novas branches.

---

## 🎨 **layer/presentation** - Experiência do Usuário (UX/UI)

### Design Lúdico para Alunos
- [ ] **Componente de Mascote Interativo**
  - Criar componente `MascotAvatar` com animações
  - Integrar em páginas do aluno (`/aluno/*`)
  - Adicionar feedbacks visuais (animações ao completar atividades)

- [ ] **Sistema de Temas e Cores**
  - Criar contexto `ThemeProvider` com temas (claro/escuro/lúdico)
  - Componente `ThemeToggle` para alternar temas
  - Paleta de cores mais vibrante para área do aluno

- [ ] **Ícones Interativos**
  - Substituir ícones estáticos por componentes animados
  - Adicionar micro-interações em botões e cards
  - Biblioteca: `lucide-react` ou `react-icons` com animações

### Acessibilidade
- [ ] **Leitura em Voz Alta**
  - Componente `TextToSpeech` para ler conteúdo
  - Botão de leitura em planos de aula e quizzes
  - Integração com Web Speech API

- [ ] **Contraste Ajustável**
  - Adicionar controles de contraste no `ThemeProvider`
  - Modo alto contraste para acessibilidade
  - Persistir preferências no localStorage

- [ ] **Navegação por Teclado**
  - Melhorar foco e navegação por Tab
  - Atalhos de teclado (ex: `Ctrl+K` para busca)
  - Indicadores visuais de foco

- [ ] **Legendas Automáticas**
  - Componente para legendas em vídeos (se houver)
  - Suporte a ARIA labels em todos os componentes

### Mobile-First
- [ ] **Otimização Mobile**
  - Revisar todos os componentes para mobile
  - Menu hambúrguer responsivo
  - Touch gestures (swipe, pull-to-refresh)
  - Componente `MobileNavigation` dedicado

- [ ] **PWA (Progressive Web App)**
  - Adicionar `manifest.json`
  - Service Worker para offline
  - Instalação no dispositivo móvel

### Gamificação Avançada
- [ ] **Sistema de Conquistas**
  - Componente `AchievementBadge`
  - Dashboard de conquistas do aluno
  - Notificações de conquistas desbloqueadas

- [ ] **Ranking e Desafios**
  - Componente `Leaderboard` (ranking entre turmas)
  - Página de desafios semanais
  - Componente `ChallengeCard`

### Mural Interativo
- [ ] **Componente de Mural**
  - Melhorar `TeacherMural` existente
  - Adicionar suporte a dúvidas dos alunos
  - Integração com IA para respostas automáticas

### Notificações Inteligentes
- [ ] **Sistema de Notificações**
  - Componente `NotificationCenter`
  - Lembretes de atividades pendentes
  - Sugestões de revisão antes de provas
  - Integração com Service Worker para notificações push

---

## 🧠 **layer/application** - Pedagogia e Conteúdo

### Banco de Questões Reutilizável
- [ ] **Use Case: SaveQuizQuestion**
  - Criar `SaveQuizQuestionUseCase.ts`
  - Permitir salvar questões individuais do quiz
  - Tagging de questões por tema/dificuldade

- [ ] **Use Case: ReuseQuizQuestions**
  - Criar `ReuseQuizQuestionsUseCase.ts`
  - Buscar questões salvas por filtros
  - Reutilizar em novos planos de aula

- [ ] **Serviço: QuizBankService**
  - Criar `QuizBankService.ts`
  - Gerenciar banco de questões
  - Estatísticas de uso de questões

### Planos de Aula Colaborativos
- [ ] **Use Case: ShareLessonPlan**
  - Criar `ShareLessonPlanUseCase.ts`
  - Compartilhar planos entre professores
  - Sistema de permissões (público/privado)

- [ ] **Use Case: AdaptLessonPlan**
  - Criar `AdaptLessonPlanUseCase.ts`
  - Copiar e adaptar planos compartilhados
  - Histórico de adaptações

- [ ] **Serviço: CollaborationService**
  - Criar `CollaborationService.ts`
  - Gerenciar compartilhamento
  - Biblioteca de planos públicos

### Feedback Formativo
- [ ] **Melhorar: AnalyzePerformanceUseCase**
  - Expandir feedback da IA
  - Sugestões específicas por área de conhecimento
  - Comentários pedagógicos detalhados

- [ ] **Use Case: GenerateFormativeFeedback**
  - Criar `GenerateFormativeFeedbackUseCase.ts`
  - Feedback não apenas por nota, mas por competência
  - Sugestões de reforço personalizadas

---

## 🤖 **layer/infrastructure** + **feature/rag-implementation** - Inteligência Artificial

### Explicabilidade da IA
- [ ] **Serviço: ExplainabilityService**
  - Criar `ExplainabilityService.ts`
  - Rastrear quais trechos da BNCC foram usados
  - Mostrar contexto RAG utilizado na geração

- [ ] **Componente: AIExplanationPanel**
  - Exibir fontes e referências BNCC
  - Mostrar trechos do RAG utilizados
  - Visualização de confiança da IA

### Refinamento Iterativo
- [ ] **Melhorar: GeminiServiceWithRAG**
  - Expandir método `refinePlan` existente
  - Suportar múltiplas iterações
  - Histórico de refinamentos

- [ ] **Use Case: RefineLessonPlanIteratively**
  - Criar `RefineLessonPlanIterativelyUseCase.ts`
  - Interface conversacional para refinamento
  - Preview antes de aplicar mudanças

### IA Multimodal
- [ ] **Serviço: MultimodalAIService**
  - Criar `MultimodalAIService.ts`
  - Integração com Gemini Vision para imagens
  - Geração de diagramas e mapas conceituais

- [ ] **Use Case: GenerateVisualContent**
  - Criar `GenerateVisualContentUseCase.ts`
  - Gerar imagens simples para aulas
  - Diagramas automáticos baseados no conteúdo

- [ ] **Componente: VisualContentGenerator**
  - Interface para gerar conteúdo visual
  - Preview de imagens geradas
  - Download de diagramas

---

## 📊 **layer/application** + **layer/core** - Gestão e Escalabilidade

### Dashboard Institucional (Fase 5 - Expandir)
- [ ] **Use Case: GetInstitutionalMetrics**
  - Expandir `InstitutionalPerformance` existente
  - Métricas avançadas por turma/disciplina
  - Tendências temporais

- [ ] **Use Case: IdentifyAtRiskStudents**
  - Criar `IdentifyAtRiskStudentsUseCase.ts`
  - Algoritmo de identificação de risco
  - Critérios: notas, frequência, engajamento

- [ ] **Use Case: SuggestInterventions**
  - Criar `SuggestInterventionsUseCase.ts`
  - Sugestões de intervenções pedagógicas
  - Baseado em análise de dados

### Exportação de Relatórios
- [ ] **Use Case: ExportReport**
  - Criar `ExportReportUseCase.ts`
  - Exportar para PDF (usar `jsPDF` ou `react-pdf`)
  - Exportar para Excel (usar `xlsx`)

- [ ] **Serviço: ReportService**
  - Criar `ReportService.ts`
  - Templates de relatórios
  - Geração de gráficos para relatórios

- [ ] **Componente: ReportExporter**
  - Interface para selecionar dados
  - Preview antes de exportar
  - Download de arquivos

### Alertas Inteligentes
- [ ] **Use Case: GenerateAlerts**
  - Criar `GenerateAlertsUseCase.ts`
  - Alertas automáticos para coordenadores
  - Notificações de alunos em risco

- [ ] **Serviço: AlertService**
  - Criar `AlertService.ts`
  - Gerenciar regras de alertas
  - Priorização de alertas

---

## 💾 **layer/repository** + **layer/core** - Persistência e Entidades

### Novas Entidades
- [ ] **Entidade: QuizQuestion**
  - Criar `src/core/entities/QuizQuestion.ts`
  - Questões reutilizáveis com tags
  - Metadados (dificuldade, tema, uso)

- [ ] **Entidade: SharedLessonPlan**
  - Criar `src/core/entities/SharedLessonPlan.ts`
  - Planos compartilhados
  - Permissões e colaboração

- [ ] **Entidade: Achievement**
  - Criar `src/core/entities/Achievement.ts`
  - Conquistas e badges
  - Progresso do aluno

- [ ] **Entidade: Alert**
  - Criar `src/core/entities/Alert.ts`
  - Alertas do sistema
  - Status e prioridade

### Repositórios
- [ ] **Repository: QuizQuestionRepository**
  - Criar `IQuizQuestionRepository.ts` (interface)
  - Implementar `LocalStorageQuizQuestionRepository.ts`
  - CRUD de questões reutilizáveis

- [ ] **Repository: SharedLessonPlanRepository**
  - Criar `ISharedLessonPlanRepository.ts`
  - Implementar `LocalStorageSharedLessonPlanRepository.ts`
  - Gerenciar compartilhamento

- [ ] **Repository: AchievementRepository**
  - Criar `IAchievementRepository.ts`
  - Implementar `LocalStorageAchievementRepository.ts`
  - Progresso e conquistas

---

## 🎮 **layer/presentation** - Engajamento (Componentes)

### Componentes de Gamificação
- [ ] **Componente: AchievementBadge**
  - Badge de conquista animado
  - Progresso visual
  - Localização: `src/components/ui/AchievementBadge.tsx`

- [ ] **Componente: Leaderboard**
  - Ranking de turmas
  - Filtros e ordenação
  - Localização: `src/app/components/Leaderboard.tsx`

- [ ] **Componente: ChallengeCard**
  - Card de desafio semanal
  - Progresso e recompensas
  - Localização: `src/app/components/ChallengeCard.tsx`

### Componentes de Acessibilidade
- [ ] **Componente: TextToSpeech**
  - Leitura em voz alta
  - Controles de velocidade
  - Localização: `src/components/ui/TextToSpeech.tsx`

- [ ] **Componente: AccessibilityControls**
  - Controles de acessibilidade
  - Contraste, tamanho de fonte
  - Localização: `src/components/ui/AccessibilityControls.tsx`

### Componentes de Notificações
- [ ] **Componente: NotificationCenter**
  - Centro de notificações
  - Filtros e categorias
  - Localização: `src/app/components/NotificationCenter.tsx`

---

## 📝 Ordem de Implementação Sugerida

### Fase 1: Fundação (Core + Repository)
1. Criar novas entidades (`QuizQuestion`, `Achievement`, etc.)
2. Implementar repositórios correspondentes
3. Atualizar interfaces e tipos

### Fase 2: Lógica de Negócio (Application)
1. Implementar Use Cases de banco de questões
2. Implementar Use Cases de colaboração
3. Expandir feedback formativo
4. Implementar alertas e relatórios

### Fase 3: IA e RAG (Infrastructure)
1. Melhorar explicabilidade
2. Expandir refinamento iterativo
3. Implementar IA multimodal

### Fase 4: Interface (Presentation)
1. Componentes de acessibilidade
2. Design lúdico e mobile-first
3. Gamificação
4. Notificações

---

## 🔄 Checklist de Integração

Para cada funcionalidade implementada:
- [ ] Testes unitários (se aplicável)
- [ ] Integração com camadas existentes
- [ ] Documentação atualizada
- [ ] Validação de tipos TypeScript
- [ ] Responsividade mobile
- [ ] Acessibilidade (ARIA, navegação por teclado)

---

## 📌 Notas Importantes

1. **Não criar novas branches**: Usar apenas as branches existentes
2. **Manter Clean Architecture**: Respeitar separação de camadas
3. **TypeScript**: Tipagem forte em todas as implementações
4. **Mobile-First**: Priorizar experiência mobile
5. **Acessibilidade**: Seguir WCAG 2.1 nível AA
6. **Performance**: Lazy loading e code splitting quando necessário

---

**Última atualização**: 2026-01-16

---

## ✅ Status de Implementação

### Fase 1: Fundação - ✅ CONCLUÍDA
- [x] Criar novas entidades (ReusableQuizQuestion, Achievement, SharedLessonPlan, Alert)
- [x] Implementar interfaces de repositórios
- [x] Implementar repositórios LocalStorage
- [x] Atualizar StorageKeys

### Fase 2: Lógica de Negócio - ✅ CONCLUÍDA
- [x] Use Cases de banco de questões reutilizáveis
- [x] Use Cases de colaboração de planos
- [x] Feedback formativo expandido
- [x] Use Cases de alertas e intervenções

### Fase 3: IA e RAG - ✅ PARCIALMENTE CONCLUÍDA
- [x] Explicabilidade da IA (rastreamento BNCC e RAG)
- [x] Refinamento iterativo melhorado
- [ ] IA multimodal (geração de imagens/diagramas) - PENDENTE

### Fase 4: Interface - ✅ PARCIALMENTE CONCLUÍDA
- [x] Componentes de acessibilidade (TextToSpeech, AccessibilityControls)
- [x] Componentes de gamificação (AchievementBadge)
- [x] Componente de notificações (NotificationCenter)
- [ ] Design lúdico completo (mascotes, temas) - PENDENTE
- [ ] Mobile-first completo - PENDENTE
- [ ] PWA - PENDENTE

### Estatísticas
- **Total de arquivos criados**: 30+
- **Total de commits**: 7
- **Linhas de código adicionadas**: ~3.000+
