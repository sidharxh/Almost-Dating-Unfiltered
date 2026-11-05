import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quizzes } from '../content/quizzes.ts';
import { scoreQuiz } from '../lib/scoring.ts';
for (const quiz of quizzes) {
  test(`${quiz.id}: all four results reachable and content complete`, () => {
    assert.equal(quiz.questions.length, 8);
    assert.equal(quiz.results.length, 4);
    for (const question of quiz.questions) assert.equal(question.options.length, 4);
    for (let i = 0; i < 4; i++) assert.equal(scoreQuiz(quiz, Array(8).fill(i)).slug, quiz.results[i].slug);
    assert.equal(scoreQuiz(quiz, [0,1,2,3,0,1,2,3]).slug, quiz.results[0].slug);
    assert.throws(() => scoreQuiz(quiz, [0]));
    assert.throws(() => scoreQuiz(quiz, [0,0,0,0,0,0,0,4]));
    assert.throws(() => scoreQuiz(quiz, Array(8)));
  });
}
