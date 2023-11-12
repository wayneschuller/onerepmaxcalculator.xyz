/** @format */
"use client";

export function Card({ children }) {
  return (
    <div className="flex  justify-center  rounded-md border border-slate-400 bg-slate-200 dark:bg-slate-900 p-2 shadow-md shadow-slate-600 duration-75 md:p-4 md:hover:bg-slate-300 md:dark:hover:bg-slate-800 ring-1">
      {children}
    </div>
  );
}
