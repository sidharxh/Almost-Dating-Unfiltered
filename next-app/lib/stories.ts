export type StorySegment =
  | { kind: "paragraph"; text: string }
  | { kind: "quote"; text: string };

export type StoryCharacter = {
  name: string;
  genderLabel: string;
  cue: string;
};

export type Story = {
  slug: string;
  title: string;
  category: string;
  deck: string;
  attribution: string[];
  segments: StorySegment[];
  characters: StoryCharacter[];
  roleplayDescription: string;
  roleplayBoundary: string;
  previewOnly?: boolean;
};

// Temporary prototype content only. Production stories will come from the
// approved story source after its submission and moderation flow is designed.
const stories: Story[] = [
  {
    slug: "design-preview",
    title: "We both knew the rain had stopped",
    category: "First Dates & Dangerous Chemistry",
    deck: "One late coffee, a conversation that got too honest, and two people inventing reasons not to say goodnight.",
    attribution: ["Design preview", "Two perspectives", "18+ roleplay"],
    segments: [
      {
        kind: "paragraph",
        text: "At 11:40, the café staff stacked chairs around us. We had started with work stories, then somehow reached the things we usually leave out of a first date: the last person who made us feel small, the one we still checked on, the fear that wanting someone first always gives them the advantage.",
      },
      {
        kind: "paragraph",
        text: "When the rain began, we moved closer to the window. I told myself I was staying because the walk to my cab would be miserable. The truth was that I had stopped thinking of questions and started noticing how carefully he listened.",
      },
      { kind: "quote", text: "You keep saying you should go. You never actually get up." },
      {
        kind: "paragraph",
        text: "I laughed because it was easier than admitting he was right. He said he had been doing the same thing: waiting for me to give him a reason to stay without having to ask for one.",
      },
      {
        kind: "paragraph",
        text: "Outside, the pavement was already dry. We stood under the awning anyway, close enough to feel the warmth between us, still pretending the weather was making the decision.",
      },
      {
        kind: "paragraph",
        text: "I wanted him to ask if he could kiss me. I also wanted to be the person brave enough to ask first. Neither of us did. We traded numbers again, even though we already had them, and went home carrying the same unfinished sentence.",
      },
    ],
    characters: [
      { name: "Maya", genderLabel: "Woman", cue: "You stayed by the window." },
      { name: "Arjun", genderLabel: "Man", cue: "You asked why they stayed." },
    ],
    roleplayDescription:
      "Choose who you are. The other character responds within this exact moment in the confession, keeping the conversation tied to the story.",
    roleplayBoundary:
      "Adults only · Non-explicit. The roleplay stays within the story. Stop or reset whenever you want.",
    previewOnly: true,
  },
];

export function getStories() {
  return stories;
}

export function getStory(slug: string) {
  return stories.find((story) => story.slug === slug);
}
