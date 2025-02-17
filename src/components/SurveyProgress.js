import React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepButton,
  LinearProgress,
  Typography
} from '@mui/material';

const SurveyProgress = ({ 
  sections, 
  currentSection, 
  completedSections, 
  onSectionClick,
  responses 
}) => {
  // Calculate overall progress
  const totalQuestions = sections.reduce((total, section) => {
    return total + section.modules.reduce((moduleTotal, module) => {
      if (module.subModules) {
        return moduleTotal + module.subModules.length;
      }
      return moduleTotal + 1;
    }, 0);
  }, 0);

  const answeredQuestions = Object.keys(responses).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" sx={{ mr: 1 }}>
          Overall Progress: {Math.round(progress)}%
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            flexGrow: 1,
            height: 8,
            borderRadius: 4
          }}
        />
      </Box>

      <Stepper 
        nonLinear 
        activeStep={currentSection}
        sx={{ 
          flexWrap: 'wrap',
          '& .MuiStep-root': {
            mb: 1
          }
        }}
      >
        {sections.map((section, index) => {
          const isCompleted = completedSections.includes(index);
          return (
            <Step key={section.id} completed={isCompleted}>
              <StepButton
                onClick={() => onSectionClick(index)}
                sx={{
                  '& .MuiStepLabel-label': {
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }
                }}
              >
                {`Section ${index + 1}`}
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default SurveyProgress;
