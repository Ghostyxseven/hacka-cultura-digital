// src/infrastructure/pdf/ReactPDFGenerator.ts
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { LessonPlan } from '@/core/entities/LessonPlan';
import { IPDFGeneratorService, ProvaPDFOptions, SlidesPDFOptions } from './IPDFGeneratorService';

/**
 * Limpeza completa de texto: remove hífens órfãos, quebras e caracteres não suportados
 */
const cleanText = (text: string): string => {
  if (!text || typeof text !== 'string') return '';
  
  let cleaned = text
    // 1. Remove hifens seguidos de quebra de linha (hifenização artificial) - preserva palavra completa
    .replace(/([a-záàâãéèêíïóôõöúçA-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑñ\d])-\s*\n\s*/gi, '$1 ')
    // 2. Transforma quebras de linha simples em espaços
    .replace(/\n/g, ' ')
    // 3. Remove caracteres não-suportados (como os emojis corrompidos)
    .replace(/[^\x20-\x7EáàâãéèêíïóôõöúçÑñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇ]/g, '');
  
  // 4. Remove hífens órfãos (palavras quebradas no meio) - múltiplas passadas para pegar todos os casos
  // Exemplos: "atualiza-ção" -> "atualização", "exclu-sivamente" -> "exclusivamente"
  for (let i = 0; i < 5; i++) {
    cleaned = cleaned
      // Remove hífen seguido de espaço quando a palavra continua (hífen órfão)
      // Captura padrões como "palavra- ção" ou "palavra-mente"
      .replace(/([a-záàâãéèêíïóôõöúçA-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑñ\d])-\s+([a-záàâãéèêíïóôõöúçA-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑñ\d])/gi, '$1$2')
      // Remove hífen no final de palavra antes de espaço (quando não é hifenização válida)
      .replace(/([a-záàâãéèêíïóôõöúçA-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑñ\d])-\s+/g, '$1 ');
  }
  
  // 5. Garante espaço após palavras maiúsculas seguidas de minúsculas (ex: "CONTEÚDOonline" -> "CONTEÚDO online")
  // Usa lookbehind para não quebrar palavras que já têm espaço antes
  cleaned = cleaned.replace(/([A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑñÍ]{2,})([a-záàâãéèêíïóôõöúç])/g, '$1 $2');
  
  // 6. Remove hífens que ainda podem estar entre palavras (passada final)
  cleaned = cleaned.replace(/([a-záàâãéèêíïóôõöúçA-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑñ\d])-([a-záàâãéèêíïóôõöúçA-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑñ\d])/gi, '$1$2');
  
  // 7. Limpa espaços duplos e normaliza
  cleaned = cleaned
    .replace(/\s+/g, ' ')
    .trim();
  
  return cleaned;
};

/**
 * Divide parágrafos em chunks evitando cortes no meio de palavras e frases
 * Prioriza quebras em pontos finais, vírgulas e outros sinais de pontuação
 */
