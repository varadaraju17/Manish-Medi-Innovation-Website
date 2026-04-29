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
  title: "Manish Medi Innovation | Best Medical Device Manufacturer India",
  description: "Top CE certified medical products supplier & ISO 13485 medical device company in India. Exporting hydrophilic DJ stents, catheters, & hospital disposables to 45+ countries. Affordable & reliable.",
  keywords: "Medical device manufacturer India, CE certified medical products supplier, Hospital disposable exporter India, ISO 13485 medical device company, Hydrophilic DJ stent manufacturer, Pigtail catheter exporter, Sclerotherapy needle supplier, Malecot catheter manufacturer, PCN catheter exporter, What is DJ stent and its uses, Types of medical catheters, Import regulations for medical devices, Best hydrophilic DJ stent manufacturer in India, Affordable CE-certified medical disposables, Reliable catheter supplier for hospitals, medical devices, urology, interventional radiology, gastroenterology, nephrology",
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
