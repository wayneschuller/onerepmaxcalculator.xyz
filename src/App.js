import logo from './rogue_plate.png';
import './App.css';
import { useState } from 'react';
import { useCookies } from 'react-cookie';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
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

  const [cookies, setCookie] = useCookies(['isMetric']);

  // If they don't have a units cookie - default to lb
  // if (cookies.isMetric === undefined) {
    // console.log(`cookie.isMetric is undefined, let's set it as false`);
    // let d = new Date(); d.setTime(d.getTime() + (365*24*60*60*1000)); // 365 days from now
    // setCookie('isMetric', false, { path: '/', expires: d });
  // }

  const [reps, setReps] = useState(5);
  const [weight, setWeight] = useState(225);
  const [isMetric, setMetric] = useState(cookies.isMetric);

  console.log(`rendering cookies.isMetric: ${cookies.isMetric} and isMetric state is: ${isMetric}`);

  const handleRepsSliderChange = (event, newValue) => {
    setReps(newValue);
  };

  const handleWeightSliderChange = (event, newValue) => {
    let newWeight = newValue;

    if (isMetric) {
      newWeight = 2.5 * Math.ceil(newWeight/2.5);  // For kg only allow nice multiples of 2.5kg
    } else {
      newWeight = 5 * Math.ceil(newWeight/5);  // For lb only allow nice multiples of 5lb
    }

    setWeight(newWeight);
  };

  // Called when they click on one of the 'lb' or 'kg' chips to change units
  const onUnitClick = (event) => {
    if (isMetric) {
      // Going from kg to lb
      setWeight(Math.round(weight * 2.2046)); 
      
      let d = new Date(); d.setTime(d.getTime() + (365*24*60*60*1000)); // 365 days from now
      setCookie('isMetric', false, { path: '/', expires: d });

      setMetric(false);
    } else {
      // Going from lb to kg 
      setWeight(Math.round(weight / 2.2046)); 

      let d = new Date(); d.setTime(d.getTime() + (365*24*60*60*1000)); // 365 days from now
      setCookie('isMetric', true, { path: '/', expires: d });

      setMetric(true);
    }
  };

  return (
    <div>
    <Grid container spacing={2} display="flex"  justifyContent="center" alignItems="center">

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
        <Weight value={weight} isMetric={isMetric} onChange={handleWeightSliderChange}/>
      </Grid>
      <Grid xs={2}>
        {weight}{isMetric ? 'kg' : 'lb'}
      </Grid>

      <Grid xs={2} md={3}> </Grid>
      <Grid xs={8} md={6}>
        <Item elevation={4}><h2>Estimated One Rep Max: {estimateE1RM(reps, weight, "Brzycki")}{isMetric ? 'kg' : 'lb'}</h2> (Brzycki formula)</Item>
      </Grid>
      <Grid xs={2} md={3}>
        <Chip label="lb" color={isMetric ? "default" : "primary"} onClick={onUnitClick} />
        <Chip label="kg" color={isMetric ? "primary" : "default"} onClick={onUnitClick} />
      </Grid>

      <Grid xs={6} md={2}> 
        <Item elevation={4}>Epley: {estimateE1RM(reps, weight, "Epley")}{isMetric ? 'kg' : 'lb'}</Item>
      </Grid>
      <Grid xs={6} md={2}> 
        <Item elevation={4}>McGlothin: {estimateE1RM(reps, weight, "McGlothin")}{isMetric ? 'kg' : 'lb'}</Item>
      </Grid>
      <Grid xs={6} md={2}> 
        <Item elevation={4}>Lombardi: {estimateE1RM(reps, weight, "Lombardi")}{isMetric ? 'kg' : 'lb'}</Item>
      </Grid>
      <Grid xs={6} md={2}> 
        <Item elevation={4}>Mayhew: {estimateE1RM(reps, weight, "Mayhew")}{isMetric ? 'kg' : 'lb'}</Item>
      </Grid>
      <Grid xs={6} md={2}> 
        <Item elevation={4}>OConner: {estimateE1RM(reps, weight, "OConner")}{isMetric ? 'kg' : 'lb'}</Item>
      </Grid>
      <Grid xs={6} md={2}> 
        <Item elevation={4}>Wathen: {estimateE1RM(reps, weight, "Wathen")}{isMetric ? 'kg' : 'lb'}</Item>
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
      valueLabelDisplay="auto" 
    />
    </div>
  );
}

// Weight input component
const Weight = (props) => {
  let max = 600;
  let step = 1;  

  if (props.isMetric) {
    max = 250;
    step = 0.5;
  }

  return (
    <Slider 
      aria-label="Weight" 
      value={props.value} 
      min={1}
      max={max}
      step={step}
      onChange={props.onChange} 
      valueLabelDisplay="auto" 
    />
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