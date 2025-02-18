import jsPDF from 'jspdf';
import { surveyData } from '../data/surveyData';

export function generateSurveyPDF() {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('Business English Survey', 20, 20);

  surveyData.sections.forEach((section, sectionIndex) => {
    doc.setFontSize(14);
    doc.text(`${sectionIndex + 1}. ${section.title}`, 20, 30 + sectionIndex * 10);

    section.modules.forEach((module, moduleIndex) => {
      doc.setFontSize(12);
      doc.text(`  ${sectionIndex + 1}.${moduleIndex + 1} ${module.title}`, 20, 40 + sectionIndex * 10 + moduleIndex * 10);

      module.questions.forEach((question, questionIndex) => {
        doc.setFontSize(10);
        doc.text(`    ${sectionIndex + 1}.${moduleIndex + 1}.${questionIndex + 1} ${question.text}`, 20, 50 + sectionIndex * 10 + moduleIndex * 10 + questionIndex * 5);
      });
    });
  });

  doc.save('Business_English_Survey.pdf');
}
