/** @format */

"use client";

import Link from "next/link";
import { DarkModeToggle } from "@/components/DarkModeToggle";

export default function NavBar() {
  let blah;

  return (
    <>
      <div className="flex flex-row ml-4 p-2">
        <div className="flex flex-row flex-1 gap-4 ">
          <Link href="/">Calculator</Link>
          <Link href="/timer">Timer</Link>
        </div>
        <div className="">
          <DarkModeToggle />
        </div>
      </div>
    </>
  );
}