const getParagraphChunks = (text: string, limit: number = 700): string[] => {
  if (!text || typeof text !== 'string') return [];
  
  const sanitized = cleanText(text);
  const chunks: string[] = [];
  let currentPos = 0;

  while (currentPos < sanitized.length) {
    let endPos = currentPos + limit;
    
    if (endPos >= sanitized.length) {
      // Último chunk - pega o restante
      const remaining = sanitized.substring(currentPos).trim();
      if (remaining) {
        chunks.push(remaining);
      }
      break;
    }
    
    // Busca por pontos de quebra ideais (em ordem de preferência)
    // 1. Ponto final seguido de espaço (quebra ideal)
    let breakPoint = sanitized.lastIndexOf('. ', endPos);
    
    // 2. Dois pontos seguidos de espaço
    if (breakPoint === -1 || breakPoint <= currentPos) {
      breakPoint = sanitized.lastIndexOf(': ', endPos);
    }
    
    // 3. Ponto e vírgula seguido de espaço
    if (breakPoint === -1 || breakPoint <= currentPos) {
      breakPoint = sanitized.lastIndexOf('; ', endPos);
    }
    
    // 4. Vírgula seguida de espaço (mas só se não ficar muito curto)
    if (breakPoint === -1 || breakPoint <= currentPos) {
      const commaPos = sanitized.lastIndexOf(', ', endPos);
      // Só usa vírgula se o chunk não ficar muito curto (menos de 60% do limite)
      if (commaPos > currentPos && (commaPos - currentPos) >= limit * 0.6) {
        breakPoint = commaPos;
      }
    }
    
    // 5. Espaço (garante que não corte no meio de palavra)
    if (breakPoint === -1 || breakPoint <= currentPos) {
      breakPoint = sanitized.lastIndexOf(' ', endPos);
    }
    
    // 6. Se ainda não encontrou, tenta reduzir o limite em 20% e procurar novamente
    if (breakPoint === -1 || breakPoint <= currentPos) {
      const reducedLimit = Math.floor(limit * 0.8);
      endPos = currentPos + reducedLimit;
      breakPoint = sanitized.lastIndexOf(' ', endPos);
    }
    
    // 7. Último recurso: corta no limite mesmo (mas só se realmente necessário)
    if (breakPoint === -1 || breakPoint <= currentPos) {
      breakPoint = currentPos + limit;
    }
    
    // Evita deixar palavras muito curtas sozinhas no final (mínimo 3 caracteres)
    const chunk = sanitized.substring(currentPos, breakPoint).trim();
    const remainingAfterBreak = sanitized.substring(breakPoint).trim();
    
    // Se o próximo chunk começa com uma palavra muito curta, inclui no chunk atual
    if (remainingAfterBreak && remainingAfterBreak.length > 0) {
      const nextWordMatch = remainingAfterBreak.match(/^(\S{1,3})\s/);
      if (nextWordMatch && breakPoint < sanitized.length - 1) {
        // Estende o chunk para incluir a palavra curta
        const nextSpace = sanitized.indexOf(' ', breakPoint + 1);
        if (nextSpace !== -1) {
          breakPoint = nextSpace;
        }
      }
    }
    
    const finalChunk = sanitized.substring(currentPos, breakPoint).trim();
    if (finalChunk) {
      chunks.push(finalChunk);
    }
    
    currentPos = breakPoint;
    
    // Pula espaços, pontos, vírgulas e outros caracteres de pontuação iniciais
    while (currentPos < sanitized.length && 
           (sanitized[currentPos] === ' ' || 
            sanitized[currentPos] === '.' ||
            sanitized[currentPos] === ',' ||
            sanitized[currentPos] === ';' ||
            sanitized[currentPos] === ':')) {
      currentPos++;
    }
  }
  
  return chunks.length > 0 ? chunks : [sanitized];
};

/**
 * Implementação do gerador de PDF usando @react-pdf/renderer
 */
export class ReactPDFGenerator implements IPDFGeneratorService {
  async generateProvaPDF(
    lessonPlan: LessonPlan,
    options: ProvaPDFOptions = {}
  ): Promise<Buffer> {
    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Cabeçalho */}
          <View style={styles.header}>
            <Text style={styles.schoolName}>
              {options.schoolName || 'INSTITUTO FEDERAL DO PIAUÍ - IFPI'}
            </Text>
            <Text style={styles.title}>PROVA DE AVALIAÇÃO</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>Disciplina: {lessonPlan.subject}</Text>
              <Text style={styles.infoText}>Série: {lessonPlan.gradeYear}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>Tema: {lessonPlan.title}</Text>
              <Text style={styles.infoText}>
                Data: {new Date().toLocaleDateString('pt-BR')}
              </Text>
            </View>
            {options.studentName && (
              <Text style={styles.studentName}>Aluno(a): {options.studentName}</Text>
            )}
          </View>

          {/* Instruções */}
          <View style={styles.instructions}>
            <Text style={styles.instructionsTitle}>INSTRUÇÕES:</Text>
            <Text style={styles.instructionsText}>
              • Leia atentamente todas as questões antes de responder
            </Text>
            <Text style={styles.instructionsText}>
              • Marque apenas uma alternativa por questão
            </Text>
            <Text style={styles.instructionsText}>
              • A prova contém {lessonPlan.quiz.length} questões
            </Text>
          </View>

