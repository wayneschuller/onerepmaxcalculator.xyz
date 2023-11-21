/** @format */

"use client";

import Link from "next/link";
import { DarkModeToggle } from "@/components/DarkModeToggle";

export default function NavBar() {
  let blah;

  return (
    <>
      <div className="ml-4 flex flex-row p-2">
        <div className="flex flex-1 flex-row gap-4 ">
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
