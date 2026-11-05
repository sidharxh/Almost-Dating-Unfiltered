import Header,{Footer} from '@/components/header';
import {QuizCard} from '@/components/cards';
import {quizzes} from '@/content/quizzes';
import StructuredData from '@/components/structured-data';
import {collectionSchema, pageMetadata} from '@/lib/seo';
const title = 'Dating Quiz Collection: Find Your Next Quick Quiz';
const description = 'Pick a free quiz about your dating style, texting habits, or ideal first date. Just 4–5 questions, with Google sign-in to see and share your result.';
export const metadata = pageMetadata(title, description, '/quizzes');
export default function Page(){return <div className="shell"><StructuredData data={{'@context':'https://schema.org', ...collectionSchema(quizzes,'/quizzes',title,description)}}/><Header/><main className="directory"><span className="eyebrow">THE DATING QUIZ COLLECTION ✳</span><h1>Which dating habit <em>has you curious?</em></h1><p>Start with the spark, the chat, or the first date. Each free dating quiz has four or five questions, one follow-up shaped by your answer, and a practical takeaway. Sign in with Google to see and share your result. Answer for who you are today.</p><div className="quiz-grid">{quizzes.map((q,i)=><QuizCard quiz={q} index={i} key={q.id}/>)}</div></main><Footer/></div>}
