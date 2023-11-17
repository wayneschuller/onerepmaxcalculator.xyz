/** @format */
"use client";
import * as Slider from "@radix-ui/react-slider";

export const CalcSlider = ({ value, onChange, onCommit, min, max, step }) => (
  <Slider.Root
    className="relative flex items-center select-none touch-none h-5"
    value={value}
    min={min}
    max={max}
    step={step}
    onValueChange={onChange}
    onValueCommit={onCommit}
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
