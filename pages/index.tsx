import { Geist, Geist_Mono } from "next/font/google";
import HeroSection from "./components/fragments/HeroSection";
import Services from "./components/fragments/Service";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
  <HeroSection/>
  <Services/>    
    </>
  );
}
