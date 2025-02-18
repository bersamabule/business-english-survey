import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Container,
  Paper,
  TextField
} from '@mui/material';
import SurveySection from './SurveySection';
import ResponseReview from './ResponseReview';
import CurriculumRecommendation from './CurriculumRecommendation';
import { surveyData } from '../data/surveyData';
import { generateSurveyPDF } from '../utils/generateSurveyPDF';

async function sendEmailReport(clientName, surveyData) {
  console.log('Attempting to send email for:', clientName);
  try {
    if (!process.env.REACT_APP_RESEND_API_KEY) {
      throw new Error('Resend API key is not configured');
    }

    const emailContent = `
      <h1>Business English Survey Report</h1>
      <h2>Client: ${clientName}</h2>
      <h3>Survey Results:</h3>
      ${Object.entries(surveyData).map(([section, responses]) => `
        <h4>${section}</h4>
        <ul>
          ${Object.entries(responses).map(([skill, rating]) => `
            <li><strong>${skill}:</strong> ${rating}</li>
          `).join('')}
        </ul>
      `).join('')}
      <p>Generated on ${new Date().toLocaleString()}</p>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Business English Survey <survey@woburnforum.com>',
        to: 'andrew@woburnforum.com',
        subject: `Survey Results: ${clientName} - ${new Date().toLocaleDateString()}`,
        html: emailContent
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Email API error: ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
}

const Survey = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [clientName, setClientName] = useState('');
  const steps = ['Client Info', ...surveyData.sections.map(s => s.title), 'Review', 'Recommendations'];

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      console.log('Survey finished, sending email...');
      try {
        await sendEmailReport(clientName, responses);
        console.log('Email sent successfully');
      } catch (error) {
        console.error('Error sending email:', error);
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleClientNameChange = (event) => {
    setClientName(event.target.value);
  };

  const handleGeneratePDF = () => {
    generateSurveyPDF();
  };

  const getStepContent = (step) => {
    if (step === 0) {
      return (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Client Information
          </Typography>
          <TextField
            required
            label="Client Name"
            value={clientName}
            onChange={handleClientNameChange}
            fullWidth
            margin="normal"
          />
        </Paper>
      );
    }
    
    if (step <= surveyData.sections.length) {
      return (
        <SurveySection
          section={surveyData.sections[step - 1]}
          responses={responses}
          onResponseChange={handleResponseChange}
        />
      );
    }
    
    if (step === surveyData.sections.length + 1) {
      return <ResponseReview responses={responses} />;
    }
    
    return <CurriculumRecommendation responses={responses} clientName={clientName} />;
  };

  return (
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4 }}>
          {activeStep === steps.length ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>
                Survey Completed
              </Typography>
              <Button onClick={() => setActiveStep(0)}>
                Start New Survey
              </Button>
              <Button onClick={handleGeneratePDF} sx={{ ml: 2 }}>
                Download Survey as PDF
              </Button>
            </Box>
          ) : (
            <>
              {getStepContent(activeStep)}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={activeStep === 0 && !clientName.trim()}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Survey;
