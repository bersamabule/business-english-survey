import React from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';

const SurveySection = ({ section, responses, onResponseChange }) => {
  const handleResponseChange = (moduleId, value) => {
    onResponseChange(moduleId, value);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        {section.title}
      </Typography>
      
      {section.modules.map((module, moduleIndex) => (
        <Paper key={moduleIndex} sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {module.title}
          </Typography>
          
          {module.subModules ? (
            // Handle modules with submodules
            module.subModules.map((subModule, subIndex) => (
              <Box key={subIndex} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {subModule.title}
                </Typography>
                
                <List>
                  {subModule.skills.map((skill, skillIndex) => (
                    <ListItem key={skillIndex}>
                      <ListItemText primary={`• ${skill}`} />
                    </ListItem>
                  ))}
                </List>

                <FormControl component="fieldset">
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    How important is it for you to develop these skills?
                  </Typography>
                  <RadioGroup
                    row
                    value={responses[subModule.id] || ''}
                    onChange={(e) => handleResponseChange(subModule.id, e.target.value)}
                  >
                    <FormControlLabel
                      value="very-important"
                      control={<Radio />}
                      label="Very Important"
                    />
                    <FormControlLabel
                      value="important"
                      control={<Radio />}
                      label="Important"
                    />
                    <FormControlLabel
                      value="neutral"
                      control={<Radio />}
                      label="Neutral"
                    />
                    <FormControlLabel
                      value="slightly-unimportant"
                      control={<Radio />}
                      label="Slightly Unimportant"
                    />
                    <FormControlLabel
                      value="totally-unimportant"
                      control={<Radio />}
                      label="Totally Unimportant"
                    />
                  </RadioGroup>
                </FormControl>
                {subIndex < module.subModules.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))
          ) : (
            // Handle standalone modules
            <Box>
              <List>
                {module.skills.map((skill, skillIndex) => (
                  <ListItem key={skillIndex}>
                    <ListItemText primary={`• ${skill}`} />
                  </ListItem>
                ))}
              </List>

              <FormControl component="fieldset">
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  How important is it for you to develop these skills?
                </Typography>
                <RadioGroup
                  row
                  value={responses[module.id] || ''}
                  onChange={(e) => handleResponseChange(module.id, e.target.value)}
                >
                  <FormControlLabel
                    value="very-important"
                    control={<Radio />}
                    label="Very Important"
                  />
                  <FormControlLabel
                    value="important"
                    control={<Radio />}
                    label="Important"
                  />
                  <FormControlLabel
                    value="neutral"
                    control={<Radio />}
                    label="Neutral"
                  />
                  <FormControlLabel
                    value="slightly-unimportant"
                    control={<Radio />}
                    label="Slightly Unimportant"
                  />
                  <FormControlLabel
                    value="totally-unimportant"
                    control={<Radio />}
                    label="Totally Unimportant"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          )}
        </Paper>
      ))}
    </Box>
  );
};

export default SurveySection;
