import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { surveyData } from '../data/surveyData';

const ResponseReview = ({ responses }) => {
  const getImportanceColor = (response) => {
    switch (response) {
      case 'very-important':
        return 'error';
      case 'important':
        return 'warning';
      case 'neutral':
        return 'info';
      case 'slightly-unimportant':
      case 'totally-unimportant':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatResponse = (response) => {
    if (!response) return 'No response provided';
    return response.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Response Review
      </Typography>
      
      {surveyData.sections.map((section, sIndex) => (
        <Paper key={sIndex} sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {section.title}
          </Typography>
          
          <List>
            {section.modules.map((module, mIndex) => (
              <React.Fragment key={mIndex}>
                {module.subModules ? (
                  // Handle modules with submodules
                  module.subModules.map((subModule, subIndex) => (
                    <ListItem key={subIndex} alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1">
                              {subModule.title}
                            </Typography>
                            <Chip
                              label={formatResponse(responses[subModule.id])}
                              color={getImportanceColor(responses[subModule.id])}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <List dense>
                            {subModule.skills.map((skill, skillIndex) => (
                              <ListItem key={skillIndex}>
                                <ListItemText
                                  primary={`• ${skill}`}
                                />
                              </ListItem>
                            ))}
                          </List>
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  // Handle standalone modules
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1">
                            {module.title}
                          </Typography>
                          <Chip
                            label={formatResponse(responses[module.id])}
                            color={getImportanceColor(responses[module.id])}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <List dense>
                          {module.skills.map((skill, skillIndex) => (
                            <ListItem key={skillIndex}>
                              <ListItemText
                                primary={`• ${skill}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      }
                    />
                  </ListItem>
                )}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ))}
    </Box>
  );
};

export default ResponseReview;
