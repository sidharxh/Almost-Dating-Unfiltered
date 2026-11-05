import {getQuiz} from '@/content/quizzes';
import {quizImage} from '@/lib/quiz-image';
export async function GET(_request:Request,{params}:{params:Promise<{slug:string}>}) {
  const quiz = getQuiz((await params).slug);
  return quiz ? quizImage(quiz) : new Response('Not found',{status:404});
}
