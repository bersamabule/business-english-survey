import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import CurriculumRecommendation from './components/CurriculumRecommendation';
import Reports from './components/Reports';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Business English Survey
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Survey
          </Button>
          <Button color="inherit" component={Link} to="/reports">
            Reports
          </Button>
        </Toolbar>
      </AppBar>

      <Container>
        <Routes>
          <Route path="/" element={<CurriculumRecommendation />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
