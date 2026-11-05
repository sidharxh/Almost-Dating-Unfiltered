'use client';
import {useEffect,useRef,useState} from 'react';
import {useRouter} from 'next/navigation';
import type {Quiz} from '@/content/quizzes';
import {scoreQuiz} from '@/lib/scoring';
import {questionFor, answerQuestion} from '@/lib/quiz-flow';
import {track} from '@/components/analytics';

export default function Player({quiz}:{quiz:Quiz}) {
  const router=useRouter();
  const questionHeading=useRef<HTMLLegendElement>(null);
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState<number[]>([]);
  const [ready,setReady]=useState(false);
  const [started]=useState(()=>Date.now());
  const key=`almost:quiz:${quiz.id}:v${quiz.version}`;
  useEffect(()=>{
    let resumed=false;
    try {
      const saved=JSON.parse(sessionStorage.getItem(key)||'null');
      if(saved && Array.isArray(saved.answers) && saved.answers.every((x:unknown)=>Number.isInteger(x)&&Number(x)>=0&&Number(x)<quiz.results.length)) {
        const restored = saved.answers.slice(0,quiz.questions.length);
        resumed=restored.length>0;
        setAnswers(restored);
        const restoredStep = Number.isInteger(saved.step) ? saved.step : 0;
        setStep(Math.min(Math.max(restoredStep,0),restored.length,quiz.questions.length-1));
      }
    } catch {}
    setReady(true);
    if(!resumed)track('quiz_start',{quiz_id:quiz.id,quiz_version:quiz.version,question_count:quiz.questions.length});
  },[key,quiz]);
  useEffect(()=>{if(ready&&step>0)questionHeading.current?.focus()},[step,ready]);
  useEffect(()=>{if(ready)try{sessionStorage.setItem(key,JSON.stringify({step,answers}))}catch{}},[ready,key,step,answers]);
  const selected=answers[step];
  const question=questionFor(quiz,step,answers);
  function choose(value:number){setAnswers(previous=>answerQuestion(previous,step,value))}
  function next(){
    if(selected===undefined)return;
    track('quiz_question_answer',{quiz_id:quiz.id,quiz_version:quiz.version,question_number:step+1,question_count:quiz.questions.length});
    if(step<quiz.questions.length-1){setStep(step+1);return}
    try {
      const result=scoreQuiz(quiz,answers);
      try{sessionStorage.removeItem(key)}catch{}
      track('quiz_complete',{quiz_id:quiz.id,quiz_version:quiz.version,question_count:quiz.questions.length,completion_seconds:Math.min(3600,Math.floor((Date.now()-started)/1000))});
      router.push(`/quizzes/${quiz.slug}/results/${result.slug}`);
    } catch {setStep(0)}
  }
  if(!ready)return <main className="play-shell"><p>Opening your quiz…</p></main>;
  return <main className="play-shell" style={{'--theme':quiz.color,'--accent':quiz.accent} as React.CSSProperties}><header className="play-header"><a className="logo" href="/">almost<span>.</span></a><a href={`/quizzes/${quiz.slug}`}>Exit quiz ×</a></header><div className="player"><div className="progress-label"><span>QUESTION {step+1} OF {quiz.questions.length}</span><span>{Math.round((step/quiz.questions.length)*100)}%</span></div><div className="progress"><span style={{width:`${step/quiz.questions.length*100}%`}}/></div><p className="eyebrow">{quiz.title.toUpperCase()}</p><fieldset><legend ref={questionHeading} tabIndex={-1}>{question.prompt}</legend><div className="options">{question.options.map((option,i)=><label className={selected===i?'selected':''} key={i}><input type="radio" name={`question-${step}`} checked={selected===i} onChange={()=>choose(i)}/><span className="option-letter">{String.fromCharCode(65+i)}</span><span>{option}</span><span className="option-check">{selected===i?'✓':'○'}</span></label>)}</div></fieldset><div className="player-actions"><button className="back-button" onClick={()=>setStep(step-1)} disabled={step===0}>← Back</button><button className="button dark" onClick={next} disabled={selected===undefined}>{step===quiz.questions.length-1?'See my result':'Next question'} <span>→</span></button></div><p className="disclaimer">Answer for how you feel lately. A follow-up adapts to your answer. Changing an earlier choice resets the answers after it.</p></div></main>;
}