          {/* Questões */}
          <View style={styles.questions}>
            {lessonPlan.quiz.map((question, index) => (
              <View key={question.id} style={styles.question}>
                <Text style={styles.questionNumber}>
                  Questão {index + 1}:
                </Text>
                <Text style={styles.questionText}>{question.question}</Text>
                <View style={styles.options}>
                  {question.options.map((option, optIndex) => {
                    const isCorrect = optIndex === question.correctAnswer;
                    const showAnswer = options.includeAnswers && isCorrect;
                    
                    return (
                      <View
                        key={optIndex}
                        style={showAnswer ? [styles.option, styles.correctOption] : styles.option}
                      >
                        <Text style={styles.optionLetter}>
                          {String.fromCharCode(65 + optIndex)})
                        </Text>
                        <Text style={showAnswer ? [styles.optionText, styles.correctOptionText] : styles.optionText}>
                          {option}
                          {showAnswer && ' ✓'}
                        </Text>
                      </View>
                    );
                  })}
                </View>
                {options.includeAnswers && (
                  <Text style={styles.justification}>
                    Justificativa: {question.justification}
                  </Text>
                )}
              </View>
            ))}
          </View>

          {/* Rodapé */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Boa sorte!
            </Text>
          </View>
        </Page>
      </Document>
    );

    const blob = await pdf(doc).toBlob();
    const arrayBuffer = await blob.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  async generateSlidesPDF(
    lessonPlan: LessonPlan,
    options: SlidesPDFOptions = {}
  ): Promise<Buffer> {
    const pages: any[] = [];

    // Slide de Título (Landscape)
    pages.push(
      <Page key="title" size="A4" orientation="landscape" style={styles.slidePage}>
        <View style={styles.slideTitleContainer}>
          <View style={styles.slideTitleBox}>
            <Text style={styles.slideTitle}>{cleanText(lessonPlan.title)}</Text>
            <View style={styles.slideTitleDivider} />
            <Text style={styles.slideSubtitle}>{cleanText(lessonPlan.subject)}</Text>
            <Text style={styles.slideInfo}>{cleanText(lessonPlan.gradeYear)}</Text>
          </View>
          {options.schoolName && (
            <View style={styles.slideFooterBox}>
              <Text style={styles.slideSchool}>{cleanText(options.schoolName)}</Text>
            </View>
          )}
        </View>
      </Page>
    );

    // Slide: Objetivos
    pages.push(
      <Page key="objectives" size="A4" orientation="landscape" style={styles.slidePage}>
        <View style={styles.slideContentContainer}>
          <View style={styles.slideHeaderBox}>
            <Text style={styles.slideSectionTitle}>OBJETIVOS DE APRENDIZAGEM</Text>
          </View>
          <View style={styles.slideBodyBox}>
            {lessonPlan.objectives.map((objective, index) => (
              <View key={index} style={styles.slideBulletItem}>
                <Text style={styles.slideBulletDot}>•</Text>
                <Text style={styles.slideBulletText}>{cleanText(objective)}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.slidePageNumber}>Página {pages.length + 1}</Text>
        </View>
      </Page>
    );

    // Processamento de Conteúdo com Divisão Automática
    const contentSections = [
      { title: 'CONTEÚDO', data: lessonPlan.content },
      { title: 'METODOLOGIA', data: lessonPlan.methodology }
    ];

    contentSections.forEach(section => {
      if (!section.data) return;
      
      const textChunks = getParagraphChunks(section.data, 800);

      textChunks.forEach((chunk: string, chunkIndex: number) => {
        const pageNumber = pages.length + 1;
        pages.push(
          <Page key={`${section.title}-${chunkIndex}`} size="A4" orientation="landscape" style={styles.slidePage}>
            <View style={styles.slideContentContainer}>
              <View style={styles.slideHeaderBox}>
                <Text style={styles.slideSectionTitle}>{section.title}</Text>
              </View>
              <View style={styles.slideBodyBox}>
                <Text style={styles.slideText}>{chunk}</Text>
              </View>
              <Text style={styles.slidePageNumber}>Página {pageNumber}</Text>
            </View>
          </Page>
        );
      });
    });

    // Slide: Competências BNCC
    if (lessonPlan.bnccCompetencies.length > 0) {
      pages.push(
        <Page key="bncc" size="A4" orientation="landscape" style={styles.slidePage}>
          <View style={styles.slideContentContainer}>
            <View style={styles.slideHeaderBox}>
              <Text style={styles.slideSectionTitle}>COMPETÊNCIAS BNCC</Text>
            </View>
            <View style={styles.slideBodyBox}>
              {lessonPlan.bnccCompetencies.map((competency, index) => (
                <View key={index} style={styles.slideBulletItem}>
                  <Text style={styles.slideBulletDot}>✓</Text>
                  <Text style={styles.slideBulletText}>{cleanText(competency)}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.slidePageNumber}>Página {pages.length + 1}</Text>
          </View>
        </Page>
      );
    }

    // Slide: Quiz (opcional) - Layout em Duas Colunas
    if (options.includeQuiz && lessonPlan.quiz.length > 0) {
      lessonPlan.quiz.forEach((question, index) => {
        pages.push(
          <Page key={`quiz-${index}`} size="A4" orientation="landscape" style={styles.slidePage}>
            <View style={styles.slideContentContainer}>
              <View style={styles.slideHeaderBox}>
                <Text style={styles.slideSectionTitle}>QUESTÃO {index + 1}</Text>
              </View>
              <View style={styles.slideBodyBox}>
                <Text style={styles.slideQuizQuestion}>{cleanText(question.question)}</Text>
                {/* Grid de Alternativas em Duas Colunas */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 }}>
                  {question.options.map((option, optIndex) => (
                    <View key={optIndex} style={{ width: '48%', marginBottom: 12 }}>
                      <Text style={styles.slideQuizOptionText}>
                        <Text style={{ fontWeight: 'bold', color: '#3b82f6' }}>
                          {String.fromCharCode(65 + optIndex)}){' '}
                        </Text>
                        {cleanText(option).replace(/^[A-E]\)\s*/i, '')}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
              <Text style={styles.slidePageNumber}>Página {pages.length + 1}</Text>
            </View>
          </Page>
        );
      });
    }

    const doc = <Document>{pages}</Document>;
    const blob = await pdf(doc).toBlob();
    const arrayBuffer = await blob.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}

// Estilos para PDF
const styles = StyleSheet.create({
  // Estilos para Prova
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #000',
    paddingBottom: 10,
  },
  schoolName: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 10,
  },
  studentName: {
    fontSize: 11,
    marginTop: 10,
    fontWeight: 'bold',
  },
  instructions: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  instructionsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  instructionsText: {
    fontSize: 10,
    marginBottom: 3,
  },
  questions: {
    marginTop: 20,
  },
  question: {
    marginBottom: 20,
  },
  questionNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  questionText: {
    fontSize: 11,
    marginBottom: 10,
  },
  options: {
    marginLeft: 20,
  },
  option: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  correctOption: {
    backgroundColor: '#d4edda',
  },
  optionLetter: {
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 5,
  },
  optionText: {
    fontSize: 10,
  },
  correctOptionText: {
    fontWeight: 'bold',
    color: '#155724',
  },
  justification: {
    fontSize: 9,
    fontStyle: 'italic',
    marginTop: 5,
    marginLeft: 20,
    color: '#666',
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  // Estilos para Slides
  slidePage: {
    padding: 50,
    backgroundColor: '#ffffff',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  slideTitleContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  slideTitleBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
  },
  slideTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#1e3a8a',
    lineHeight: 1.4,
    maxWidth: '90%',
  },
  slideTitleDivider: {
    width: 120,
    height: 4,
    backgroundColor: '#3b82f6',
    marginBottom: 25,
    marginTop: 5,
  },
  slideSubtitle: {
    fontSize: 28,
    marginBottom: 12,
    color: '#1e40af',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  slideInfo: {
    fontSize: 20,
    marginTop: 8,
    color: '#64748b',
    textAlign: 'center',
  },
  slideFooterBox: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  slideSchool: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  slideContentContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  slideHeaderBox: {
    width: '100%',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: '4 solid #3b82f6',
  },
  slideBodyBox: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-start',
  },
  slideSectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'left',
  },
  slideText: {
    fontSize: 18,
    lineHeight: 1.6,
    color: '#1e293b',
    textAlign: 'left',
    maxWidth: '100%',
  },
  slideBulletItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
    width: '100%',
  },
  slideBulletDot: {
    fontSize: 20,
    color: '#3b82f6',
    marginRight: 12,
    marginTop: 2,
    fontWeight: 'bold',
  },
  slideBulletText: {
    fontSize: 15,
    lineHeight: 1.5,
    color: '#1e293b',
    flex: 1,
    textAlign: 'left',
    maxWidth: '100%',
  },
  slideQuizQuestion: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#1e3a8a',
    lineHeight: 1.4,
    textAlign: 'left',
    maxWidth: '100%',
  },
  slideQuizOptions: {
    marginTop: 20,
    width: '100%',
  },
  slideQuizOptionItem: {
    flexDirection: 'row',
    marginBottom: 18,
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderLeft: '4 solid #3b82f6',
  },
  slideQuizOptionLetter: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginRight: 12,
    minWidth: 25,
  },
  slideQuizOptionText: {
    fontSize: 14,
    lineHeight: 1.4,
    color: '#1e293b',
    flex: 1,
    textAlign: 'left',
    maxWidth: '100%',
  },
  slidePageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 50,
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'right',
  },
});
