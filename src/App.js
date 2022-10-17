import logo from './rogue_plate.png';
import './App.css';
import { useState } from 'react';


import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import NumbersIcon from '@mui/icons-material/Numbers';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';

// Taken from https://mui.com/material-ui/react-grid2/
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

// Main e1rm calculator app
function App() {
  return (
    <div className="App">
      <header className="App-header">
        E1RM Calculator
      </header>

      <E1RMCalculator />
    </div>
  );
}

const E1RMCalculator = () => {
  const [reps, setReps] = useState(5);
  const [weight, setWeight] = useState(225);

  const handleRepsSliderChange = (event: Event, newValue: number | number[]) => {
    setReps(newValue);
  };

  const handleWeightSliderChange = (event: Event, newValue: number | number[]) => {
    setWeight(newValue);
  };

  return (
    <div>
    <Grid container spacing={2}>

      <Grid xs={12}>
        <img src={logo} className="App-logo" alt="logo" />
      </Grid>

      <Grid xs={2}>
        Reps:
      </Grid>
      <Grid xs={8}>
        <Reps value={reps} onChange={handleRepsSliderChange} />
      </Grid>
      <Grid xs={2}>
        {reps} 
      </Grid>

      <Grid xs={2}>
        Weight:
      </Grid>
      <Grid xs={8}>
        <Weight value={weight} onChange={handleWeightSliderChange}/>
      </Grid>
      <Grid xs={2}>
        {weight} 
      </Grid>

      <Grid xs={12}>
        <Result value={estimateE1RM(reps, weight)} />
      </Grid>

    </Grid>
    </div>
  );
}

// Reps input component
const Reps = (props) => {
  return (
    <div>
    <Slider 
      aria-label="Reps" 
      value={props.value} 
      min={1}
      max={20}
      onChange={props.onChange} 
      aria-label="Default" 
      valueLabelDisplay="auto" 
    />
    </div>
  );
}

// Weight input component
const Weight = (props) => {
  return (
    <Slider 
      aria-label="Weight" 
      value={props.value} 
      min={1}
      max={700}
      onChange={props.onChange} 
      aria-label="Default" 
      valueLabelDisplay="auto" 
    />
  );
}

// e1rm Result component
const Result = (props) => {
  const E1RM = props.value;

  return (
    <div>
      <label><h2>Estimated One Rep Max: {E1RM}</h2></label>
    </div>
  );
}

// Return a rounded 1 rep max
// For theory see: https://en.wikipedia.org/wiki/One-repetition_maximum
function estimateE1RM(reps, weight, equation) {

  if (reps === 1) return weight; // Heavy single requires no estimate!

  switch (equation) {
    case "Epley":
      return Math.round(weight * (1 + reps / 30));
      break;
    case "McGlothin":
      return Math.round((100 * weight) / (101.3 - 2.67123 * reps));
      break;
    case "Lombardi":
      return Math.round(weight * Math.pow(reps, 0.1));
      break;
    case "Mayhew":
      return Math.round((100 * weight) / (52.2 + 41.9 * Math.pow(Math.E, -0.055 * reps)));
      break;
    case "OConner":
      return Math.round(weight * (1 + reps / 40));
      break;
    case "Wathen":
      return Math.round((100 * weight) / (48.8 + 53.8 * Math.pow(Math.E, -0.075 * reps)));
      break;
    case "Brzycki":
      return Math.round(weight / (1.0278 - 0.0278 * reps));
      break;
    default: // Repeat Brzycki formula as a default here
      return Math.round(weight / (1.0278 - 0.0278 * reps));
      break;
  }
}

export default App;
