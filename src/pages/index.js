/** @format */

"use client";

import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import * as Slider from "@radix-ui/react-slider";
import * as Switch from "@radix-ui/react-switch";
// import { Switch } from "@radix-ui/react-switch";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    // <main> from inital next.js default template
    <main
      className={`flex min-h-screen bg-gray-300 dark:bg-black flex-col items-center justify-between p-4 ${inter.className}`}
    >
      <E1RMCalculator />
    </main>
  );
}

let didInit = false;

const E1RMCalculator = () => {
  const [reps, setReps] = useState(5);
  const [weight, setWeight] = useState(225);
  const [isMetric, setIsMetric] = useState(true);

  // useEffect on first init get defaults from localStorage
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // Get some initial values from any browser localstorage
      let initReps = localStorage.getItem("calcReps");
      initReps = initReps ? parseInt(initReps) : 5;
      setReps(initReps);

      let initWeight = localStorage.getItem("calcWeight");
      initWeight = initWeight ? parseFloat(initWeight) : 225;
      setWeight(initWeight);

      let initIsMetric = localStorage.getItem("calcIsMetric");
      initIsMetric = initIsMetric === "true"; // boolean is true if string is "true" otherwise false
      setIsMetric(initIsMetric);
    }
  }, []);

  // useEffect when state changes put key variables in localStorage so we can default to them next time
  useEffect(() => {
    localStorage.setItem("calcReps", reps);
    localStorage.setItem("calcWeight", weight);
    localStorage.setItem("calcIsMetric", isMetric);
  }, [weight, reps, isMetric]);

  const handleRepsSliderChange = (value) => {
    // console.log(`reps change: ${value[0]}`);
    setReps(value[0]);
  };

  const handleWeightSliderChange = (value) => {
    let newWeight = value[0];
    // console.log(`weight change: ${newWeight} `);

    if (isMetric) {
      newWeight = 2.5 * Math.ceil(newWeight / 2.5); // For kg only allow nice multiples of 2.5kg
    } else {
      newWeight = 5 * Math.ceil(newWeight / 5); // For lb only allow nice multiples of 5lb
    }

    setWeight(newWeight);
  };

  const handleEntryWeightChange = (e) => {
    const input = e.target.value;
    //FIXME: do any error checking? Check for negative?
    setWeight(input);
  };

  const toggleIsMetric = (isMetric) => {
    if (!isMetric) {
      // Going from kg to lb
      setWeight(Math.round(weight * 2.2046));
      setIsMetric(false);
    } else {
      // Going from lb to kg
      setWeight(Math.round(weight / 2.2046));
      setIsMetric(true);
    }
  };

  return (
    <div className="h-min w-3/4  border border-black rounded-lg bg-slate-50  dark:bg-slate-900  dark:border-white shadow-slate-500 dark:shadow-white shadow-lg p-4 mx-60">
      <h2 className="text-2xl">
        <b>E1RM One Rep Max Calculator</b>
      </h2>
      <>
        Estimate your max single based on reps and weight (see{" "}
        <a href="https://en.wikipedia.org/wiki/One-repetition_maximum">Wikipedia article</a> for theory)
        <div className="flex flex-col sm:flex-row mt-4">
          <div className="w-2/12">Reps:</div>
          <div className="flex-grow">
            <Reps reps={[reps]} onChange={handleRepsSliderChange} />
          </div>
          <div className="w-2/12 ml-2 md:ml-8">
            <b>{reps}</b>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row mt-4">
          <div className="w-2/12">Weight:</div>
          <div className="flex-grow">
            <Weight weight={[weight]} onChange={handleWeightSliderChange} isMetric={isMetric} />
          </div>
          <div className="w-2/12 ml-2 md:ml-8">
            <div className="flex gap-1">
              <b>
                <input
                  className="w-16 text-black"
                  type="number"
                  min="1"
                  step="1"
                  id="weightInput"
                  value={weight}
                  onChange={handleEntryWeightChange}
                />
              </b>
              {isMetric ? "kg" : "lb"}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row mt-4 gap-4">
          <Card reps={reps} weight={weight} isMetric={isMetric} />
          <UnitChooser isMetric={isMetric} onSwitchChange={toggleIsMetric} />
        </div>
      </>
    </div>
  );
};

