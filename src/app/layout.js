import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Manish Medi Innovation | Precision Medical Devices",
  description: "World-class manufacturer of precision medical devices across Urology, Interventional Radiology, Gastroenterology, Gynaecology & Nephrology. ISO 9001:2008 Certified. Exporting to 45+ countries. 1M+ units per month.",
  keywords: "medical devices, urology, interventional radiology, gastroenterology, nephrology, medical instruments, ISO certified, catheters, guide wires, biopsy",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
