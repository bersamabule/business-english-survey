import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import DownloadIcon from '@mui/icons-material/Download';
import { surveyService } from '../services/surveyService';
import { surveyData, importanceOptions } from '../data/surveyData';
import CurriculumRecommendation from './CurriculumRecommendation';
import * as XLSX from 'xlsx';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState([]);
  const [aggregatedData, setAggregatedData] = useState([]);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState(null);

  useEffect(() => {
    loadSurveyResponses();
  }, []);

  const loadSurveyResponses = async () => {
    try {
      const data = await surveyService.getSurveyResponses();
      setResponses(data);
      processAggregatedData(data);
    } catch (err) {
      setError('Error loading survey responses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const processAggregatedData = (data) => {
    const aggregated = surveyData.sections.flatMap(section =>
      section.modules.flatMap(module => {
        if (module.subModules) {
          return module.subModules.flatMap(sub => sub.skills.map((skill, idx) => ({
            skill,
            module: sub.title,
            section: section.title,
            responses: calculateResponses(data, `${sub.id}_${idx}`)
          })));
        }
        return module.skills.map((skill, idx) => ({
          skill,
          module: module.title,
          section: section.title,
          responses: calculateResponses(data, `${module.id}_${idx}`)
        }));
      })
    );

    setAggregatedData(aggregated);
  };

  const calculateResponses = (data, skillId) => {
    const counts = {};
    importanceOptions.forEach(option => {
      counts[option.value] = 0;
    });

    data.forEach(response => {
      if (response.responses[skillId]) {
        counts[response.responses[skillId]] = (counts[response.responses[skillId]] || 0) + 1;
      }
    });

    return counts;
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      aggregatedData.map(item => ({
        Section: item.section,
        Module: item.module,
        Skill: item.skill,
        'Totally Unimportant': item.responses['totally-unimportant'] || 0,
        'Slightly Unimportant': item.responses['slightly-unimportant'] || 0,
        'Neutral': item.responses['neutral'] || 0,
        'Important': item.responses['important'] || 0,
        'Very Important': item.responses['very-important'] || 0
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Survey Results');
    XLSX.writeFile(workbook, 'business_english_survey_results.xlsx');
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'clientName', headerName: 'Client Name', width: 200 },
    { field: 'submittedAt', headerName: 'Submitted', width: 200 },
    { field: 'completed', headerName: 'Status', width: 130,
      renderCell: (params) => (
        <Typography color={params.value ? 'success.main' : 'warning.main'}>
          {params.value ? 'Completed' : 'In Progress'}
        </Typography>
      )
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => setSelectedResponse(params.row)}
        >
          View Plan
        </Button>
      ),
    },
  ];

  const rows = responses.map((response, index) => ({
    id: index + 1,
    clientName: response.client_name,
    submittedAt: new Date(response.submitted_at).toLocaleString(),
    completed: response.completed,
    ...response
  }));

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Survey Analytics
      </Typography>

      <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="Individual Reports" />
        {selectedResponse && <Tab label={`Curriculum Plan - ${selectedResponse.client_name}`} />}
      </Tabs>

      {currentTab === 0 && (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Responses
                  </Typography>
                  <Typography variant="h3">
                    {responses.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Completion Rate
                  </Typography>
                  <Typography variant="h3">
                    {Math.round((responses.filter(r => r.completed).length / responses.length) * 100)}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Average Response Time
                  </Typography>
                  <Typography variant="h3">
                    {Math.round(responses.reduce((acc, curr) => {
                      const startTime = new Date(curr.created_at);
                      const endTime = new Date(curr.submitted_at);
                      return acc + (endTime - startTime) / (1000 * 60);
                    }, 0) / responses.length)} min
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mb: 4 }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={exportToExcel}
              sx={{ mb: 2 }}
            >
              Export All Data
            </Button>
          </Box>

          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Response Distribution by Importance
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={aggregatedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                {importanceOptions.map(option => (
                  <Bar
                    key={option.value}
                    dataKey={`responses.${option.value}`}
                    name={option.label}
                    fill={getBarColor(option.value)}
                    stackId="a"
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </>
      )}

      {currentTab === 1 && (
        <Paper sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </Paper>
      )}

      {currentTab === 2 && selectedResponse && (
        <CurriculumRecommendation
          responses={selectedResponse.responses}
          clientName={selectedResponse.client_name}
        />
      )}
    </Box>
  );
};

const getBarColor = (value) => {
  const colors = {
    'totally-unimportant': '#ff1744',
    'slightly-unimportant': '#ff9100',
    'neutral': '#ffeb3b',
    'important': '#00e676',
    'very-important': '#00c853'
  };
  return colors[value];
};

export default Analytics;
