import {notFound} from 'next/navigation';
import {getQuiz} from '@/content/quizzes';
import Player from '@/components/player';
import {pageMetadata} from '@/lib/seo';
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props) {
  const quiz=getQuiz((await params).slug);
  if(!quiz)notFound();
  return {...pageMetadata(quiz.title,quiz.seo.description,`/quizzes/${quiz.slug}/play`,`/quizzes/${quiz.slug}/opengraph-image`),robots:{index:false,follow:true}};
}
export default async function Page({params}:Props){const q=getQuiz((await params).slug);if(!q)notFound();return <Player quiz={q}/>}
