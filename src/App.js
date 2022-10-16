import logo from './rogue_plate.png';
import './App.css';
import { useState } from 'react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      <E1RMCalculator />
      </header>
    </div>
  );
}

const E1RMCalculator = () => {
  const [reps, setReps] = useState(5);
  const [weight, setWeight] = useState(225);


  // Process changes for calculator inputs
  const handleChange = (event) => {
    // console.log(`handleChange: ${event.target.value} id: ${event.target.id}`);

    if (event.target.id === 'repsInput' && event.target.value > 0) {
       setReps(event.target.value);
    }

    if (event.target.id === 'weightInput' && event.target.value > 0) {
      setWeight(event.target.value);
    }
  };

  return (
    <div>
      <Reps value={reps} onChange={handleChange} />
      <Weight value={weight} onChange={handleChange}/>
      <Result value={estimateE1RM(reps, weight)} /> 
    </div>
  );
}

// Reps input component
const Reps = (props) => {
  return (
    <div>
      <label>Reps:</label><input id="repsInput" type="number" value={props.value} onChange={props.onChange}></input>
    </div>
  );
}

// Weight input component
const Weight = (props) => {
  return (
    <div>
      <label>Weight:</label><input id="weightInput" type="number" value={props.value} onChange={props.onChange}></input>
    </div>
  );
}

// e1rm Result component
const Result = (props) => {
  const E1RM = props.value;

  return (
    <div>
      <label>Result: {E1RM}</label>
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
