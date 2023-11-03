/** @format */

import { useState } from "react";
import { Inter } from "next/font/google";
import * as Slider from "@radix-ui/react-slider";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    // <main> from inital next.js default template
    <main className={`flex min-h-screen flex-col items-center justify-between p-4 ${inter.className}`}>
      <E1RMCalculator />
    </main>
  );
}

const E1RMCalculator = () => {
  const [reps, setReps] = useState(5);
  const [weight, setWeight] = useState(100);
  const [isMetric, setIsMetric] = useState(true);

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

  return (
    <div>
      <h2>E1RM One Rep Max Calculator</h2>
      <>
        Estimate your max single based on reps and weight (see{" "}
        <a href="https://en.wikipedia.org/wiki/One-repetition_maximum">Wikipedia article</a> for theory)
        <div className="flex flex-col sm:flex-row mt-4">
          <div className="w-2/12">Reps:</div>
          <div className="flex-grow">
            <Reps reps={[reps]} onChange={handleRepsSliderChange} />
          </div>
          <div className="w-2/12 ml-2 md:ml-8">{reps}</div>
        </div>
        <div className="flex flex-col sm:flex-row mt-4">
          <div></div>
          <div className="w-2/12">Weight:</div>
          <div className="flex-grow">
            <Weight weight={[weight]} onChange={handleWeightSliderChange} isMetric={isMetric} />
          </div>
          <div className="w-2/12 ml-2 md:ml-8">{weight}kg</div>
        </div>
        <Card className="mt-8" />
      </>
    </div>
  );
};

// Slider abstraction
const Slider2 = ({ value, onChange, min, max, step }) => (
  <Slider.Root
    className="relative flex items-center select-none touch-none h-5"
    defaultValue={value}
    max={max}
    step={step}
    onValueChange={onChange}
  >
    <Slider.Track className="bg-black relative grow rounded-full h-[3px]">
      <Slider.Range className="absolute bg-white rounded-full h-full" />
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
      <Slider2 aria-label="Reps" value={reps} min="1" max="20" onChange={onChange} />
    </div>
  );
};

// Weight input component
const Weight = ({ weight, onChange, isMetric }) => {
  let max = 600;

  if (isMetric) {
    max = 250;
  }

  return <Slider2 aria-label="Weight" value={weight} min={1} max={max} onChange={onChange} />;
};

const Card = () => {
  return (
    <div className="mt-8 justify-center rounded-md border border-slate-400 bg-slate-200 p-2 shadow-md shadow-slate-600 duration-75 md:p-4 md:hover:bg-slate-300 ring-1">
      Estimated One Rep Max: 320kg (Bryzki formula)
    </div>
  );
};
