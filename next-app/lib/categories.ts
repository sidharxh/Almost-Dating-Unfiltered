export const STORY_CATEGORIES = [
  {
    slug: "cheating-betrayal",
    label: "Cheating & Betrayal",
    description: "Confessions about broken trust, secret relationships, and what happens when the truth comes out.",
    tags: ["affair", "broken trust", "confession"],
  },
  {
    slug: "open-relationships-wife-swapping",
    label: "Open Relationships & Wife Swapping",
    description: "Stories about couples testing boundaries, unexpected agreements, and the feelings that follow.",
    tags: ["open relationship", "wife swap", "boundaries"],
  },
  {
    slug: "jealousy-cuckold-dynamics",
    label: "Jealousy & Cuckold Dynamics",
    description: "Dating confessions about jealousy, shifting boundaries, and complicated relationship dynamics.",
    tags: ["jealousy", "cuckold", "relationship dynamics"],
  },
  {
    slug: "secret-affairs",
    label: "Secret Affairs",
    description: "Private connections, hidden messages, and the choices people make when attraction crosses a line.",
    tags: ["affair", "secrecy", "temptation"],
  },
  {
    slug: "unexpected-attraction",
    label: "Unexpected Attraction",
    description: "Stories about surprising chemistry, unexpected connections, and attraction that changes the plan.",
    tags: ["chemistry", "unexpected connection", "desire"],
  },
  {
    slug: "situationships-mixed-signals",
    label: "Situationships & Mixed Signals",
    description: "Confessions about undefined relationships, unclear intentions, and wanting more than you admit.",
    tags: ["situationship", "mixed signals", "commitment"],
  },
  {
    slug: "first-dates-dangerous-chemistry",
    label: "First Dates & Dangerous Chemistry",
    description: "First dates, instant chemistry, and the moments that make a simple meeting complicated.",
    tags: ["first date", "chemistry", "temptation"],
  },
  {
    slug: "exes-rebounds-old-flames",
    label: "Exes, Rebounds & Old Flames",
    description: "Stories about old partners returning, rebound connections, and feelings that never quite left.",
    tags: ["ex", "rebound", "old flame"],
  },
  {
    slug: "confessions-regrets",
    label: "Confessions & Regrets",
    description: "Personal dating stories about secrets, difficult choices, and the things people wish they had said.",
    tags: ["regret", "secret", "relationship choice"],
  },
] as const;

export type StoryCategorySlug = (typeof STORY_CATEGORIES)[number]["slug"];

export const STORY_TAGS = [
  "wife swap",
  "open relationship",
  "jealousy",
  "cuckold",
  "affair",
  "secret crush",
  "betrayal",
  "temptation",
  "mixed signals",
  "first date",
] as const;
