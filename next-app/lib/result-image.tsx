import {ImageResponse} from 'next/og';
import {getQuiz, getResult} from '@/content/quizzes';

function ResultIcon({icon, size}: {icon: string; size: number}) {
  const common = {width: size, height: size, viewBox: '0 0 100 100', fill: 'none', stroke: 'currentColor', strokeWidth: 6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  if (icon === '➜' || icon === '↗') return <svg {...common}><path d={icon === '↗' ? 'M22 78 76 24M43 24h33v33' : 'M15 50h66M57 26l24 24-24 24'} /></svg>;
  if (icon === '♡') return <svg {...common}><path d="M50 82 17 50C-2 28 28 7 50 31 72 7 102 28 83 50Z" /></svg>;
  if (icon === '☺') return <svg {...common}><circle cx="50" cy="50" r="38" /><path d="M34 40h1M65 40h1M31 58c9 16 29 19 39 0" /></svg>;
  if (icon === '☼') return <svg {...common}><circle cx="50" cy="50" r="18" /><path d="M50 5v17M50 78v17M5 50h17M78 50h17M18 18l12 12M70 70l12 12M82 18 70 30M30 70 18 82" /></svg>;
  if (icon === '◒') return <svg {...common}><circle cx="50" cy="50" r="38" /><path d="M50 12a38 38 0 0 1 0 76Z" fill="currentColor" stroke="none" /></svg>;
  if (icon === '☕') return <svg {...common}><path d="M20 38h54v23c0 14-11 25-25 25h-4c-14 0-25-11-25-25ZM74 45h7c15 0 15 22 0 22h-7M33 8c-9 9 9 14 0 23M52 8c-9 9 9 14 0 23" /></svg>;
  if (icon === '✿') return <svg {...common}><circle cx="50" cy="50" r="11" /><circle cx="50" cy="24" r="15" /><circle cx="75" cy="42" r="15" /><circle cx="65" cy="72" r="15" /><circle cx="35" cy="72" r="15" /><circle cx="25" cy="42" r="15" /></svg>;
  if (icon === '✓') return <svg {...common}><path d="m13 51 24 24 50-55" /></svg>;
  return <svg {...common}><path d="M50 7v86M7 50h86M20 20l60 60M80 20 20 80" /></svg>;
}

function Detail({label, value}: {label: string; value: string}) {
  return <div style={{display: 'flex', flexDirection: 'column', gap: 8, borderTop: '3px solid rgba(25,25,35,.22)', paddingTop: 18}}><span style={{fontSize: 22, fontWeight: 900, letterSpacing: 2}}>{label}</span><span style={{fontSize: 29, lineHeight: 1.25}}>{value}</span></div>;
}

export function resultImage(slug: string, resultSlug: string, portrait: boolean) {
  const q = getQuiz(slug);
  const r = q && getResult(q, resultSlug);
  if (!q || !r) return new Response('Not found', {status: 404});
  const size = portrait ? {width: 1080, height: 1920} : {width: 1200, height: 630};

  return new ImageResponse(
    <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: q.color, color: '#191923', padding: portrait ? 90 : 60, fontFamily: 'sans-serif'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: portrait ? 38 : 26, fontWeight: 800}}><span>almost.</span><span>THE QUIZ CLUB ✳</span></div>
      <div style={{display: 'flex', flexDirection: 'column', gap: portrait ? 24 : 14}}>
        <ResultIcon icon={r.icon} size={portrait ? 118 : 66} />
        <span style={{fontSize: portrait ? 32 : 22, fontWeight: 800, letterSpacing: 2}}>MY CURRENT VIBE</span>
        <span style={{fontSize: portrait ? 92 : 64, fontWeight: 900, lineHeight: 1.02}}>{r.name}</span>
        <span style={{fontSize: portrait ? 36 : 27, lineHeight: 1.25, maxWidth: portrait ? 860 : 1000}}>{r.summary}</span>
        {portrait ? <div style={{display: 'flex', flexDirection: 'column', gap: 24, marginTop: 28}}><Detail label="YOUR STRENGTH" value={r.strength} /><Detail label="KEEP IN MIND" value={r.watch} /><Detail label="TRY THIS NEXT" value={r.action} /></div> : null}
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: portrait ? 30 : 22, fontWeight: 700}}><span>{q.title}</span><span>almostunfiltereddating.com</span></div>
    </div>,
    size,
  );
}
