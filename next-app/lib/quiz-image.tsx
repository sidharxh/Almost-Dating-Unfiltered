import {ImageResponse} from 'next/og';
import type {Quiz} from '@/content/quizzes';

export function quizImage(quiz?: Quiz) {
  return new ImageResponse(
    <div style={{display:'flex',flexDirection:'column',justifyContent:'space-between',width:'100%',height:'100%',background:quiz?.color ?? '#c4aeff',color:'#191923',padding:64,fontFamily:'sans-serif'}}>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:30}}><span>almost.</span><span>THE QUIZ CLUB</span></div>
      <div style={{display:'flex',flexDirection:'column',gap:20}}>
        <span style={{fontSize:22,letterSpacing:3}}>{quiz?.seo.topic ?? 'FREE DATING QUIZZES'}</span>
        <span style={{fontSize:76,fontWeight:700,lineHeight:1.05}}>{quiz?.title ?? 'Dating quizzes. Get to know your style.'}</span>
        <span style={{fontSize:30,lineHeight:1.3}}>{quiz?.hook ?? 'Your dating style, texting habits, and first-date preferences.'}</span>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:23}}><span>{quiz ? quiz.questions.length : '4–5'} questions · Free results with Google sign-in</span><span>almostunfiltereddating.com</span></div>
    </div>,
    {width:1200,height:630},
  );
}
