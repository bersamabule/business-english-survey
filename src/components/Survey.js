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
import { supabase } from '../utils/supabaseClient';
import { generateSurveyPDF } from '../utils/generateSurveyPDF';

async function sendEmailReport(clientName, surveyData) {
  console.log('Attempting to send email for:', clientName);
  try {
    const { data, error } = await supabase.functions.invoke('send-survey-email', {
      body: {
        to: 'andrew@woburnforum.com',
        subject: `Survey Completed by ${clientName}`,
        content: {
          clientName,
          surveyData: JSON.stringify(surveyData, null, 2)
        }
      }
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    console.log('Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
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
