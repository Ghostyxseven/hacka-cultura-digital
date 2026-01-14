// src/infrastructure/pdf/ReactPDFGenerator.ts
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { LessonPlan } from '@/core/entities/LessonPlan';
import { IPDFGeneratorService, ProvaPDFOptions, SlidesPDFOptions } from './IPDFGeneratorService';

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

    // Slide 1: Título
    pages.push(
      <Page key="title" size="A4" style={styles.slidePage}>
        <View style={styles.slideTitleContainer}>
          <View style={styles.slideTitleBox}>
            <Text style={styles.slideTitle}>{lessonPlan.title}</Text>
            <View style={styles.slideTitleDivider} />
            <Text style={styles.slideSubtitle}>{lessonPlan.subject}</Text>
            <Text style={styles.slideInfo}>{lessonPlan.gradeYear}</Text>
          </View>
          {options.schoolName && (
            <View style={styles.slideFooterBox}>
              <Text style={styles.slideSchool}>{options.schoolName}</Text>
            </View>
          )}
        </View>
      </Page>
    );

    // Slide 2: Objetivos
    pages.push(
      <Page key="objectives" size="A4" style={styles.slidePage}>
        <View style={styles.slideContentContainer}>
          <View style={styles.slideHeaderBox}>
            <Text style={styles.slideSectionTitle}>🎯 Objetivos de Aprendizagem</Text>
          </View>
          <View style={styles.slideBodyBox}>
            {lessonPlan.objectives.map((objective, index) => (
              <View key={index} style={styles.slideBulletItem}>
                <Text style={styles.slideBulletDot}>•</Text>
                <Text style={styles.slideBulletText}>{objective}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    );

    // Slides de Conteúdo (dividido em parágrafos)
    const contentParagraphs = lessonPlan.content.split('\n\n').filter(p => p.trim());
    contentParagraphs.forEach((paragraph, index) => {
      pages.push(
        <Page key={`content-${index}`} size="A4" style={styles.slidePage}>
          <View style={styles.slideContentContainer}>
            <View style={styles.slideHeaderBox}>
              <Text style={styles.slideSectionTitle}>📚 Conteúdo</Text>
            </View>
            <View style={styles.slideBodyBox}>
              <Text style={styles.slideText}>{paragraph.trim()}</Text>
            </View>
          </View>
        </Page>
      );
    });

    // Slide: Metodologia
    if (lessonPlan.methodology) {
      const methodologyParagraphs = lessonPlan.methodology.split('\n\n').filter(p => p.trim());
      methodologyParagraphs.forEach((paragraph, index) => {
        pages.push(
          <Page key={`methodology-${index}`} size="A4" style={styles.slidePage}>
            <View style={styles.slideContentContainer}>
              <View style={styles.slideHeaderBox}>
                <Text style={styles.slideSectionTitle}>📝 Metodologia</Text>
              </View>
              <View style={styles.slideBodyBox}>
                <Text style={styles.slideText}>{paragraph.trim()}</Text>
              </View>
            </View>
          </Page>
        );
      });
    }

    // Slide: Competências BNCC
    if (lessonPlan.bnccCompetencies.length > 0) {
      pages.push(
        <Page key="bncc" size="A4" style={styles.slidePage}>
          <View style={styles.slideContentContainer}>
            <View style={styles.slideHeaderBox}>
              <Text style={styles.slideSectionTitle}>✅ Competências BNCC</Text>
            </View>
            <View style={styles.slideBodyBox}>
              {lessonPlan.bnccCompetencies.map((competency, index) => (
                <View key={index} style={styles.slideBulletItem}>
                  <Text style={styles.slideBulletDot}>✓</Text>
                  <Text style={styles.slideBulletText}>{competency}</Text>
                </View>
              ))}
            </View>
          </View>
        </Page>
      );
    }

    // Slide: Quiz (opcional)
    if (options.includeQuiz && lessonPlan.quiz.length > 0) {
      lessonPlan.quiz.forEach((question, index) => {
        pages.push(
          <Page key={`quiz-${index}`} size="A4" style={styles.slidePage}>
            <View style={styles.slideContentContainer}>
              <View style={styles.slideHeaderBox}>
                <Text style={styles.slideSectionTitle}>✏️ Questão {index + 1}</Text>
              </View>
              <View style={styles.slideBodyBox}>
                <Text style={styles.slideQuizQuestion}>{question.question}</Text>
                <View style={styles.slideQuizOptions}>
                  {question.options.map((option, optIndex) => (
                    <View key={optIndex} style={styles.slideQuizOptionItem}>
                      <Text style={styles.slideQuizOptionLetter}>
                        {String.fromCharCode(65 + optIndex)})
                      </Text>
                      <Text style={styles.slideQuizOptionText}>{option}</Text>
                    </View>
                  ))}
                </View>
              </View>
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
    justifyContent: 'center',
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
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#1e3a8a',
    lineHeight: 1.2,
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
    marginBottom: 30,
    paddingBottom: 15,
    borderBottom: '3 solid #3b82f6',
  },
  slideBodyBox: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-start',
  },
  slideSectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'left',
  },
  slideText: {
    fontSize: 18,
    lineHeight: 1.8,
    color: '#1e293b',
    textAlign: 'justify',
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
    fontSize: 18,
    lineHeight: 1.7,
    color: '#1e293b',
    flex: 1,
    textAlign: 'left',
  },
  slideQuizQuestion: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#1e3a8a',
    lineHeight: 1.6,
    textAlign: 'left',
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
    fontSize: 17,
    lineHeight: 1.6,
    color: '#1e293b',
    flex: 1,
    textAlign: 'left',
  },
});
