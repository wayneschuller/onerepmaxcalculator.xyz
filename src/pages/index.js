/** @format */

"use client";

import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import * as Switch from "@radix-ui/react-switch";
import Head from "next/head";
import { Card } from "../components/Card";
import { CalcSlider } from "../components/CalcSlider";
import { estimateE1RM } from "../components/estimateE1RM";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const title = "E1RM One Rep Max Calculator";

  return (
    <div>
      <Head>
        <title>{title}</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
        <meta
          name="description"
          content="A one rep max strength calculator you can use with chalked up hands on your phone in the middle of a gym session. 
                We give estimates using multiple exercise science formulas. Designed by lifters for lifters. 
                Useful for powerlifting, strong lifts, crossfit, starting strength and other programs."
        />

        <link rel="canonical" href="https://www.onerepmaxcalculator.xyz/" />
      </Head>
      <main
        className={`flex min-h-screen bg-gray-300 dark:bg-black flex-col items-center justify-between pt-4 ${inter.className}`}
      >
        <E1RMCalculator />
      </main>
    </div>
  );
}

let didInit = false;

const E1RMCalculator = () => {
  const [reps, setReps] = useState(1);
  const [weight, setWeight] = useState(1);
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
    <div className="h-min w-11/12 md:w-4/5  border border-black rounded-lg bg-slate-50  dark:bg-slate-900  dark:border-white shadow-slate-500 dark:shadow-white shadow-lg p-4 ">
      <div className="flex flex-col md:flex-row gap-2 ">
        <h2 className="flex-1 text-3xl">
          <b>E1RM One Rep Max Calculator</b>
        </h2>
        <UnitChooser isMetric={isMetric} onSwitchChange={toggleIsMetric} />
      </div>
      <div className="mt-2 md:mt-0 flex-1">
        Estimate your max single based on reps and weight (see{" "}
        <a href="https://en.wikipedia.org/wiki/One-repetition_maximum">Wikipedia article</a> for theory)
      </div>
      <div className="flex flex-col sm:flex-row mt-4">
        <div className="w-[5rem]">Reps:</div>
        <div className="flex-grow">
          <Reps reps={[reps]} onChange={handleRepsSliderChange} />
        </div>
        <div className="w-2/12 ml-2 md:ml-8">
          <b>{reps}</b>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row mt-4">
        <div className="w-[5rem]">Weight:</div>
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
                aria-labelledby="weight"
                value={weight}
                onChange={handleEntryWeightChange}
              />
            </b>
            {isMetric ? "kg" : "lb"}
          </div>
        </div>
      </div>
      <div className="flex flex-1 justify-center mt-2 gap-2">
        <Card className="">
          <div className="w-64">
            <div className="text-xl">Estimated One Rep Max: </div>
            <div className="text-3xl font-bold flex flex-row justify-center items-center">
              {" " + estimateE1RM(reps, weight, "Brzycki")}
              {isMetric ? "kg" : "lb"}
            </div>
            <div className="flex flex-row justify-center items-center">(Brzycki formula)</div>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 justify-center mt-4 gap-4">
        <Card className="">
          <div className="flex flex-col justify-center items-center">
            Epley:
            <div className="font-bold">
              {estimateE1RM(reps, weight, "Epley")}
              {isMetric ? "kg" : "lb"}
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col justify-center items-center">
            McGlothin:
            <div className="font-bold">
              {estimateE1RM(reps, weight, "McGlothin")}
              {isMetric ? "kg" : "lb"}
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col justify-center items-center">
            Lombardi:
            <div className="font-bold">
              {estimateE1RM(reps, weight, "Lombardi")}
              {isMetric ? "kg" : "lb"}
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col justify-center items-center">
            Mayhew et al.:
            <div className="font-bold">
              {estimateE1RM(reps, weight, "Mayhew")}
              {isMetric ? "kg" : "lb"}
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col justify-center items-center">
            O&apos;Conner et al.:
            <div className="font-bold">
              {estimateE1RM(reps, weight, "OConner")}
              {isMetric ? "kg" : "lb"}
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col justify-center items-center">
            Wathen:
            <div className="font-bold">
              {estimateE1RM(reps, weight, "Wathen")}
              {isMetric ? "kg" : "lb"}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Reps input component
const Reps = ({ reps, onChange }) => {
  return (
    <div>
      <CalcSlider aria-label="Reps" value={reps} max="20" min={1} onChange={onChange} />
    </div>
  );
};

// Weight input component
const Weight = ({ weight, onChange, isMetric }) => {
  let max = 600;

  if (isMetric) {
    max = 250;
  }

  return <CalcSlider aria-label="Weight" value={weight} max={max} min={1} onChange={onChange} />;
};

const UnitChooser = ({ isMetric, onSwitchChange }) => (
  <div className="flex items-center align-middle">
    <label className="leading-none text-sm pr-[10px]" aria-label="pounds">
      Pounds
    </label>
    <Switch.Root
      className={`w-[42px] h-[25px] bg-black rounded-full relative shadow-[0_2px_10px] shadow-blackA4 focus:shadow-[0_0_0_2px] focus:shadow-black ${
        isMetric ? "data-[state=checked]:bg-black" : ""
      } outline-none cursor-default`}
      id="unit type"
      aria-label="unit type"
      onCheckedChange={() => onSwitchChange(!isMetric)}
      checked={isMetric}
    >
      <Switch.Thumb
        className={`block w-[21px] h-[21px] bg-white rounded-full shadow-[0_2px_2px] shadow-blackA4 transition-transform duration-100 will-change-transform ${
          isMetric ? "data-[state=checked]:translate-x-[19px]" : ""
        }`}
      />
    </Switch.Root>
    <label className="leading-none text-sm pl-[10px]" htmlFor="kilos-mode" aria-label="kilos">
      Kilos
    </label>
  </div>
);
