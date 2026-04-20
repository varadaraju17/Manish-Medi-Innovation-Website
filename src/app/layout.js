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

import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Hidden element for Google Translate engine */}
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        
        {/* Google Translate Init Logic */}
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,ar,es,fr,ru,zh-CN,hi',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>
        {/* Google Translate API Script */}
        <Script 
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        
        {children}
      </body>
    </html>
  );
}
