// Full Checklist tab content, transcribed from
// https://app.subjectivepersonality.com/analyzer (Checklist tab).
// `test` describes how to decide whether this row is checked, evaluated
// against the app's current selections/extraSelections/saviorFunctions.

export const CHECKLIST_SECTIONS = [
  {
    title: "Human Needs",
    items: [
      {
        title: "Single Observer",
        subtitle: "IxxJ or ExxP",
        tag: "O/DD",
        lines: [
          "Stuck on info & pathways, not stuck on others point of view.",
          "Relatively balanced with self and tribe, but feels stuck when it comes to control and chaos.",
          "Worries about things, people are safe.",
        ],
        test: { kind: "main", index: 0, side: "left" },
      },
      {
        title: "Single Decider",
        subtitle: "IxxP or ExxJ",
        tag: "D/OO",
        lines: [
          "Stuck on people, judgment, fairness, not stuck on missing info.",
          "Relatively balanced with control and chaos, but feels stuck when it comes to self and tribe.",
          "Nervous about people, things are safe",
        ],
        test: { kind: "main", index: 0, side: "right" },
      },
      {
        title: "Di - Identity",
        subtitle: "Fi or Ti",
        tag: "Decider Introverted",
        lines: [
          "Me-story, what I want, I'm allowed, leaves the tribe behind.",
          "Prioritizes their personal values/reasons first, then seeks the spectrum of the tribe's values/reasons.",
          "Knows more about self vs others, me-story.",
          "Seeks Significance before Connection",
        ],
        test: { kind: "main", index: 1, side: "left" },
      },
      {
        title: "De - Tribe",
        subtitle: "Fe or Te",
        tag: "Decider Extroverted",
        lines: [
          "We-story, drags in others, void in what they want, not allowed.",
          "Prioritizes the spectrum of the tribe's values/reasons, then seeks their personal values/reasons.",
          'Knows more about others vs self, "frog in pocket".',
          "Seeks Connection before Significance",
        ],
        test: { kind: "main", index: 1, side: "right" },
      },
      {
        title: "Oi - Organize",
        subtitle: "Ni or Si",
        tag: "Observer Introverted",
        lines: [
          "Has a way, same story, concludes, narrows, shoves away new.",
          "Answers are found by going over known facts/concepts, then gathering in new facts/concepts later.",
          "Keeps circling back to the same known story, conclusions.",
          "Seeks Certainty before Variety",
        ],
        test: { kind: "main", index: 2, side: "left" },
      },
      {
        title: "Oe - Gather",
        subtitle: "Ne or Se",
        tag: "Observer Extroverted",
        lines: [
          "Channel change, we'll see, wants control - but doesn't",
          "Answers are found by gathering new facts/concepts, then organizing known facts/concepts later.",
          "Keeps channel changing and interrupting self, variety.",
          "Seeks Variety before Certainty",
        ],
        test: { kind: "main", index: 2, side: "right" },
      },
    ],
  },
  {
    title: "Letters",
    items: [
      {
        title: "Feeling",
        subtitle: "Fi or Fe",
        lines: [
          "Values, likes, hates, weak reasons, won't make it work",
          "Looks to prioritize/value of something, then figures out the reasons.",
          "Prioritizing, emotions, likes",
        ],
        test: { kind: "main", index: 4, side: "left" },
      },
      {
        title: "Thinking",
        subtitle: "Ti or Te",
        lines: [
          "Works, get it done, logic, reasons, unowned emotions",
          "Looks to figure out the reasons of something, then figures out the priorities/values.",
          "Getting it done, reasons, what works",
        ],
        test: { kind: "main", index: 4, side: "right" },
      },
      {
        title: "Sensory",
        subtitle: "Si or Se",
        lines: [
          "Proving, gives facts, grounded, not jumping or summarizing",
          "Looks for the proveable facts first, then sees the abstract connections.",
          "Responsible to prove the case, tracks the facts",
        ],
        test: { kind: "main", index: 3, side: "right" },
      },
      {
        title: "Intuition",
        subtitle: "Ni or Ne",
        lines: [
          "Summarizing, categories, abstract, void in supporting facts",
          "Looks for abstract connections first, then sees the provable facts.",
          "Jumps to conclusions, tracks the patterns",
        ],
        test: { kind: "main", index: 3, side: "left" },
      },
      {
        title: "SF",
        subtitle: "Popularity",
        lines: ["Sees the value in the physical world, then seeks to figure out the reasons in the abstract."],
        test: { kind: "and", tests: [{ kind: "main", index: 3, side: "right" }, { kind: "main", index: 4, side: "left" }] },
      },
      {
        title: "NT",
        subtitle: "Nerdy",
        lines: ["Figures out the reasons in the abstract world, then seeks to find the value in the physical."],
        test: { kind: "and", tests: [{ kind: "main", index: 3, side: "left" }, { kind: "main", index: 4, side: "right" }] },
      },
      {
        title: "ST",
        subtitle: "Reporter",
        lines: ["Sees the reasons in the physical world, then seeks to figure out the value in the abstract."],
        test: { kind: "and", tests: [{ kind: "main", index: 3, side: "right" }, { kind: "main", index: 4, side: "right" }] },
      },
      {
        title: "NF",
        subtitle: "Hippie",
        lines: ["Sees the value in the abstract world, then seeks to figure out the reasons in the physical."],
        test: { kind: "and", tests: [{ kind: "main", index: 3, side: "left" }, { kind: "main", index: 4, side: "left" }] },
      },
    ],
  },
  {
    title: "Functions",
    items: [
      {
        title: "Si",
        subtitle: "Introverted Sensory",
        lines: [
          "Answers are found by going over known facts, then gathering in new concepts later.",
          "Shoves away new concepts, understandings, and possibilities, so they can go over and refine their known, personal, facts.",
        ],
        test: { kind: "function", code: "Si" },
      },
      {
        title: "Ne",
        subtitle: "Extroverted Intuition",
        lines: [
          "Answers are found by gathering new concepts, then organizing known facts later.",
          "Has a hard time staying on one topic, narrowing down, and giving specific details.",
        ],
        test: { kind: "function", code: "Ne" },
      },
      {
        title: "Ni",
        subtitle: "Introverted Intuition",
        lines: [
          "Answers are found by going over known concepts, then gathering in new facts later.",
          "Shoves away every new fact that they can't connect back to their old, personal, patterns.",
        ],
        test: { kind: "function", code: "Ni" },
      },
      {
        title: "Se",
        subtitle: "Extroverted Sensory",
        lines: [
          "Answers are found by gathering new facts, then organizing known concepts later.",
          "Has a hard time staying on one topic, narrowing down, and seeing how much this experience is just like all the ones before and after it.",
        ],
        test: { kind: "function", code: "Se" },
      },
      {
        title: "Fi",
        subtitle: "Introverted Feeling",
        lines: [
          "Prioritizes their personal values first, then seeks the spectrum of the tribe's reasons.",
          "Shoves away all the work that the tribe needs help with, so they can do more of what they love.",
        ],
        test: { kind: "function", code: "Fi" },
      },
      {
        title: "Te",
        subtitle: "Extroverted Thinking",
        lines: [
          "Prioritizes the spectrum of the tribe's reasons, then seeks their personal values.",
          "Has a hard time narrowing in on all the things that need to be done, and picking the one that has a higher value for themselves.",
        ],
        test: { kind: "function", code: "Te" },
      },
      {
        title: "Ti",
        subtitle: "Introverted Thinking",
        lines: [
          "Prioritizes their personal reasons first, then seeks the spectrum of the tribe's values.",
          "Shoves away what everyone else loves and wants to do, so they can work on what they know is true for them.",
        ],
        test: { kind: "function", code: "Ti" },
      },
      {
        title: "Fe",
        subtitle: "Extroverted Feeling",
        lines: [
          "Prioritizes the spectrum of the tribe's values, then seeks their personal reasons.",
          "Has a hard time narrowing down on what everyone loves, and going with what they know to be true (even though everyone will hate that).",
        ],
        test: { kind: "function", code: "Fe" },
      },
    ],
  },
  {
    title: "Animals",
    items: [
      {
        title: "Sleep",
        subtitle: "Di + Oi",
        lines: [
          "Same story about self, processed, resolved, won't jump in",
          "Process and preserves energy for self, before expending energy for the tribe",
          "Same old story about me, processed, work alone",
          "Introverted Energy Animal",
        ],
        test: { kind: "main", index: 5, side: "left" },
      },
      {
        title: "Play",
        subtitle: "De + Oe",
        lines: [
          "Random story about others, unresolved, won't hit the brakes",
          "Expends energy for the tribe, before processing and preserving energy for self.",
          "Random story about others, process & do with others",
          "Extroverted Energy Animal",
        ],
        test: { kind: "main", index: 5, side: "right" },
      },
      {
        title: "Consume",
        subtitle: "Oe + Di",
        lines: [
          "Random story about self, takes you along, trails off, not ready",
          "Takes in and respects info, before getting started and teaching.",
          "Random story about me, pile for me, savor",
          "Introverted Information Animal",
        ],
        test: { kind: "main", index: 6, side: "left" },
      },
      {
        title: "Blast",
        subtitle: "De + Oi",
        lines: [
          "Same story about others, lessons, jumps in, overextended",
          "Gets started and is able to teach, before respecting and gathering info.",
          "Same old story about others, can talk, produce",
          "Extroverted Information Animal",
        ],
        test: { kind: "main", index: 6, side: "right" },
      },
      {
        title: "Info Dominant",
        lines: [
          "Balance in learning and sharing info, works/rests in swings",
          "Relative balance in conversations, knowledge is power",
          "Imbalanced with work and rest, over or under exert",
          "Blast and Consume in top 3 animals, Play or Sleep last.",
        ],
        test: { kind: "main", index: 7, side: "left" },
      },
      {
        title: "Energy Dominant",
        lines: [
          "Balance in work and rest, learns/talks in swings",
          "Relative balance with work and rest, goofy",
          "Imbalanced in conversations, overshare or undershare information",
          "Play and Sleep in top 3 animals, Consume or Blast last.",
        ],
        test: { kind: "main", index: 7, side: "right" },
      },
      {
        title: "SC",
        subtitle: "Sleep + Consume",
        lines: ["Deep inner world of taking in info and processing."],
        test: { kind: "and", tests: [{ kind: "main", index: 5, side: "left" }, { kind: "main", index: 6, side: "left" }] },
      },
      {
        title: "CP",
        subtitle: "Consume + Play",
        lines: ["Over gathers then wants to do something with it."],
        test: { kind: "and", tests: [{ kind: "main", index: 5, side: "right" }, { kind: "main", index: 6, side: "left" }] },
      },
      {
        title: "PB",
        subtitle: "Play + Blast",
        lines: ["Expends energy and shares knowledge."],
        test: { kind: "and", tests: [{ kind: "main", index: 5, side: "right" }, { kind: "main", index: 6, side: "right" }] },
      },
      {
        title: "BS",
        subtitle: "Blast + Sleep",
        lines: ["Reworks same info and then shares knowledge."],
        test: { kind: "and", tests: [{ kind: "main", index: 5, side: "left" }, { kind: "main", index: 6, side: "right" }] },
      },
      {
        title: "Introverted",
        lines: ['Always "kicked" by the tribe to talk and move, outbursts later.', "Play or Blast last."],
        test: { kind: "main", index: 8, side: "left" },
      },
      {
        title: "Extroverted",
        lines: ["Always tiring out self and tribe, then crashes later.", "Sleep or Consume last."],
        test: { kind: "main", index: 8, side: "right" },
      },
    ],
  },
  {
    title: "Modalities",
    items: [
      {
        title: "De Feminine",
        lines: ["Moveable with the tribe, direct on identity.", "Pressure on self, easy on others."],
        test: { kind: "extra", index: 0, side: "left" },
      },
      {
        title: "De Masculine",
        lines: ["Direct with the tribe, moveable on identity.", "Pressure on others, easy on self."],
        test: { kind: "extra", index: 0, side: "right" },
      },
      {
        title: "S Feminine",
        lines: ["Solid with the concepts, moveable with the facts.", "Visual/Tester, visualizes pictures."],
        test: { kind: "extra", index: 1, side: "left" },
      },
      {
        title: "S Masculine",
        lines: ["Solid with the facts, moveable with the concepts.", "Audio/Kinesthetic, knows timeline."],
        test: { kind: "extra", index: 1, side: "right" },
      },
    ],
  },
];

export function checklistItemChecked(test, ctx) {
  const { selections, extraSelections, saviorFunctions } = ctx;
  switch (test.kind) {
    case "main":
      return selections[test.index] === test.side;
    case "extra":
      return extraSelections[test.index] === test.side;
    case "function":
      return !!saviorFunctions && saviorFunctions.includes(test.code);
    case "and":
      return test.tests.every((t) => checklistItemChecked(t, ctx));
    default:
      return false;
  }
}
