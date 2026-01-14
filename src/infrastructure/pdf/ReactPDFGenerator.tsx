// src/infrastructure/pdf/ReactPDFGenerator.ts
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { LessonPlan } from '@/core/entities/LessonPlan';
import { IPDFGeneratorService, ProvaPDFOptions, SlidesPDFOptions } from './IPDFGeneratorService';

/**
 * Limpeza completa de texto: remove hífens órfãos, quebras e caracteres não suportados
 */
const cleanText = (text: string): string => {
  return text
    // 1. Remove hifens seguidos de quebra de linha (hifenização artificial) - preserva palavra completa
    .replace(/([a-záàâãéèêíïóôõöúç])-\s*\n\s*/gi, '$1 ')
    // 2. Remove hifens no meio de palavras quando seguidos de espaço (hífen órfão)
    // Exemplo: "exclu-sivamente" -> "exclusivamente"
    .replace(/([a-záàâãéèêíïóôõöúç])-\s+([a-záàâãéèêíïóôõöúç])/gi, '$1$2')
    // 3. Remove hifens que aparecem no final de linha antes de espaço
    .replace(/([a-záàâãéèêíïóôõöúç])-\s/g, '$1 ')
    // 4. Transforma quebras de linha simples em espaços
    .replace(/\n/g, ' ')
    // 5. Remove caracteres não-suportados (como os emojis corrompidos)
    .replace(/[^\x20-\x7EáàâãéèêíïóôõöúçÑñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇ]/g, '')
    // 6. Limpa espaços duplos
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Divide parágrafos em chunks evitando cortes no meio de palavras
 */
const getParagraphChunks = (text: string, limit: number = 700): string[] => {
  const sanitized = cleanText(text);
  const chunks: string[] = [];
  let currentPos = 0;

  while (currentPos < sanitized.length) {
    let endPos = currentPos + limit;
    
    if (endPos < sanitized.length) {
      // Garante que não corte no meio de uma palavra
      endPos = sanitized.lastIndexOf(' ', endPos);
      if (endPos === -1 || endPos <= currentPos) {
        // Se não encontrou espaço, corta no limite mesmo
        endPos = currentPos + limit;
      }
    }
    
    chunks.push(sanitized.substring(currentPos, endPos).trim());
    currentPos = endPos;
    
    // Pula espaços iniciais do próximo chunk
    while (sanitized[currentPos] === ' ' && currentPos < sanitized.length) {
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
