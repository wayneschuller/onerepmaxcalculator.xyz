import './App.css';

import ResponsiveAppBar from './appBar';
import OneRepMaxCalculator from './oneRepMaxCalculator';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

// Draw the main app page
function App() {
  return (
    <div>
    <ResponsiveAppBar />
    <Box sx={{ m: 1 }} md={{ m: 3}} >
      <Container maxWidth="lg" sx={{ borderRadius: '6px', border: '1px solid grey', boxShadow: '13', backgroundColor: 'palette.secondary.light' }}>
        <OneRepMaxCalculator />
      </Container>
    </Box>
    </div>
  );
}

export default App;