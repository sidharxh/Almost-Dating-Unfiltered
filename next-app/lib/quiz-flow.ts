import type { Quiz, QuestionCopy } from '../content/quizzes';

export function questionFor(quiz: Quiz, step: number, answers: number[]): QuestionCopy {
  const question = quiz.questions[step];
  if (!question) throw new Error('Question not found');
  const branch = question.followUp;
  return branch?.variants[answers[branch.questionIndex]] ?? question;
}

// A changed earlier choice can change a later prompt. Never score a stale answer.
export function answerQuestion(answers: number[], step: number, value: number): number[] {
  if (answers[step] === value) return answers;
  return [...answers.slice(0, step), value];
}
