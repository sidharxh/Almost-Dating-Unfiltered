import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@/components/analytics';
export const metadata:Metadata={metadataBase:new URL('https://almostunfiltereddating.com'),title:{default:'Almost — Fun dating quizzes',template:'%s | Almost'},description:'Fun dating quizzes. Surprisingly useful results. Find your dating energy, texting vibe, and first-date style.',robots:{index:true,follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}<Analytics /></body></html>}
