/** @format */

import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/theme-provider";

export default function App({ Component, pageProps }) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Component {...pageProps} />
      </ThemeProvider>
      <Analytics />
    </>
  );
}
