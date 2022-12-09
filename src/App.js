import './App.css';

import * as React from "react";
import { Routes, Route, Outlet, Link } from "react-router-dom";

import ResponsiveAppBar from './components/appBar';
import OneRepMaxCalculator from './components/oneRepMaxCalculator';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

export default function App() {
  return (
    <div>

      {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="visualizer" element={<Visualizer />} />
          <Route path="analyzer" element={<Analyzer />} />
          <Route path="calculator" element={<Calculator />} />

          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
}

function Layout() {
  return (
    <div>

     <ResponsiveAppBar />

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </div>
  );
}

function Home() {
  return (
    <div>
     <Box sx={{ m: 1 }} md={{ m: 3}} >
       <Container maxWidth="lg" sx={{ borderRadius: '6px', border: '1px solid grey', boxShadow: '13', backgroundColor: 'palette.secondary.light' }}>
      <h1>Welcome to Strength Journeys</h1>
      <h3>Visualise your lifting history - lift consistently for a long time.</h3>
       </Container>
     </Box>
    </div>
  );
}

function Visualizer() {
  return (
    <div>
     <Box sx={{ m: 1 }} md={{ m: 3}} >
       <Container maxWidth="lg" sx={{ borderRadius: '6px', border: '1px solid grey', boxShadow: '13', backgroundColor: 'palette.secondary.light' }}>
      <h2>Strength Visualizer</h2>
       </Container>
     </Box>
    </div>
  );
}

function Analyzer() {
  return (
    <div>
     <Box sx={{ m: 1 }} md={{ m: 3}} >
       <Container maxWidth="lg" sx={{ borderRadius: '6px', border: '1px solid grey', boxShadow: '13', backgroundColor: 'palette.secondary.light' }}>
      <h2>PR Analyzer</h2>
       </Container>
     </Box>
    </div>
  );
}

function Calculator() {
  return (
    <div>
     <Box sx={{ m: 1 }} md={{ m: 3}} >
       <Container maxWidth="lg" sx={{ borderRadius: '6px', border: '1px solid grey', boxShadow: '13', backgroundColor: 'palette.secondary.light' }}>
         <OneRepMaxCalculator />
       </Container>
     </Box>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}