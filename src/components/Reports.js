import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';

function Reports() {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Load surveys from localStorage
    const loadSurveys = () => {
      const storedSurveys = JSON.parse(localStorage.getItem('surveyResults') || '[]');
      setSurveys(storedSurveys.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    };

    loadSurveys();

    // Set up event listener for storage changes
    window.addEventListener('storage', loadSurveys);
    return () => window.removeEventListener('storage', loadSurveys);
  }, []);

  const handleView = (survey) => {
    setSelectedSurvey(survey);
    setOpen(true);
  };

  const handleDelete = (id) => {
    const updatedSurveys = surveys.filter(survey => survey.id !== id);
    localStorage.setItem('surveyResults', JSON.stringify(updatedSurveys));
    setSurveys(updatedSurveys);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSurvey(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Survey Submissions
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Client Name</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {surveys.map((survey) => (
              <TableRow key={survey.id}>
                <TableCell>{formatDate(survey.timestamp)}</TableCell>
                <TableCell>{survey.clientName}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleView(survey)} color="primary">
                    <ViewIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(survey.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {surveys.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No survey submissions yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        {selectedSurvey && (
          <>
            <DialogTitle>
              Survey Results - {selectedSurvey.clientName}
            </DialogTitle>
            <DialogContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Submitted on: {formatDate(selectedSurvey.timestamp)}
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell>Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(selectedSurvey.surveyData).map(([category, score]) => (
                      <TableRow key={category}>
                        <TableCell>{category}</TableCell>
                        <TableCell>{score}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default Reports;
