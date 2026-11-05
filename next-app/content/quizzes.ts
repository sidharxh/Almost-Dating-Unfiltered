export type Outcome = {
  slug: string;
  name: string;
  summary: string;
  strength: string;
  watch: string;
  action: string;
  icon: string;
};
export type QuestionCopy = { prompt: string; options: string[] };
export type QuizQuestion = QuestionCopy & {
  followUp?: { questionIndex: number; variants: QuestionCopy[] };
};
export type Quiz = {
  id: string;
  slug: string;
  version: number;
  title: string;
  hook: string;
  color: string;
  accent: string;
  symbol: string;
  edit: string;
  intro: string;
  researchNote: string;
  sources: { label: string; url: string }[];
  seo: { title: string; description: string; topic: string; keywords: string[] };
  results: Outcome[];
  questions: QuizQuestion[];
};

// Each option awards one point to the outcome in the same position.
// These are original reflection prompts, not a validated psychological scale.
const q = (prompt: string, ...options: string[]) => ({ prompt, options });
const followUp = (questionIndex: number, variants: QuestionCopy[]): QuizQuestion => ({
  ...variants[0], followUp: { questionIndex, variants },
});
export const resultContext = 'A snapshot of your answers today. Your tastes, type, and habits can change with experience and with the person you’re dating. These result types are for reflection, not a validated personality test.';
export const quizzes: Quiz[] = [
  {
    id: 'dating_energy',
    slug: 'dating-energy',
    version: 2,
    title: 'What’s Your Dating Style?',
    hook: 'The spark, the slow build, or “so, what are we?” Find what gets you interested.',
    color: '#ff4f9a',
    accent: '#ffb57d',
    symbol: '✳',
    edit: 'THE CONNECTION EDIT',
    intro: 'Your dating style is how you tend to approach a new connection. This free dating style quiz explores shared fun, growing trust, clear intentions, and curiosity. Five everyday situations, with a follow-up shaped by your answers. Go with the you who’s dating right now.',
    researchNote: 'Research on autonomy and connection informs the themes. The four result types and scoring are our own, not a validated personality or attachment test. Your tastes and type can change.',
    sources: [{ label: 'Patrick et al. (2007): relationship needs', url: 'https://pubmed.ncbi.nlm.nih.gov/17352602/' }],
    seo: {
      title: 'Free Dating Style Quiz: What’s Your Dating Energy?',
      description: 'What’s your dating style? Try 5 questions about connection, trust, and intentions, with an adaptive follow-up. Free results and sharing with Google sign-in.',
      topic: 'DATING STYLE QUIZ',
      keywords: ['dating style quiz', 'what is my dating style', 'dating energy quiz'],
    },
    results: [
      { slug: 'the-spark', name: 'The Spark', summary: 'You notice the laugh before the checklist. Shared fun is often your way into a connection.', strength: 'You give someone an easy opening to join in. A little warmth can make a first conversation feel less like an audition.', watch: 'A fun evening can be a good start. Give yourself time to notice whether you also feel heard and free to be yourself.', action: 'After the banter, ask: “What’s something you’ve been looking forward to?” Leave room for the real answer.', icon: '✳' },
      { slug: 'the-slow-burn', name: 'The Slow Burn', summary: 'Your interest grows with the little things. Remembering your coffee order has a fighting chance.', strength: 'You pay attention to consistency. Feeling understood matters to you, and you give people time to show who they are.', watch: 'A quiet pace can be hard to read from the outside. Someone may need a small sign that you want to keep getting to know them.', action: 'Try: “I’m enjoying this. I warm up gradually, but I’d like to see you again.” Clear can still be gentle.', icon: '☼' },
      { slug: 'the-straight-shooter', name: 'The Straight Shooter', summary: 'You like a little flirting and a clear sentence. “Let’s see” works better when someone says what they mean.', strength: 'You make your preferences easier to understand. That gives both people room to choose a connection that works for them.', watch: 'Clarity works best when there’s room for another answer. Ask what they want without turning the date into a deadline.', action: 'Try: “I’m open to something steady if it feels right. What are you hoping for?” Then listen without negotiating.', icon: '➜' },
      { slug: 'the-curious-explorer', name: 'The Curious Explorer', summary: 'An unexpected answer can be more interesting than a perfect profile. You like finding out who’s actually there.', strength: 'You leave room to be surprised. Curiosity can help you notice the person in front of you beyond your usual checklist.', watch: 'Possibility can keep you interested even when the present feels thin. Check whether you enjoy this connection as it is.', action: 'After a date, name one thing you liked about the actual person and one thing you still want to understand.', icon: '✦' },
    ],
    questions: [
      q('A match sends a surprisingly good opener. What pulls you in?',
        'We’re making each other laugh already',
        'They noticed something specific about me',
        'They sound interested and say what they want',
        'Their take makes me want to ask another question'),
      q('You leave a good first date. Which moment gets the replay?',
        'The bit where neither of us could stop laughing',
        'I relaxed enough to stop rehearsing my answers',
        'We talked honestly about what we’re looking for',
        'They surprised me in a way I want to explore'),
      followUp(0, [
        q('The banter pulled you in. What would make you want another date?',
          'We find more things to laugh about together',
          'I start feeling comfortable showing my quieter side',
          'We say plainly that we’d like to see each other',
          'I discover something about them I didn’t expect'),
        q('Being noticed pulled you in. What would keep that feeling going?',
          'We turn those little details into shared jokes',
          'They keep paying attention as we get to know each other',
          'They follow through when they say they want to meet',
          'We stay curious about parts of each other we haven’t seen'),
        q('Clear interest pulled you in. What else would make it feel right?',
          'We can be playful without overthinking every move',
          'I feel increasingly comfortable being myself',
          'We can talk honestly about what we both want',
          'There’s still plenty about them I want to discover'),
        q('Their unexpected take pulled you in. What would you want next?',
          'A conversation that keeps making us laugh',
          'Time to get comfortable beyond the interesting first impression',
          'A sense of whether our intentions fit',
          'Another chance to explore how they see the world'),
      ]),
      q('There’s chemistry, but they need a slower pace. What would help you?',
        'Knowing we can still have fun while taking our time',
        'A steady rhythm where trust has room to grow',
        'Talking about what “slow” means to each of us',
        'Staying curious without deciding the ending yet'),
      q('Right now, which connection would you make room for?',
        'One that brings more play into my week',
        'One where I can settle in and feel known',
        'One where we can be honest about what we want',
        'One that lets me discover something new about us'),
    ],
  },
  {
    id: 'texting_vibe',
    slug: 'texting-vibe',
    version: 2,
    title: 'What’s Your Texting Style?',
    hook: 'Banter, thoughtful check-ins, or a plan with a postcode? Meet your messaging habits.',
    color: '#3454f5',
    accent: '#d7f75b',
    symbol: '✉',
    edit: 'THE CHAT EDIT',
    intro: 'Your texting style is the rhythm and tone you prefer when messaging someone you like. This free texting style quiz explores humor, attention, making plans, and space to reply. Four familiar chat situations, with a follow-up that responds to your first answer.',
    researchNote: 'Email experiments found that people overestimated how clearly they conveyed tone. We use that idea as a prompt for reflection about texting, not proof about your messages. Your texting habits can change.',
    sources: [{ label: 'Kruger et al. (2005): tone in email', url: 'https://pubmed.ncbi.nlm.nih.gov/16393025/' }],
    seo: {
      title: 'Free Texting Style Quiz: What Kind of Texter Are You?',
      description: 'What kind of texter are you? Try 4 everyday dating chat situations, with an adaptive follow-up. Free texting style results and sharing with Google sign-in.',
      topic: 'TEXTING STYLE QUIZ',
      keywords: ['texting style quiz', 'what kind of texter are you', 'dating communication quiz'],
    },
    results: [
      { slug: 'the-banter-starter', name: 'The Banter Starter', summary: 'You flirt in callbacks. A shared joke is your favorite way to keep the conversation going.', strength: 'You give the chat a little momentum. Remembering a joke can say “I was paying attention” without a grand speech.', watch: 'The tone you hear in your head may not arrive with the message. A joke can need a friendly cue or a simple clarification.', action: 'Keep the joke, then add a real question: “But seriously, how did that thing you were nervous about go?”', icon: '☺' },
      { slug: 'the-thoughtful-texter', name: 'The Thoughtful Texter', summary: 'You remember the Tuesday presentation. Your version of flirting often looks like paying attention.', strength: 'You pick up details and return to them. That can help someone feel there’s a person listening on the other side of the screen.', watch: 'A short reply gives you very little information. Before writing its emotional backstory, ask what they meant or check in later.', action: 'Try: “Is this a busy-day reply or something you want to talk about?” Ask with curiosity and let them explain.', icon: '♡' },
      { slug: 'the-direct-planner', name: 'The Direct Planner', summary: 'Your favorite plot development is a time and a place. You’d rather meet than keep saying “we should.”', strength: 'You make the next step easy to respond to. A specific invitation also leaves room for a clear yes, no, or different idea.', watch: 'Efficiency can look chilly when tone is missing. A small sign of warmth helps the invitation feel personal.', action: 'Try: “I’ve enjoyed talking to you. Coffee Thursday or Saturday? Happy to find a time that suits us both.”', icon: '↗' },
      { slug: 'the-slow-and-steady-texter', name: 'The Slow-and-Steady Texter', summary: 'You can like someone and put your phone down. A conversation feels better when there’s room to breathe.', strength: 'You make space for life outside the chat. Sharing your preferred rhythm can help two people find a pace they both enjoy.', watch: 'Your relaxed pace may be unclear to someone else. A reply time alone cannot explain your interest or theirs.', action: 'Try: “I’m usually offline during work, but I like hearing from you. Evenings are better for a proper chat.”', icon: '◒' },
    ],
    questions: [
      q('A match says, “How was your day?” Your most natural reply?',
        '“My coffee did the heavy lifting.” Then a funny detail',
        'A small story, then a question about their day',
        'A quick update and a suggestion to catch up',
        'A proper reply once I can give it some attention'),
      q('A message lands a little flat. How would you rather clear it up?',
        'Add a light cue: “That was affectionate teasing, promise”',
        'Ask how it came across and explain what I meant',
        'Say directly what I was trying to communicate',
        'Come back when I have the headspace to explain'),
      followUp(0, [
        q('The joke got a laugh. Where would you like the chat to go?',
          'Keep the bit going while we’re both enjoying it',
          'Ask something that gets beyond the punchline',
          'Use the good mood to suggest meeting',
          'Leave it on a good note and catch up later'),
        q('You’ve shared a little of your day. What reply feels best?',
          'A playful callback that makes me smile',
          'A question that shows they noticed the detail',
          'An invitation to continue the conversation in person',
          'A warm reply with no pressure to stay online'),
        q('You’ve suggested catching up. What helps until you meet?',
          'A few jokes to keep the anticipation fun',
          'A thoughtful check-in about their week',
          'Confirming the plan so neither of us has to guess',
          'Knowing we can save some conversation for the date'),
        q('You finally have time to reply. What would you enjoy sending?',
          'A funny detail that’s been waiting for its audience',
          'A considered reply to something they shared',
          'A quick update and a plan to meet',
          'A relaxed hello, without making it a long exchange'),
      ]),
      q('What would make a dating chat feel good this week?',
        'A little back-and-forth that makes me grin',
        'Feeling that we’re actually listening to each other',
        'Turning a nice conversation into something on the calendar',
        'A pace that fits both our lives without guesswork'),
    ],
  },
  {
    id: 'first_date_style',
    slug: 'first-date-style',
    version: 2,
    title: 'What’s Your First-Date Style?',
    hook: 'Coffee, a little adventure, or a beautifully clear plan? Find a date that feels like you.',
    color: '#c4aeff',
    accent: '#ff9a55',
    symbol: '✿',
    edit: 'THE DATE EDIT',
    intro: 'Your first-date style is the setting and pace that help you enjoy meeting someone. This free first-date quiz explores novelty, conversation, spontaneity, and planning. Five situations, with a follow-up based on your preferred plan, point to an idea that fits you right now.',
    researchNote: 'Research on shared new activities in existing couples inspired our novelty theme. It doesn’t establish an ideal first date or predict chemistry. Your ideal date can change with your energy and company.',
    sources: [{ label: 'Aron et al. (2000): shared activities', url: 'https://pubmed.ncbi.nlm.nih.gov/10707334/' }],
    seo: {
      title: 'Free First-Date Quiz: What’s Your Ideal Date Style?',
      description: 'What’s your ideal first-date style? Try 5 questions about coffee, activities, and plans, with an adaptive follow-up. Free results with Google sign-in.',
      topic: 'FIRST-DATE QUIZ',
      keywords: ['first date quiz', 'ideal first date quiz', 'first date style'],
    },
    results: [
      { slug: 'the-adventure-picker', name: 'The Adventure Picker', summary: 'You’d rather have something to do than wonder where to put your hands. A new experience gives you a starting point.', strength: 'You bring a shared focus to the date. A new activity gives you something to react to together and a story beyond “we got drinks.”', watch: 'Exciting is personal. Check the other person’s comfort, budget, and energy before turning coffee into a climbing expedition.', action: 'Offer a small adventure with an easy alternative: “Mini golf or a café? I’m genuinely happy with either.”', icon: '✦' },
      { slug: 'the-cozy-connector', name: 'The Cozy Connector', summary: 'A seat, a decent drink, and enough quiet to hear the answer. You like a date with room for conversation.', strength: 'You choose space to pay attention. A comfortable setting helps you focus on the person instead of performing a perfect evening.', watch: 'Even good conversation needs breathing room. Share something of your own so it feels like an exchange, not an interview.', action: 'Pick a café you can both reach easily. Ask about something they’ve mentioned, then share a related detail from your week.', icon: '☕' },
      { slug: 'the-playful-improviser', name: 'The Playful Improviser', summary: 'You like a starting point and room for a detour. The best part of the date might be the bit nobody planned.', strength: 'You make room for what you both enjoy in the moment. An unexpected turn can become a shared decision instead of a spoiled plan.', watch: 'Spontaneous feels easier when nobody has to guess the basics. Agree on where, when, and roughly how long before you improvise.', action: 'Try a market or a walk with a clear meeting spot. Offer the next stop as a question: “Fancy staying, or shall we call it here?”', icon: '✿' },
      { slug: 'the-intentional-planner', name: 'The Intentional Planner', summary: 'You find romance in “I booked it.” A few thoughtful details let you relax and enjoy who you’re meeting.', strength: 'You think about the experience from both sides. Checking timing and preferences makes it easier for the other person to have a say.', watch: 'A plan is allowed to change. Leave room to notice when either of you wants a quieter place, a different pace, or an earlier finish.', action: 'Send the essentials and one invitation: “Table at 7, easy to get to. Does that work for you, or would you prefer something else?”', icon: '✓' },
    ],
    questions: [
      q('You’re choosing a first date. Which plan gets your vote?',
        'An easy activity neither of us needs to be good at',
        'A café where we can hear each other',
        'A market we can wander around together',
        'A place and time we’ve both agreed on'),
      followUp(0, [
        q('You picked an activity. What would make it a good first date?',
          'Trying something new together, even if we’re terrible',
          'Enough quiet moments to actually talk',
          'The freedom to change course if something else looks fun',
          'Knowing we’ve chosen something that suits us both'),
        q('You picked a café. What are you hoping for?',
          'A new spot that gives us something to discover',
          'A conversation we don’t have to shout through',
          'An easy start, then deciding together what comes next',
          'A comfortable plan with the practical bits settled'),
        q('You picked a market. What appeals most?',
          'Finding something neither of us has tried',
          'Talking while we wander at an easy pace',
          'Letting whatever catches our eye shape the date',
          'A clear meeting spot with plenty of simple options'),
        q('You picked an agreed plan. What makes the effort worth it?',
          'It makes room for an experience we’re excited to try',
          'I can relax and focus on getting to know them',
          'We have a starting point and can improvise from there',
          'Both people know their preferences were considered'),
      ]),
      q('The place you chose is closed. What feels easiest?',
        'Try the interesting spot we passed on the way',
        'Find somewhere comfortable to sit and talk',
        'Take a look around and choose together',
        'Check a nearby alternative and make a new plan'),
      q('Which first-date memory would you want to keep?',
        'We tried something and laughed at our attempts',
        'I felt comfortable enough to be myself',
        'An unplanned moment turned into our favorite part',
        'We both felt considered from the start'),
      q('You’re planning your next first date. What matters most right now?',
        'Sharing a new experience we’re both up for',
        'Having room to listen and be heard',
        'Keeping the plan flexible enough for both of us',
        'Making the details comfortable for both people'),
    ],
  },
];
export function getQuiz(slug: string) { return quizzes.find(quiz => quiz.slug === slug); }
export function getResult(quiz: Quiz, slug: string) { return quiz.results.find(result => result.slug === slug); }
