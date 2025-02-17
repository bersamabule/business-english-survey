import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Chip,
  TableContainer
} from '@mui/material';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';
import { surveyData } from '../data/surveyData';
import DownloadIcon from '@mui/icons-material/Download';

const TOTAL_HOURS = 40;

const IMPORTANCE_WEIGHTS = {
  'very-important': 1.0,
  'important': 0.75,
  'neutral': 0.5,
  'slightly-unimportant': 0.25,
  'totally-unimportant': 0
};

// Helper functions
const getPriorityLevel = (weight) => {
  if (weight >= 0.8) return 'High Priority';
  if (weight >= 0.5) return 'Medium Priority';
  return 'Low Priority';
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High Priority':
      return 'error';
    case 'Medium Priority':
      return 'warning';
    case 'Low Priority':
      return 'info';
    default:
      return 'default';
  }
};

const calculateModuleScore = (module, responses) => {
  const responseKey = module.id;
  const response = responses[responseKey];
  const weight = response ? IMPORTANCE_WEIGHTS[response] : 0;
  
  const skillResponses = module.skills.map(skill => ({
    skill,
    response,
    weight
  }));

  return {
    weight,
    skillResponses
  };
};

const CurriculumRecommendation = ({ responses, clientName }) => {
  const calculateResponseRate = () => {
    let totalModules = 0;
    let answeredModules = 0;

    surveyData.sections.forEach(section => {
      section.modules.forEach(module => {
        if (module.subModules) {
          module.subModules.forEach(subModule => {
            totalModules++;
            if (responses[subModule.id]) {
              answeredModules++;
            }
          });
        } else {
          totalModules++;
          if (responses[module.id]) {
            answeredModules++;
          }
        }
      });
    });

    return (answeredModules / totalModules) * 100;
  };

  const analyzeSurveyResponses = () => {
    const moduleScores = [];
    let totalRecommendedHours = 0;
    const responseRate = calculateResponseRate();

    surveyData.sections.forEach(section => {
      section.modules.forEach(module => {
        if (module.subModules) {
          module.subModules.forEach(subModule => {
            const { weight, skillResponses } = calculateModuleScore(subModule, responses);
            if (weight > 0) {
              const recommendedHours = Math.ceil(weight * 2);
              totalRecommendedHours += recommendedHours;
              moduleScores.push({
                section: section.title,
                module: `${module.title} - ${subModule.title}`,
                priority: getPriorityLevel(weight),
                recommendedHours,
                responseRate: 100,
                skills: subModule.skills,
                skillResponses
              });
            }
          });
        } else {
          const { weight, skillResponses } = calculateModuleScore(module, responses);
          if (weight > 0) {
            const recommendedHours = Math.ceil(weight * 2);
            totalRecommendedHours += recommendedHours;
            moduleScores.push({
              section: section.title,
              module: module.title,
              priority: getPriorityLevel(weight),
              recommendedHours,
              responseRate: 100,
              skills: module.skills,
              skillResponses
            });
          }
        }
      });
    });

    moduleScores.sort((a, b) => {
      const priorityOrder = { 'High Priority': 3, 'Medium Priority': 2, 'Low Priority': 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      return priorityDiff !== 0 ? priorityDiff : a.module.localeCompare(b.module);
    });

    return {
      moduleScores,
      totalRecommendedHours,
      responseRate
    };
  };

  const handleExport = () => {
    const recommendations = analyzeSurveyResponses();
    const wb = XLSX.utils.book_new();

    // 1. Summary Sheet
    const summaryData = recommendations.moduleScores.map(rec => ({
      'Section': rec.section,
      'Module': rec.module,
      'Recommended Hours': rec.recommendedHours,
      'Priority Level': rec.priority,
      'Response Rate': `${Math.round(rec.responseRate)}%`,
      'Skills Covered': rec.skills.join(', ')
    }));
    const summaryWs = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

    // 2. Detailed Skills Sheet
    const skillsData = [];
    recommendations.moduleScores.forEach(rec => {
      rec.skillResponses.forEach(skill => {
        skillsData.push({
          'Section': rec.section,
          'Module': rec.module,
          'Skill': skill.skill,
          'Priority': getPriorityLevel(skill.weight),
          'Client Rating': skill.response || 'Not Rated'
        });
      });
    });
    const skillsWs = XLSX.utils.json_to_sheet(skillsData);
    XLSX.utils.book_append_sheet(wb, skillsWs, 'Detailed Skills');

    // 3. Learning Path Sheet
    const pathData = recommendations.moduleScores.map(rec => ({
      'Order': rec.moduleNumber,
      'Section': rec.section,
      'Module': rec.module,
      'Prerequisites': (rec.prerequisites || []).join(', '),
      'Learning Objectives': (rec.learningObjectives || []).join('; '),
      'Priority Level': rec.priority,
      'Recommended Hours': rec.recommendedHours
    }));
    const pathWs = XLSX.utils.json_to_sheet(pathData);
    XLSX.utils.book_append_sheet(wb, pathWs, 'Learning Path');

    // 4. Implementation Guide Sheet
    const guideData = [
      {
        'Section': 'High Priority Modules',
        'Description': 'Focus on these modules first',
        'Time Allocation': '50% of available time',
        'Teaching Approach': 'In-depth coverage with extensive practice'
      },
      {
        'Section': 'Medium Priority Modules',
        'Description': 'Cover after high priority modules',
        'Time Allocation': '30% of available time',
        'Teaching Approach': 'Standard coverage with regular practice'
      },
      {
        'Section': 'Low Priority Modules',
        'Description': 'These modules can be covered briefly or assigned as self-study',
        'Time Allocation': 'Flexible timing based on progress in higher priority areas',
        'Teaching Approach': 'Overview of concepts with optional deeper exploration'
      },
    ];
    const guideWs = XLSX.utils.json_to_sheet(guideData);
    XLSX.utils.book_append_sheet(wb, guideWs, 'Implementation Guide');

    // Save the workbook
    const fileName = `${clientName || 'Client'}_Curriculum_Plan.xlsx`.replace(/\s+/g, '_');
    XLSX.writeFile(wb, fileName);
  };

  const recommendations = analyzeSurveyResponses();

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {recommendations.responseRate < 30 ? (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'warning.light' }}>
          <Typography color="warning.dark">
            ⚠️ Only {Math.round(recommendations.responseRate)}% of modules were answered. The curriculum recommendation may not be accurate. We recommend completing more of the survey for a better-tailored curriculum.
          </Typography>
        </Paper>
      ) : null}

      {recommendations.moduleScores.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" color="error">
            Insufficient Data
          </Typography>
          <Typography>
            Please complete at least some sections of the survey to receive curriculum recommendations.
          </Typography>
        </Paper>
      ) : (
        <>
          <Box sx={{ mb: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleExport}
              startIcon={<DownloadIcon />}
              sx={{ mb: 2 }}
            >
              Export Curriculum Plan
            </Button>
          </Box>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <Typography variant="body1">
                Based on the {Math.round(recommendations.responseRate)}% of modules answered,
                we recommend a {TOTAL_HOURS}-hour curriculum with the following focus areas:
              </Typography>
              <Box sx={{ mt: 2 }}>
                {recommendations.moduleScores.slice(0, 3).map((rec, index) => (
                  <Chip
                    key={index}
                    label={`${rec.module} (${rec.recommendedHours}hrs)`}
                    color={getPriorityColor(rec.priority)}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            </Box>
          </Paper>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Section/Module</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell align="right">Recommended Hours</TableCell>
                  <TableCell align="right">Response Rate</TableCell>
                  <TableCell>Key Skills Focus</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recommendations.moduleScores.map((rec, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="subtitle2">{rec.section}</Typography>
                      <Typography variant="body2">
                        {rec.module}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={rec.priority}
                        color={getPriorityColor(rec.priority)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">{rec.recommendedHours}</TableCell>
                    <TableCell align="right">{Math.round(rec.responseRate)}%</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {rec.skills.join('; ')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default CurriculumRecommendation;
