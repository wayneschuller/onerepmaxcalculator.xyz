/** @format */

"use client";

import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import Head from "next/head";
import { WSCard } from "../components/Card";
import { CalcSlider } from "../components/CalcSlider";
import { estimateE1RM } from "../lib/estimateE1RM";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { ThemeProvider } from "@/components/theme-provider";
import { UnitChooser } from "../components/UnitChooser";

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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <E1RMCalculator />
        </ThemeProvider>
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

  const handleCopyToClipboard = async () => {
    const sentenceToCopy = `Lifting ${reps}@${weight}${
      isMetric ? "kg" : "lb"
    } indicates a one rep max of ${estimateE1RM(reps, weight, "Brzycki")}${
      isMetric ? "kg" : "lb"
    } using Brzycki algorithm.\n(Source: onerepmaxcalculator.org/?reps=${reps}&weight=${weight}&isMetric=${isMetric})`;

    // Create a temporary textarea element
    const textarea = document.createElement("textarea");
    // Set the value of the textarea to the sentence you want to copy
    textarea.value = sentenceToCopy;
    // Append the textarea to the document
    document.body.appendChild(textarea);
    // Select the text in the textarea
    textarea.select();

    // Execute the 'copy' command to copy the selected text to the clipboard
    // FIXME: deprecated function still works
    document.execCommand("copy");
    // Remove the temporary textarea
    document.body.removeChild(textarea);
    alert("Result copied to clipboard. Use ctrl-v to paste elsewhere."); // FIXME: use toast here

    // This fails in React - but it's the new API
    // if (navigator?.clipboard?.writeText) {
    //   try {
    //     await navigator.clipboard.writeText(sentenceToCopy);
    //     alert("Result copied to clipboard. Use ctrl-v to paste elsewhere.");
    //   } catch (error) {
    //     console.error("Unable to copy to clipboard:", error);
    //   }
    // } else {
    //   // Fallback for browsers that do not support the Clipboard API
    //   console.warn("Clipboard API not supported. You may need to copy the text manually.");
    // }
  };

  return (
    <div className="h-min w-11/12 md:w-4/5 border-2 border-background bg-orange-100 dark:bg-orange-950 rounded-lg p-4 md:p-6 bg-muted">
      <div className="flex flex-row gap-1 md:gap-2">
        <h1 className="flex-1 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ">
          E1RM One Rep Max Calculator
        </h1>
        <div className="flex flex-col md:flex-row gap-1">
          <UnitChooser isMetric={isMetric} onSwitchChange={toggleIsMetric} />
          <DarkModeToggle />
        </div>
      </div>
      <h3 className="flex-1 scroll-m-20 text-xl mt-2 md:text-2xl tracking-tight">
        Estimate your max single based on reps and weight (see this{" "}
        <a
          href="https://en.wikipedia.org/wiki/One-repetition_maximum"
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
        >
          Wikipedia article
        </a>{" "}
        for the theory)
      </h3>
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
                className="w-16 bg-background text-foreground"
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
      <div className="flex flex-1 justify-center mt-8">
        <WSCard className="">
          <div className="">
            <div className="text-xl flex justify-center">
              Lift: {reps}@{weight}
              {isMetric ? "kg" : "lb"}{" "}
            </div>
            <div className="text-xl">Estimated One Rep Max: </div>
            <div className="text-3xl font-bold flex justify-center ">
              {" " + estimateE1RM(reps, weight, "Brzycki")}
              {isMetric ? "kg" : "lb"}
            </div>
            <div className="flex justify-center text-muted-foreground items-center">(Brzycki formula)</div>
          </div>
        </WSCard>
      </div>
      <div className="flex justify-center mt-4">
        <ShareButton onClick={handleCopyToClipboard} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 justify-center mt-4 gap-4">
        <WSCard className="">
          <div className="flex flex-col justify-center items-center">
            Epley:
            <div className="font-bold">
              {estimateE1RM(reps, weight, "Epley")}
              {isMetric ? "kg" : "lb"}
            </div>
          </div>
        </WSCard>
        <WSCard>
          <div className="flex flex-col justify-center items-center">
            McGlothin:
            <div className="font-bold">
              {estimateE1RM(reps, weight, "McGlothin")}
              {isMetric ? "kg" : "lb"}
            </div>
          </div>
        </WSCard>
        <WSCard>
          <div className="flex flex-col justify-center items-center">
            Lombardi:
            <div className="font-bold">
              {estimateE1RM(reps, weight, "Lombardi")}
              {isMetric ? "kg" : "lb"}
            </div>
          </div>
        </WSCard>
        <WSCard>
          <div className="flex flex-col justify-center items-center">
            Mayhew et al.:
            <div className="font-bold">
              {estimateE1RM(reps, weight, "Mayhew")}
              {isMetric ? "kg" : "lb"}
            </div>
          </div>
        </WSCard>
        <WSCard>
          <div className="flex flex-col justify-center items-center">
            O&apos;Conner et al.:
            <div className="font-bold">
              {estimateE1RM(reps, weight, "OConner")}
              {isMetric ? "kg" : "lb"}
            </div>
          </div>
        </WSCard>
        <WSCard>
          <div className="flex flex-col justify-center items-center">
            Wathen:
            <div className="font-bold">
              {estimateE1RM(reps, weight, "Wathen")}
              {isMetric ? "kg" : "lb"}
            </div>
          </div>
        </WSCard>
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

const ShareButton = ({ onClick }) => {
  return (
    <>
      <Button className="border" variant="secondary" onClick={onClick}>
        <div className="mr-2">Copy to clipboard</div>
        <ShareIcon />
      </Button>
    </>
  );
};

const ShareIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
      />
    </svg>
  );
};
