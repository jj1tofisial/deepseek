import { Inter } from "next/font/google";
import "./globals.css";
import "./prism.css";
import "katex/dist/katex.min.css";

import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "@/context/AppContext";
import { MathJaxContext } from "better-react-mathjax";
import ToasterWrapper from "@/components/ToasterWrapper"; // ⬅️ moved Toaster

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "DeepSeek - Clone",
  description: "Full Stack Project",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <AppContextProvider>
        <MathJaxContext
          config={{
            loader: { load: ["[tex]/ams"] },
            tex: { packages: { "[+]": ["ams"] } },
          }}
        >
          <html lang="en">
            <body className={`${inter.variable} antialiased`}>
              <ToasterWrapper /> {/* ✅ client-only */}
              {children}
            </body>
          </html>
        </MathJaxContext>
      </AppContextProvider>
    </ClerkProvider>
  );
}
