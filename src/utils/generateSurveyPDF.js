import jsPDF from 'jspdf';
import { surveyData } from '../data/surveyData';

export function generateSurveyPDF() {
  const doc = new jsPDF();
  let yPosition = 20;
  const margin = 20;
  const lineHeight = 10;

  // Title
  doc.setFontSize(16);
  doc.text('Business English Survey', margin, yPosition);
  yPosition += lineHeight * 2;

  // Make sure sections exist
  if (surveyData && surveyData.sections && Array.isArray(surveyData.sections)) {
    surveyData.sections.forEach((section, sectionIndex) => {
      // Section title
      doc.setFontSize(14);
      doc.text(`${sectionIndex + 1}. ${section.title}`, margin, yPosition);
      yPosition += lineHeight;

      // Make sure modules exist
      if (section.modules && Array.isArray(section.modules)) {
        section.modules.forEach((module, moduleIndex) => {
          // Module title
          doc.setFontSize(12);
          doc.text(`  ${sectionIndex + 1}.${moduleIndex + 1} ${module.title}`, margin, yPosition);
          yPosition += lineHeight;

          // Make sure questions exist
          if (module.questions && Array.isArray(module.questions)) {
            module.questions.forEach((question, questionIndex) => {
              // Question text
              doc.setFontSize(10);
              
              // Split long questions into multiple lines
              const questionText = `    ${sectionIndex + 1}.${moduleIndex + 1}.${questionIndex + 1} ${question.text}`;
              const splitText = doc.splitTextToSize(questionText, 180); // 180 is the max width
              
              doc.text(splitText, margin, yPosition);
              yPosition += (splitText.length * 7); // Adjust spacing based on number of lines
            });
          }
          yPosition += lineHeight / 2;
        });
      }
      yPosition += lineHeight;

      // Add new page if we're running out of space
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
    });
  }

  doc.save('Business_English_Survey.pdf');
}
