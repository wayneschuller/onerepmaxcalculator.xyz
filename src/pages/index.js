/** @format */

// import Image from "next/image";
import { Inter } from "next/font/google";
// import next from "next"; // Docs say DO NOT do this. https://nextjs.org/docs/messages/import-next

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    // <main> from inital next.js default template
    <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}>
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
      </>
    </div>
  );
};
