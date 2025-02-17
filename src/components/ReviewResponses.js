import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'framer-motion';
import { surveyData, importanceOptions } from '../data/surveyData';

const ReviewResponses = ({ responses }) => {
  const getImportanceLabel = (value) => {
    const option = importanceOptions.find(opt => opt.value === value);
    return option ? option.label : '';
  };

  const getImportanceColor = (value) => {
    const colors = {
      'totally-unimportant': 'error',
      'slightly-unimportant': 'warning',
      'neutral': 'default',
      'important': 'info',
      'very-important': 'success'
    };
    return colors[value] || 'default';
  };

  return (
    <Box component={motion.div} 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h5" gutterBottom>
        Review Your Responses
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Please review your responses before submitting. You can go back to any section to make changes.
      </Typography>

      {surveyData.sections.map((section, sectionIndex) => (
        <Paper 
          key={section.id} 
          sx={{ mb: 2 }}
          component={motion.div}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
        >
          <Accordion defaultExpanded={sectionIndex === 0}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
              }}
            >
              <Typography variant="h6">
                {section.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {section.modules.map(module => (
                  <Box key={module.id} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {module.title}
                    </Typography>
                    {module.subModules ? (
                      module.subModules.map(subModule => (
                        <Box key={subModule.id} sx={{ ml: 2, mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {subModule.title}
                          </Typography>
                          {subModule.skills.map((skill, index) => {
                            const responseKey = `${subModule.id}_${index}`;
                            const response = responses[responseKey];
                            return (
                              <ListItem key={responseKey}>
                                <ListItemText
                                  primary={skill}
                                  secondary={
                                    response ? (
                                      <Chip
                                        label={getImportanceLabel(response)}
                                        color={getImportanceColor(response)}
                                        size="small"
                                        sx={{ mt: 1 }}
                                      />
                                    ) : (
                                      <Typography variant="caption" color="error">
                                        No response provided
                                      </Typography>
                                    )
                                  }
                                />
                              </ListItem>
                            );
                          })}
                        </Box>
                      ))
                    ) : (
                      module.skills.map((skill, index) => {
                        const responseKey = `${module.id}_${index}`;
                        const response = responses[responseKey];
                        return (
                          <ListItem key={responseKey}>
                            <ListItemText
                              primary={skill}
                              secondary={
                                response ? (
                                  <Chip
                                    label={getImportanceLabel(response)}
                                    color={getImportanceColor(response)}
                                    size="small"
                                    sx={{ mt: 1 }}
                                  />
                                ) : (
                                  <Typography variant="caption" color="error">
                                    No response provided
                                  </Typography>
                                )
                              }
                            />
                          </ListItem>
                        );
                      })
                    )}
                  </Box>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </Paper>
      ))}
    </Box>
  );
};

export default ReviewResponses;
