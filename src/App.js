import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Survey from './components/Survey';

function App() {
  return (
    <Router>
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        py: 4
      }}>
        <Routes>
          <Route path="/" element={<Survey />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
