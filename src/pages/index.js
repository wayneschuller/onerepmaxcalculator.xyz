/** @format */

"use client";

import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import * as Switch from "@radix-ui/react-switch";
import Head from "next/head";
import { Card } from "../components/Card";
import { CalcSlider } from "../components/CalcSlider";
import { estimateE1RM } from "../components/estimateE1RM";
import { useRouter } from "next/router";

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

// let didInit = false;

const E1RMCalculator = () => {
  const [reps, setReps] = useState(5);
  const [weight, setWeight] = useState(225);
  const [isMetric, setIsMetric] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get some initial values from URL parameters
    const initReps = router?.query?.reps ?? 5;
    const initWeight = router?.query?.weight ?? 225;
    const initIsMetric = router?.query?.isMetric === "true" || false; // Default to pounds (isMetric should be boolean, not string)

    // Update state if query is now different to state values
    // This could be on first load
    // Or could be if user clicks back/forward browser button
    if (initReps !== reps) setReps(initReps);
    if (initWeight !== weight) setWeight(initWeight);
    if (initIsMetric !== isMetric) setIsMetric(initIsMetric);
  }, [router.query]);

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

  // When user lets go of weight slider, update the URL params
  // onCommit means we won't flood the browser with URL changes and get a working back button
  const handleWeightSliderCommit = (value) => {
    const newWeight = value;

    router.push({
      pathname: router.pathname,
      query: { ...router.query, weight: newWeight },
    });
  };

  // When user lets go of reps slider, update the URL params
  // onCommit means we won't flood the browser with URL changes and get a working back button
  const handleRepsSliderCommit = (value) => {
    const newReps = value;

    router.push({
      pathname: router.pathname,
      query: { ...router.query, reps: newReps },
    });
  };

  const handleEntryWeightChange = (e) => {
    const newWeight = e.target.value;
    //FIXME: do any error checking? Check for negative?
    setWeight(newWeight);

    // Update the browser URL instantly
    router.push({
      pathname: router.pathname,
      query: { ...router.query, weight: newWeight },
    });
  };

  const toggleIsMetric = (isMetric) => {
    let newWeight;

    if (!isMetric) {
      // Going from kg to lb
      newWeight = Math.round(weight * 2.2046);
      setIsMetric(false);
    } else {
      // Going from lb to kg
      newWeight = Math.round(weight / 2.2046);
      setIsMetric(true);
    }

    setWeight(newWeight);

    // Update the browser URL instantly
    router.push({
      pathname: router.pathname,
      query: { ...router.query, weight: newWeight, isMetric: isMetric },
    });
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
        <a
          href="https://en.wikipedia.org/wiki/One-repetition_maximum"
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
        >
          Wikipedia article
        </a>{" "}
        for theory)
      </div>
      <div className="flex flex-col sm:flex-row mt-4 mr-2">
        <div className="w-[5rem]">Reps:</div>
        <div className="flex-grow">
          <Reps reps={[reps]} onChange={handleRepsSliderChange} onCommit={handleRepsSliderCommit} />
        </div>
        <div className="w-[5rem] ml-2 md:ml-8">
          <b>{reps}</b>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row mt-4 mr-2">
        <div className="w-[5rem]">Weight:</div>
        <div className="flex-grow">
          <Weight
            weight={[weight]}
            onChange={handleWeightSliderChange}
            isMetric={isMetric}
            onCommit={handleWeightSliderCommit}
          />
        </div>
        <div className="w-[5rem] ml-2 md:ml-8">
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
      <div className="flex flex-1 justify-center mt-8 gap-2">
        <Card className="">
          <div className="">
            <div className="text-xl flex justify-center">
              Lift: {reps}@{weight}
              {isMetric ? "kg" : "lb"}{" "}
            </div>
            <div className="text-xl">Estimated One Rep Max: </div>
            <div className="text-3xl font-bold flex flex-row justify-center ">
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
const Reps = ({ reps, onChange, onCommit }) => {
  return (
    <div>
      <CalcSlider aria-label="Reps" value={reps} max="20" min={1} onChange={onChange} onCommit={onCommit} />
    </div>
  );
};

// Weight input component
const Weight = ({ weight, onChange, isMetric, onCommit }) => {
  let max = 600;

  if (isMetric) {
    max = 250;
  }

  return <CalcSlider aria-label="Weight" value={weight} max={max} min={1} onChange={onChange} onCommit={onCommit} />;
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
