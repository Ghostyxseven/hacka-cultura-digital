/**
 * Utilitários para exportação de materiais didáticos
 * Suporta múltiplos formatos: PDF, Markdown, Word (HTML para conversão)
 */

import type { LessonPlan, Activity } from '@/application/viewmodels';

/**
 * Exporta plano de aula e atividade em formato Markdown
 */
export function exportToMarkdown(lessonPlan: LessonPlan, activity: Activity | null): string {
  let markdown = `# ${lessonPlan.title}\n\n`;

  // Metadados
  markdown += `**Duração:** ${lessonPlan.duration} minutos\n\n`;
  markdown += `---\n\n`;

  // Objetivo
  markdown += `## 📌 Objetivo\n\n${lessonPlan.objective}\n\n`;
  markdown += `---\n\n`;

  // Conteúdo
  markdown += `## 📚 Conteúdo\n\n${lessonPlan.content}\n\n`;
  markdown += `---\n\n`;

  // Metodologia
  markdown += `## 📖 Metodologia\n\n${lessonPlan.methodology}\n\n`;
  markdown += `---\n\n`;

  // Recursos
  if (lessonPlan.resources && lessonPlan.resources.length > 0) {
    markdown += `## 🔧 Recursos\n\n`;
    lessonPlan.resources.forEach((resource) => {
      markdown += `- ${resource}\n`;
    });
    markdown += `\n---\n\n`;
  }

  // Avaliação
  markdown += `## ✅ Avaliação\n\n${lessonPlan.evaluation}\n\n`;
  markdown += `---\n\n`;

  // Alinhamento BNCC
  markdown += `## 🎯 Alinhamento BNCC\n\n${lessonPlan.bnccAlignment}\n\n`;

  // Atividade avaliativa
  if (activity) {
    markdown += `\n---\n\n`;
    markdown += `# ${activity.title}\n\n`;
    markdown += `**Tipo:** ${activity.type}\n\n`;
    markdown += `**Descrição:** ${activity.description}\n\n`;

    if (activity.instructions) {
      markdown += `## 📝 Instruções\n\n${activity.instructions}\n\n`;
    }

    if (activity.questions && activity.questions.length > 0) {
      markdown += `## ❓ Questões\n\n`;
      activity.questions.forEach((question, index) => {
        markdown += `### ${index + 1}. ${question.question} (${question.points} pontos)\n\n`;
        
        if (question.type === 'multiple_choice' && question.options) {
          question.options.forEach((option, optIndex) => {
            const isCorrect = option === question.correctAnswer;
            markdown += `${String.fromCharCode(97 + optIndex)}. ${option}${isCorrect ? ' ✓' : ''}\n`;
          });
        }
        
        if (question.correctAnswer && question.type !== 'multiple_choice') {
          markdown += `**Resposta correta:** ${question.correctAnswer}\n`;
        }
        
        markdown += `\n`;
      });
    }

    if (activity.evaluationCriteria) {
      markdown += `## 📋 Critérios de Avaliação\n\n${activity.evaluationCriteria}\n\n`;
    }
  }

  return markdown;
}

/**
 * Exporta plano de aula e atividade em formato HTML (para Word)
 */
export function exportToHTML(lessonPlan: LessonPlan, activity: Activity | null): string {
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${lessonPlan.title}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { color: #1e3a8a; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; }
    h2 { color: #1e40af; margin-top: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px; }
    h3 { color: #2563eb; margin-top: 20px; }
    ul { margin-left: 20px; }
    li { margin-bottom: 8px; }
    .metadata { background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .section { margin-bottom: 30px; }
    .question { background: #f9fafb; padding: 15px; border-left: 4px solid #6366f1; margin: 15px 0; border-radius: 4px; }
    .correct { color: #059669; font-weight: bold; }
  </style>
</head>
<body>
  <h1>${lessonPlan.title}</h1>
  
  <div class="metadata">
    <strong>Duração:</strong> ${lessonPlan.duration} minutos
  </div>

  <div class="section">
    <h2>📌 Objetivo</h2>
    <p>${lessonPlan.objective}</p>
  </div>

  <div class="section">
    <h2>📚 Conteúdo</h2>
    <p>${lessonPlan.content.replace(/\n/g, '<br>')}</p>
  </div>

  <div class="section">
    <h2>📖 Metodologia</h2>
    <p>${lessonPlan.methodology}</p>
  </div>`;

  if (lessonPlan.resources && lessonPlan.resources.length > 0) {
    html += `
  <div class="section">
    <h2>🔧 Recursos</h2>
    <ul>`;
    lessonPlan.resources.forEach((resource) => {
      html += `<li>${resource}</li>`;
    });
    html += `</ul>
  </div>`;
  }

  html += `
  <div class="section">
    <h2>✅ Avaliação</h2>
    <p>${lessonPlan.evaluation}</p>
  </div>

  <div class="section">
    <h2>🎯 Alinhamento BNCC</h2>
    <p>${lessonPlan.bnccAlignment}</p>
  </div>`;

  if (activity) {
    html += `
  <hr style="margin: 40px 0; border: 1px solid #e5e7eb;">
  <h1>${activity.title}</h1>
  <div class="metadata">
    <strong>Tipo:</strong> ${activity.type}<br>
    <strong>Descrição:</strong> ${activity.description}
  </div>`;

    if (activity.instructions) {
      html += `
  <div class="section">
    <h2>📝 Instruções</h2>
    <p>${activity.instructions}</p>
  </div>`;
    }

    if (activity.questions && activity.questions.length > 0) {
      html += `
  <div class="section">
    <h2>❓ Questões</h2>`;
      activity.questions.forEach((question, index) => {
        html += `
    <div class="question">
      <h3>${index + 1}. ${question.question} <small>(${question.points} pontos)</small></h3>`;
        
        if (question.type === 'multiple_choice' && question.options) {
          question.options.forEach((option, optIndex) => {
            const isCorrect = option === question.correctAnswer;
            html += `
      <p>${String.fromCharCode(97 + optIndex)}. ${option}${isCorrect ? ' <span class="correct">✓</span>' : ''}</p>`;
          });
        }
        
        if (question.correctAnswer && question.type !== 'multiple_choice') {
          html += `
      <p><strong>Resposta correta:</strong> ${question.correctAnswer}</p>`;
        }
        
        html += `
    </div>`;
      });
      html += `
  </div>`;
    }

    if (activity.evaluationCriteria) {
      html += `
  <div class="section">
    <h2>📋 Critérios de Avaliação</h2>
    <p>${activity.evaluationCriteria}</p>
  </div>`;
    }
  }

  html += `
</body>
</html>`;

  return html;
}

/**
 * Baixa arquivo com conteúdo especificado
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exporta para PDF (usando window.print)
 */
export function exportToPDF(content: string, title: string, callback: () => void) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Por favor, permita pop-ups para exportar o PDF');
  }

  printWindow.document.write(content);
  printWindow.document.close();
  
  setTimeout(() => {
    printWindow.print();
    callback();
  }, 250);
}