const UnitChooser = ({ isMetric, onSwitchChange }) => (
  <div className="flex items-center align-middle">
    <label className="leading-none pr-[10px]">Pounds</label>
    <Switch.Root
      className={`w-[42px] h-[25px] bg-black rounded-full relative shadow-[0_2px_10px] shadow-blackA4 focus:shadow-[0_0_0_2px] focus:shadow-black ${
        isMetric ? "data-[state=checked]:bg-black" : ""
      } outline-none cursor-default`}
      id="airplane-mode"
      onCheckedChange={() => onSwitchChange(!isMetric)}
      checked={isMetric}
    >
      <Switch.Thumb
        className={`block w-[21px] h-[21px] bg-white rounded-full shadow-[0_2px_2px] shadow-blackA4 transition-transform duration-100 will-change-transform ${
          isMetric ? "data-[state=checked]:translate-x-[19px]" : ""
        }`}
      />
    </Switch.Root>
    <label className="leading-none pl-[10px]" htmlFor="kilos-mode">
      Kilos
    </label>
  </div>
);

// Slider abstraction
const Slider2 = ({ value, onChange, min, max, step }) => (
  <Slider.Root
    className="relative flex items-center select-none touch-none h-5"
    value={value}
    min={min}
    max={max}
    step={step}
    onValueChange={onChange}
  >
    <Slider.Track className="bg-black relative grow rounded-full h-[3px]">
      <Slider.Range className="absolute bg-slate-400 rounded-full h-full" />
    </Slider.Track>
    <Slider.Thumb
      className="block w-5 h-5 bg-white shadow-[0_2px_10px] shadow-black rounded-[10px] hover:bg-violet focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-black "
      aria-label="Reps"
    />
  </Slider.Root>
);

// Reps input component
const Reps = ({ reps, onChange }) => {
  return (
    <div>
      <Slider2 aria-label="Reps" value={reps} max="20" onChange={onChange} />
    </div>
  );
};

// Weight input component
const Weight = ({ weight, onChange, isMetric }) => {
  let max = 600;

  if (isMetric) {
    max = 250;
  }

  return <Slider2 aria-label="Weight" value={weight} max={max} onChange={onChange} />;
};

const Card = ({ reps, weight, isMetric }) => {
  return (
    <div className="mt-8 w-2/3 justify-self-center rounded-md border border-slate-400 bg-slate-200 dark:bg-slate-900 p-2 shadow-md shadow-slate-600 duration-75 md:p-4 md:hover:bg-slate-300 md:dark:hover:bg-slate-800 ring-1">
      Estimated One Rep Max:{" "}
      <b>
        {" " + estimateE1RM(reps, weight, "Brzycki")}
        {isMetric ? "kg" : "lb"}
      </b>{" "}
      (Brzycki formula)
    </div>
  );
};

// Return a rounded 1 rep max
// For theory see: https://en.wikipedia.org/wiki/One-repetition_maximum
function estimateE1RM(reps, weight, equation) {
  if (reps === 1) return weight; // Heavy single requires no estimate!

  switch (equation) {
    case "Epley":
      return Math.round(weight * (1 + reps / 30));
    case "McGlothin":
      return Math.round((100 * weight) / (101.3 - 2.67123 * reps));
    case "Lombardi":
      return Math.round(weight * Math.pow(reps, 0.1));
    case "Mayhew":
      return Math.round((100 * weight) / (52.2 + 41.9 * Math.pow(Math.E, -0.055 * reps)));
    case "OConner":
      return Math.round(weight * (1 + reps / 40));
    case "Wathen":
      return Math.round((100 * weight) / (48.8 + 53.8 * Math.pow(Math.E, -0.075 * reps)));
    case "Brzycki":
      return Math.round(weight / (1.0278 - 0.0278 * reps));
    default: // Repeat Brzycki formula as a default here
      return Math.round(weight / (1.0278 - 0.0278 * reps));
  }
}
