import React from 'react';
import { Box } from '@mui/material';
import Survey from './components/Survey';

function App() {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      py: 4
    }}>
      <Survey />
    </Box>
  );
}

export default App;
