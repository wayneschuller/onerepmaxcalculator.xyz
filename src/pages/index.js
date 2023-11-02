/** @format */

// import Image from "next/image";
import { Inter } from "next/font/google";
import * as Slider from "@radix-ui/react-slider";
// import next from "next"; // Docs say DO NOT do this. https://nextjs.org/docs/messages/import-next

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
  return (
    <div>
      <h2>E1RM One Rep Max Calculator</h2>
      <>
        Estimate your max single based on reps and weight (see{" "}
        <a href="https://en.wikipedia.org/wiki/One-repetition_maximum">Wikipedia article</a> for theory)
        <div className="flex flex-col sm:flex-row mt-4">
          <div className="w-2/12">Reps:</div>
          <div className="flex-grow">
            <Reps />
          </div>
          <div className="w-2/12 ml-2 md:ml-8">5</div>
        </div>
        <div className="flex flex-col sm:flex-row mt-4">
          <div></div>
          <div className="w-2/12">Weight:</div>
          <div className="flex-grow">
            <Reps />
          </div>
          <div className="w-2/12 ml-2 md:ml-8">105kg</div>
        </div>
        <Card className="mt-8" />
      </>
    </div>
  );
};

const Reps = () => (
  <div className="">
    <Slider.Root
      className="relative flex items-center select-none touch-none h-5"
      defaultValue={[50]}
      max={100}
      step={1}
    >
      <Slider.Track className="bg-black relative grow rounded-full h-[3px]">
        <Slider.Range className="absolute bg-white rounded-full h-full" />
      </Slider.Track>
      <Slider.Thumb
        className="block w-5 h-5 bg-white shadow-[0_2px_10px] shadow-black rounded-[10px] hover:bg-violet focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-black "
        aria-label="Reps"
      />
    </Slider.Root>
  </div>
);

const Card = () => {
  return (
    <div className="mt-8 justify-center rounded-md border border-slate-400 bg-slate-200 p-2 shadow-xl duration-75 md:p-4 md:hover:bg-slate-300 ring-1">
      320kg!
    </div>
  );
};
