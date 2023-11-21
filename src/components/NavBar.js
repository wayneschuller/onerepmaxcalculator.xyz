/** @format */

import { DarkModeToggle } from "@/components/DarkModeToggle";

export default function NavBar() {
  let blah;

  return (
    <>
      <div className="flex flex-row p-2">
        <div className="flex-1">Calculator, Lifing Timer</div>
        <div className="">
          <DarkModeToggle />
        </div>
      </div>
    </>
  );
}
