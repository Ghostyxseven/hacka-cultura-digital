# Implementação RAG (Retrieval Augmented Generation)

## 📋 Visão Geral

Esta implementação adiciona RAG (Retrieval Augmented Generation) ao sistema, enriquecendo a geração de planos de aula com contexto relevante da BNCC e diretrizes do MEC.

## 🏗️ Arquitetura

### Componentes

1. **IRAGService** - Interface para serviços de RAG
2. **SimpleRAGService** - Implementação simples usando busca textual
3. **BNCCKnowledge** - Base de conhecimento da BNCC (Competência 5: Cultura Digital)
4. **MECGuidelines** - Diretrizes do MEC sobre Cultura Digital na Educação Básica
5. **GeminiServiceWithRAG** - Serviço de IA integrado com RAG

### Fluxo

```
1. Usuário solicita geração de plano de aula
   ↓
2. SimpleRAGService recupera contexto relevante (BNCC/MEC)
   ↓
3. GeminiServiceWithRAG enriquece o prompt com contexto recuperado
   ↓
4. Google Gemini API gera plano de aula alinhado com BNCC/MEC
   ↓
5. Plano de aula validado e retornado
```

## 📁 Estrutura

```
src/infrastructure/rag/
├── IRAGService.ts              # Interface para serviços RAG
├── SimpleRAGService.ts         # Implementação básica com busca textual
├── knowledge/
│   ├── BNCCKnowledge.ts        # Base de conhecimento BNCC
│   └── MECGuidelines.ts        # Diretrizes MEC
└── README.md                   # Esta documentação
```

## 🔧 Como Usar

### Exemplo Básico

```typescript
import { SimpleRAGService } from '@/infrastructure/rag/SimpleRAGService';
import { GeminiServiceWithRAG } from '@/infrastructure/ai/GeminiServiceWithRAG';

// Criar serviço RAG
const ragService = new SimpleRAGService();

// Criar serviço de IA com RAG
const aiService = new GeminiServiceWithRAG(ragService);

// Gerar plano de aula com contexto RAG
const lessonPlan = await aiService.generate(
  'Matemática',
  'Equações do 2º grau',
  '8º Ano'
);
```

### Integração com LessonPlanService

Para usar RAG no sistema completo, modifique `src/lib/service.ts`:

```typescript
import { GeminiServiceWithRAG } from '../infrastructure/ai/GeminiServiceWithRAG';
import { SimpleRAGService } from '../infrastructure/rag/SimpleRAGService';

export function getLessonPlanService(): LessonPlanService {
  if (!serviceInstance) {
    const repository = LocalStorageRepository.getInstance();
    const ragService = new SimpleRAGService();
    const aiService = new GeminiServiceWithRAG(ragService);
    serviceInstance = new LessonPlanService(repository, aiService);
  }
  return serviceInstance;
}
```

## 📝 Implementação Atual

### SimpleRAGService

- **Método de busca**: Textual (substring matching)
- **Base de conhecimento**: BNCC + Diretrizes MEC
- **Limitação**: Busca textual simples (pode ser melhorada com embeddings)

### Melhorias Futuras

1. **Embeddings Vetoriais**
   - Usar embeddings para busca semântica mais precisa
   - Biblioteca: `@google-cloud/aiplatform` ou `openai`

2. **Vector Store**
   - Armazenar embeddings em vector database
   - Opções: Pinecone, Weaviate, Chroma

3. **Chunking Inteligente**
   - Dividir documentos em chunks relevantes
   - Melhorar recuperação de contexto

4. **Re-ranking**
   - Reordenar resultados por relevância
   - Melhorar qualidade do contexto recuperado

## ✅ Benefícios

1. **Alinhamento BNCC**: Garante que os planos seguem diretrizes oficiais
2. **Contexto Relevante**: Enriquece prompts com conhecimento específico
3. **Qualidade Pedagógica**: Melhora qualidade do material gerado
4. **Transparência**: Base de conhecimento explícita e auditável

## ⚠️ Limitações Atuais

1. **Busca Textual**: Implementação básica (não usa embeddings)
2. **Base Pequena**: Conhecimento limitado (pode ser expandido)
3. **Sem Cache**: Não há cache de buscas (pode ser adicionado)
4. **Fallback**: Em caso de erro, usa geração sem RAG

## 🔄 Migração

Para migrar do sistema atual (sem RAG) para com RAG:

1. **Mantém compatibilidade**: `GeminiService` original continua funcionando
2. **Opcional**: RAG pode ser desabilitado se necessário
3. **Fallback**: Sistema funciona mesmo se RAG falhar

## 📚 Referências

- [BNCC - Competência 5: Cultura Digital](https://www.gov.br/mec/pt-br)
- [Diretrizes MEC - Cultura Digital](https://www.gov.br/mec/pt-br)
- [RAG - Retrieval Augmented Generation](https://arxiv.org/abs/2005.11401)
