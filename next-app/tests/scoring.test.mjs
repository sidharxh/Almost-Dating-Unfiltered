import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quizzes } from '../content/quizzes.ts';
import { scoreQuiz } from '../lib/scoring.ts';
import { questionFor, answerQuestion } from '../lib/quiz-flow.ts';
const counts = {dating_energy:5, texting_vibe:4, first_date_style:5};
for (const quiz of quizzes) {
  test(`${quiz.id}: all four results reachable and content complete`, () => {
    const count = quiz.questions.length;
    assert.equal(count, counts[quiz.id]);
    assert.equal(quiz.results.length, 4);
    for (const question of quiz.questions) assert.equal(question.options.length, 4);
    for (let i = 0; i < 4; i++) assert.equal(scoreQuiz(quiz, Array(count).fill(i)).slug, quiz.results[i].slug);
    if (count === 4) assert.equal(scoreQuiz(quiz, [0,1,2,3]).slug, quiz.results[0].slug);
    else assert.equal(scoreQuiz(quiz, [0,1,0,1,2]).slug, quiz.results[0].slug);
    assert.throws(() => scoreQuiz(quiz, [0]));
    assert.throws(() => scoreQuiz(quiz, [...Array(count-1).fill(0),4]));
    assert.throws(() => scoreQuiz(quiz, Array(count)));
  });
  test(`${quiz.id}: adaptive follow-up resolves all four earlier choices`, () => {
    const step = quiz.questions.findIndex(question => question.followUp);
    assert.ok(step > 0);
    const branch = quiz.questions[step].followUp;
    assert.ok(branch.questionIndex < step);
    assert.equal(branch.variants.length, 4);
    const prompts = new Set();
    for (let choice=0; choice<4; choice++) {
      const answers = Array(step).fill(0);
      answers[branch.questionIndex] = choice;
      const question = questionFor(quiz, step, answers);
      assert.equal(question, branch.variants[choice]);
      assert.equal(question.options.length, 4);
      assert.ok(question.options.every(option => option.trim().length > 0));
      prompts.add(question.prompt);
    }
    assert.equal(prompts.size, 4);
    assert.equal(questionFor(quiz,0,[]),quiz.questions[0]);
  });
  test(`${quiz.id}: every answer path ends in a valid result`, () => {
    const length = quiz.questions.length;
    for(let path=0; path<4**length; path++) {
      const answers = Array.from({length},(_,step) => Math.floor(path / 4**step) % 4);
      for(let step=0; step<length; step++) {
        assert.ok(questionFor(quiz,step,answers.slice(0,step)).options[answers[step]]);
      }
      assert.ok(quiz.results.includes(scoreQuiz(quiz,answers)));
    }
  });
}
test('changing an earlier choice clears dependent answers, keeping the same choice preserves them', () => {
  const previous = [0,1,2,3,0];
  assert.deepEqual(answerQuestion(previous,0,2),[2]);
  assert.deepEqual(answerQuestion(previous,2,1),[0,1,1]);
  assert.strictEqual(answerQuestion(previous,0,0),previous);
  assert.deepEqual(previous,[0,1,2,3,0]);
});
