export const STORY_CATEGORIES = [
  {
    slug: "cheating-betrayal",
    label: "Cheating & Betrayal",
    tags: ["affair", "broken trust", "confession"],
  },
  {
    slug: "open-relationships-wife-swapping",
    label: "Open Relationships & Wife Swapping",
    tags: ["open relationship", "wife swap", "boundaries"],
  },
  {
    slug: "jealousy-cuckold-dynamics",
    label: "Jealousy & Cuckold Dynamics",
    tags: ["jealousy", "cuckold", "relationship dynamics"],
  },
  {
    slug: "secret-affairs",
    label: "Secret Affairs",
    tags: ["affair", "secrecy", "temptation"],
  },
  {
    slug: "unexpected-attraction",
    label: "Unexpected Attraction",
    tags: ["chemistry", "unexpected connection", "desire"],
  },
  {
    slug: "situationships-mixed-signals",
    label: "Situationships & Mixed Signals",
    tags: ["situationship", "mixed signals", "commitment"],
  },
  {
    slug: "first-dates-dangerous-chemistry",
    label: "First Dates & Dangerous Chemistry",
    tags: ["first date", "chemistry", "temptation"],
  },
  {
    slug: "exes-rebounds-old-flames",
    label: "Exes, Rebounds & Old Flames",
    tags: ["ex", "rebound", "old flame"],
  },
  {
    slug: "confessions-regrets",
    label: "Confessions & Regrets",
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
