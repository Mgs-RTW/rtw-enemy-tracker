import "./globals.css";
import { Inter } from "next/font/google";
import Home from "./page";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Enemy Tracker",
  description: "Made by those who are awesome",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Home
          config={{
            apiKey: process.env.GOOGLE_API_KEY,
            sheetId: process.env.GOOGLE_SHEET_ID,
          }}
        />
      </body>
    </html>
  );
}
