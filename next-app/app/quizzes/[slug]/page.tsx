import {notFound} from 'next/navigation';
import {getQuiz, quizzes} from '@/content/quizzes';
import Header,{Footer} from '@/components/header';
import {TrackView} from '@/components/analytics';
import StructuredData from '@/components/structured-data';
import {quizMetadata, quizSchema} from '@/lib/seo';
type Props = {params: Promise<{slug: string}>};
export function generateStaticParams(){return quizzes.map(q=>({slug:q.slug}))}
export async function generateMetadata({params}:Props){const q=getQuiz((await params).slug);if(!q)notFound();return quizMetadata(q)}
export default async function Page({params}:Props){const q=getQuiz((await params).slug);if(!q)notFound();return <div className="shell"><StructuredData data={{'@context':'https://schema.org',...quizSchema(q)}}/><Header/><TrackView event="quiz_landing_view" quizId={q.id} version={q.version}/><main className="landing" style={{'--theme':q.color,'--accent':q.accent} as React.CSSProperties}><div><a href="/quizzes" className="back">← All quizzes</a><p className="eyebrow">{q.seo.topic} ✳</p><h1>{q.title}</h1><p>{q.intro}</p><div className="facts"><span>✦ {q.questions.length} questions</span><span>✦ Free to take & share</span></div><a className="button dark" href={`/quizzes/${q.slug}/play`}>Start quiz <span>↗</span></a><small>Sign in with Google to see your result and download your card.</small><p className="disclaimer">{q.researchNote} {q.sources.map(source=><a key={source.url} href={source.url}><u>{source.label}</u></a>)}. <a href="/about"><u>How our quizzes work.</u></a></p></div><div className="landing-art" aria-hidden="true"><span>{q.symbol}</span><strong>HELLO,<br/>CURRENT<br/>YOU<span>✳</span></strong><i>almost. quiz club</i></div></main><Footer/></div>}
