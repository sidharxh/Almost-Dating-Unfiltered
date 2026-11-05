import {notFound} from 'next/navigation';import {getQuiz} from '@/content/quizzes';import Player from '@/components/player';
export const metadata={robots:{index:false,follow:true}};
export default async function Page({params}:{params:Promise<{slug:string}>}){const q=getQuiz((await params).slug);if(!q)notFound();return <Player quiz={q}/>}
