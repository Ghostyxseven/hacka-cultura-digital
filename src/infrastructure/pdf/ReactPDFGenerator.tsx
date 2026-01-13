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
          <Text style={styles.slideTitle}>{lessonPlan.title}</Text>
          <Text style={styles.slideSubtitle}>{lessonPlan.subject}</Text>
          <Text style={styles.slideInfo}>{lessonPlan.gradeYear}</Text>
          {options.schoolName && (
            <Text style={styles.slideSchool}>{options.schoolName}</Text>
          )}
        </View>
      </Page>
    );

    // Slide 2: Objetivos
    pages.push(
      <Page key="objectives" size="A4" style={styles.slidePage}>
        <View style={styles.slideContent}>
          <Text style={styles.slideSectionTitle}>Objetivos de Aprendizagem</Text>
          {lessonPlan.objectives.map((objective, index) => (
            <Text key={index} style={styles.slideBullet}>
              • {objective}
            </Text>
          ))}
        </View>
      </Page>
    );

    // Slides de Conteúdo (dividido em parágrafos)
    const contentParagraphs = lessonPlan.content.split('\n\n').filter(p => p.trim());
    contentParagraphs.forEach((paragraph, index) => {
      pages.push(
        <Page key={`content-${index}`} size="A4" style={styles.slidePage}>
          <View style={styles.slideContent}>
            <Text style={styles.slideSectionTitle}>Conteúdo</Text>
            <Text style={styles.slideText}>{paragraph.trim()}</Text>
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
            <View style={styles.slideContent}>
              <Text style={styles.slideSectionTitle}>Metodologia</Text>
              <Text style={styles.slideText}>{paragraph.trim()}</Text>
            </View>
          </Page>
        );
      });
    }

    // Slide: Competências BNCC
    if (lessonPlan.bnccCompetencies.length > 0) {
      pages.push(
        <Page key="bncc" size="A4" style={styles.slidePage}>
          <View style={styles.slideContent}>
            <Text style={styles.slideSectionTitle}>Competências BNCC</Text>
            {lessonPlan.bnccCompetencies.map((competency, index) => (
              <Text key={index} style={styles.slideBullet}>
                • {competency}
              </Text>
            ))}
          </View>
        </Page>
      );
    }

    // Slide: Quiz (opcional)
    if (options.includeQuiz && lessonPlan.quiz.length > 0) {
      lessonPlan.quiz.forEach((question, index) => {
        pages.push(
          <Page key={`quiz-${index}`} size="A4" style={styles.slidePage}>
            <View style={styles.slideContent}>
              <Text style={styles.slideSectionTitle}>
                Questão {index + 1}
              </Text>
              <Text style={styles.slideText}>{question.question}</Text>
              <View style={styles.slideQuizOptions}>
                {question.options.map((option, optIndex) => (
                  <Text key={optIndex} style={styles.slideQuizOption}>
                    {String.fromCharCode(65 + optIndex)}) {option}
                  </Text>
                ))}
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
    padding: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideTitleContainer: {
    alignItems: 'center',
  },
  slideTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  slideSubtitle: {
    fontSize: 24,
    marginBottom: 10,
    color: '#333',
  },
  slideInfo: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666',
  },
  slideSchool: {
    fontSize: 14,
    marginTop: 40,
    color: '#999',
  },
  slideContent: {
    width: '100%',
  },
  slideSectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2563eb',
  },
  slideText: {
    fontSize: 14,
    lineHeight: 1.6,
    marginBottom: 15,
  },
  slideBullet: {
    fontSize: 14,
    lineHeight: 1.8,
    marginBottom: 10,
    marginLeft: 20,
  },
  slideQuizOptions: {
    marginTop: 20,
  },
  slideQuizOption: {
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 20,
  },
});
