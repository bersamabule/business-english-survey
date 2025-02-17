import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Tooltip,
  Collapse,
} from '@mui/material';
import { motion } from 'framer-motion';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import InfoIcon from '@mui/icons-material/Info';
import { surveyData } from '../data/surveyData';

const IMPORTANCE_WEIGHTS = {
  'very-important': 1,
  'important': 0.75,
  'neutral': 0.5,
  'slightly-unimportant': 0.25,
  'totally-unimportant': 0
};

const ProgressionTree = ({ responses, clientName }) => {
  const [selectedSection, setSelectedSection] = useState('all');
  const [importanceFilter, setImportanceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});

  // Group modules by their progression level
  const analyzeProgression = () => {
    const progressionLevels = [];
    
    surveyData.sections.forEach(section => {
      const sectionModules = [];
      
      section.modules.forEach(module => {
        if (module.subModules) {
          // For modules with submodules, maintain their progression order
          module.subModules.forEach(subModule => {
            const moduleResponses = subModule.skills.map((skill, index) => {
              const responseKey = `${subModule.id}_${index}`;
              return {
                skill,
                importance: IMPORTANCE_WEIGHTS[responses[responseKey]] || 0,
                response: responses[responseKey] || 'not-answered'
              };
            });
            
            const averageImportance = moduleResponses.reduce((sum, r) => sum + r.importance, 0) / moduleResponses.length;
            const responseRate = (moduleResponses.filter(r => r.response !== 'not-answered').length / moduleResponses.length) * 100;
            
            sectionModules.push({
              id: subModule.id,
              title: subModule.title,
              moduleNumber: subModule.moduleNumber,
              parentModule: module.title,
              skills: moduleResponses,
              importance: averageImportance,
              responseRate,
              level: parseInt(subModule.moduleNumber, 10) || 0,
              prerequisites: module.prerequisites || [],
              learningObjectives: subModule.learningObjectives || []
            });
          });
        } else {
          // For standalone modules
          const moduleResponses = module.skills.map((skill, index) => {
            const responseKey = `${module.id}_${index}`;
            return {
              skill,
              importance: IMPORTANCE_WEIGHTS[responses[responseKey]] || 0,
              response: responses[responseKey] || 'not-answered'
            };
          });
          
          const averageImportance = moduleResponses.reduce((sum, r) => sum + r.importance, 0) / moduleResponses.length;
          const responseRate = (moduleResponses.filter(r => r.response !== 'not-answered').length / moduleResponses.length) * 100;
          
          sectionModules.push({
            id: module.id,
            title: module.title,
            moduleNumber: module.moduleNumber,
            skills: moduleResponses,
            importance: averageImportance,
            responseRate,
            level: parseInt(module.moduleNumber, 10) || 0,
            prerequisites: module.prerequisites || [],
            learningObjectives: module.learningObjectives || []
          });
        }
      });
      
      // Group modules by their progression level
      sectionModules.sort((a, b) => a.level - b.level);
      progressionLevels.push({
        section: section.title,
        modules: sectionModules
      });
    });
    
    return progressionLevels;
  };

  const progression = analyzeProgression();
  
  const getImportanceColor = (importance) => {
    if (importance >= 0.8) return 'error';
    if (importance >= 0.5) return 'warning';
    if (importance >= 0.3) return 'info';
    return 'default';
  };

  const getImportanceLabel = (importance) => {
    if (importance >= 0.8) return 'High Priority';
    if (importance >= 0.5) return 'Medium Priority';
    if (importance >= 0.3) return 'Low Priority';
    return 'Optional';
  };

  const toggleModuleExpansion = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const filterModules = (section) => {
    let modules = section.modules;

    // Filter by importance
    if (importanceFilter !== 'all') {
      const minImportance = {
        'high': 0.8,
        'medium': 0.5,
        'low': 0.3
      }[importanceFilter];
      
      modules = modules.filter(m => m.importance >= minImportance);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      modules = modules.filter(m => 
        m.title.toLowerCase().includes(query) ||
        m.skills.some(s => s.skill.toLowerCase().includes(query))
      );
    }

    return modules;
  };

  return (
    <Box component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">
          Learning Progression for {clientName}
        </Typography>
        <IconButton onClick={() => setShowFilters(!showFilters)}>
          <FilterListIcon />
        </IconButton>
      </Box>

      <Collapse in={showFilters}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Section</InputLabel>
              <Select
                value={selectedSection}
                label="Section"
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <MenuItem value="all">All Sections</MenuItem>
                {progression.map((section, index) => (
                  <MenuItem key={index} value={section.section}>
                    {section.section}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Priority Level</InputLabel>
              <Select
                value={importanceFilter}
                label="Priority Level"
                onChange={(e) => setImportanceFilter(e.target.value)}
              >
                <MenuItem value="all">All Priorities</MenuItem>
                <MenuItem value="high">High Priority</MenuItem>
                <MenuItem value="medium">Medium Priority</MenuItem>
                <MenuItem value="low">Low Priority</MenuItem>
              </Select>
            </FormControl>

            <TextField
              size="small"
              label="Search Skills"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ minWidth: 200 }}
            />
          </Box>
        </Paper>
      </Collapse>
      
      <Typography variant="body1" paragraph>
        This progression plan is based on your priorities and follows a logical learning path,
        starting with foundational skills and building up to more advanced topics.
      </Typography>
      
      {progression
        .filter(section => selectedSection === 'all' || section.section === selectedSection)
        .map((section, sIndex) => (
          <Paper key={sIndex} sx={{ mt: 3, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {section.section}
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {filterModules(section).map((module, mIndex) => (
                <Card 
                  key={mIndex}
                  variant="outlined"
                  sx={{
                    borderColor: module.importance >= 0.8 ? 'error.main' : 
                               module.importance >= 0.5 ? 'warning.main' : 
                               module.importance >= 0.3 ? 'info.main' : 'grey.300'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => toggleModuleExpansion(module.id)}
                        >
                          {expandedModules[module.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                        <Typography variant="subtitle1">
                          {module.parentModule ? `${module.parentModule} - ` : ''}{module.title}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title="Module number indicates the recommended learning order">
                          <Chip
                            size="small"
                            label={`Module ${module.moduleNumber}`}
                            color={getImportanceColor(module.importance)}
                          />
                        </Tooltip>
                        <Tooltip title={`${Math.round(module.responseRate)}% of skills rated`}>
                          <InfoIcon fontSize="small" color="action" />
                        </Tooltip>
                      </Box>
                    </Box>

                    <Collapse in={expandedModules[module.id]}>
                      <Box sx={{ mt: 2 }}>
                        {module.prerequisites.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Prerequisites:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                              {module.prerequisites.map((prereq, pIndex) => (
                                <Chip
                                  key={pIndex}
                                  label={prereq}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          </Box>
                        )}

                        <Typography variant="subtitle2" color="text.secondary">
                          Key Skills (by priority):
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                          {module.skills
                            .sort((a, b) => b.importance - a.importance)
                            .map((skill, sIndex) => (
                              <Tooltip
                                key={sIndex}
                                title={`Priority: ${getImportanceLabel(skill.importance)}`}
                              >
                                <Chip
                                  label={skill.skill}
                                  size="small"
                                  variant="outlined"
                                  color={getImportanceColor(skill.importance)}
                                />
                              </Tooltip>
                            ))}
                        </Box>

                        {module.learningObjectives.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Learning Objectives:
                            </Typography>
                            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                              {module.learningObjectives.map((objective, oIndex) => (
                                <li key={oIndex}>
                                  <Typography variant="body2">
                                    {objective}
                                  </Typography>
                                </li>
                              ))}
                            </ul>
                          </Box>
                        )}
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        ))}
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          How to Use This Progression Plan
        </Typography>
        <Typography variant="body1" paragraph>
          • Modules are arranged in a logical learning sequence
        </Typography>
        <Typography variant="body1" paragraph>
          • Red modules indicate your highest priorities (rated as Very Important)
        </Typography>
        <Typography variant="body1" paragraph>
          • Orange modules are medium priority (rated as Important) but may be prerequisites for advanced topics
        </Typography>
        <Typography variant="body1" paragraph>
          • Blue modules are supplementary but may enhance your overall learning
        </Typography>
        <Typography variant="body1">
          • Click the expand icon on each module to see detailed information about prerequisites and learning objectives
        </Typography>
      </Box>
    </Box>
  );
};

export default ProgressionTree;
