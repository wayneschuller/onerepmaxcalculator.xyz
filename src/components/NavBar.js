/** @format */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DarkModeToggle } from "@/components/DarkModeToggle";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <>
      <div className="ml-4 flex flex-row p-2">
        <div className="flex flex-1 flex-row gap-4 ">
          <Link
            href="/"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/" ? "text-foreground" : "text-foreground/60",
            )}
          >
            Calculator
          </Link>
          <Link
            href="/timer"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/timer" ? "text-foreground" : "text-foreground/60",
            )}
          >
            Timer
          </Link>
        </div>
        <div className="">
          <DarkModeToggle />
        </div>
      </div>
    </>
  );
}
