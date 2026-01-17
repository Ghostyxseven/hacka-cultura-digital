# Melhorias na Geração de Conteúdos

## 📊 Análise Atual

### Pontos Fortes:
- ✅ Sistema RAG com BNCC bem implementado
- ✅ Prompts detalhados com instruções claras
- ✅ Detecção de truncamento e retry automático
- ✅ Cache para melhorar performance
- ✅ Fallback para conteúdo básico em caso de erro

### Pontos a Melhorar:

#### 🔴 **ALTA PRIORIDADE**

1. **Validação pós-geração**
   - Problema: Conteúdo gerado não é validado antes de salvar
   - Impacto: Podem ser salvos conteúdos incompletos ou mal formatados
   - Solução: Validar estrutura JSON, campos obrigatórios, códigos BNCC

2. **Limite de conteúdo muito restritivo**
   - Problema: `MAX_CONTENT_LENGTH = 2000` no LessonPlan é muito pequeno
   - Impacto: Conteúdos detalhados podem ser cortados
   - Solução: Aumentar para 10000+ caracteres

3. **Campos não salvos na Activity**
   - Problema: `bnccSkill` das questões não é salvo na entidade
   - Impacto: Perde-se informação importante de alinhamento BNCC
   - Solução: Adicionar campo `bnccSkill` em `ActivityQuestion`

4. **Parse de JSON frágil**
   - Problema: Regex pode capturar JSON parcial ou inválido
   - Impacto: Erros de parsing resultam em conteúdo genérico
   - Solução: Validar JSON completo e tratar erros melhor

#### 🟡 **MÉDIA PRIORIDADE**

5. **Validação de códigos BNCC**
   - Problema: Não verifica se códigos BNCC mencionados são válidos
   - Impacto: Podem ser gerados códigos inexistentes
   - Solução: Validar códigos contra lista de competências BNCC

6. **Enriquecimento do contexto BNCC**
   - Problema: Contexto pode ser genérico para temas específicos
   - Impacto: Conteúdo menos relevante
   - Solução: Melhorar matching de competências por tema

7. **Formatação Markdown consistente**
   - Problema: Conteúdo pode vir sem formatação adequada
   - Impacto: Exibição inconsistente
   - Solução: Normalizar formatação markdown

8. **Estrutura de slides mais rica**
   - Problema: Slides têm estrutura limitada (title, content, type)
   - Impacto: Slides menos informativos
   - Solução: Adicionar campos: notes, images, animations

#### 🟢 **BAIXA PRIORIDADE**

9. **Re-geração parcial**
   - Problema: Precisa re-gerar conteúdo inteiro para corrigir partes
   - Impacto: Ineficiente e desperdício de tokens
   - Solução: Permitir re-gerar seções específicas

10. **Métricas de qualidade**
    - Problema: Não há feedback sobre qualidade do conteúdo gerado
    - Impacto: Dificulta melhorias contínuas
    - Solução: Adicionar validação de qualidade (completude, alinhamento BNCC)

11. **Templates personalizáveis**
    - Problema: Estrutura fixa para todos os conteúdos
    - Impacto: Menos flexibilidade
    - Solução: Permitir templates customizáveis

12. **Versões de conteúdo**
    - Problema: Não há histórico de versões geradas
    - Impacto: Não é possível reverter ou comparar
    - Solução: Salvar histórico de gerações

---

## 🎯 Melhorias Prioritárias Recomendadas

### 1. Validação Pós-Geração (ALTA)
- Validar estrutura JSON completa
- Verificar campos obrigatórios preenchidos
- Validar códigos BNCC mencionados
- Verificar tamanho mínimo de conteúdo

### 2. Aumentar Limites (ALTA)
- `MAX_CONTENT_LENGTH`: 2000 → 10000
- `MAX_DESCRIPTION_LENGTH`: 2000 → 5000
- Permitir conteúdos mais detalhados

### 3. Campo `bnccSkill` em Questions (ALTA)
- Adicionar `bnccSkill?: string` em `ActivityQuestion`
- Salvar código BNCC de cada questão
- Exibir no frontend

### 4. Parse JSON Robusto (ALTA)
- Validar JSON completo antes de parse
- Extrair múltiplos objetos JSON se existirem
- Melhor tratamento de erros com mensagens específicas

### 5. Validação de Códigos BNCC (MÉDIA)
- Criar função de validação de códigos
- Verificar códigos no conteúdo gerado
- Alertar se códigos inválidos forem encontrados

---

## 📝 Estrutura de Implementação Sugerida

```typescript
// Validador de conteúdo gerado
class ContentValidator {
  validateLessonPlan(plan: Partial<LessonPlan>): ValidationResult
  validateActivity(activity: Partial<Activity>): ValidationResult
  validateSlides(slides: Slide[]): ValidationResult
  validateBNCCCodes(codes: string[]): ValidationResult
}

// Parser JSON robusto
class RobustJSONParser {
  parse(content: string): any
  extractJSONObjects(content: string): any[]
  validateJSONStructure(obj: any, schema: JSONSchema): boolean
}
```
