import type { Quiz } from '@/content/quizzes';
export function scoreQuiz(quiz: Quiz, answers: number[]) {
  if (answers.length !== quiz.questions.length || Array.from(answers).some(a => !Number.isInteger(a) || a < 0 || a > 3)) throw new Error('Complete each question first');
  const scores = [0,0,0,0];
  answers.forEach(answer => { scores[answer]++; });
  // The earliest result in the quiz definition wins a tie.
  const winner = scores.indexOf(Math.max(...scores));
  return quiz.results[winner];
}
