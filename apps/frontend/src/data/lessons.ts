export interface LessonStep {
  fen: string;
  text: string;
  expectedMove?: { from: string; to: string }; // If null, it's just an info step
  explanation?: string;
}

export interface Lesson {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  steps: LessonStep[];
}

export const LESSONS: Lesson[] = [
  {
    id: 'beginner-intro',
    title: 'Introduction to the Board',
    difficulty: 'Beginner',
    description: 'Learn how to move pieces and control the center.',
    steps: [
      {
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        text: "Welcome to Chess! The game is played on an 8x8 grid. White always moves first. Let's start by controlling the center. Move your King's Pawn forward two squares (e2 to e4).",
        expectedMove: { from: 'e2', to: 'e4' },
        explanation: 'Great job! e4 is a classic opening move that controls the center squares d5 and f5.',
      },
      {
        fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
        text: "Now it's Black's turn. They often respond with e5. (Auto-playing Black's move...)",
        expectedMove: undefined, // Auto play or info
        explanation: 'Black mirrors your move to challenge the center.',
      },
      {
        fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        text: "Now, let's bring out a Knight. Knights move in an 'L' shape. Move your Knight from g1 to f3.",
        expectedMove: { from: 'g1', to: 'f3' },
        explanation: 'Excellent! You are developing your pieces and attacking the e5 pawn.',
      },
    ],
  },
  {
    id: 'intermediate-pin',
    title: 'The Pin',
    difficulty: 'Intermediate',
    description: 'Learn how to use pins to win material.',
    steps: [
      {
        fen: 'r1b1kbnr/pp1ppppp/2n5/q1p5/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 4 3',
        text: "A pin happens when a piece cannot move because it would expose a more valuable piece behind it. Here, look for a way to pin Black's Knight to their King.",
        expectedMove: { from: 'f1', to: 'b5' },
        explanation:
          'Correct! The Bishop on b5 pins the Knight on c6. If the Knight moves, the King would be in check (which is illegal, but the concept stands).',
      },
    ],
  },
  {
    id: 'advanced-tactic',
    title: 'Discovered Attack',
    difficulty: 'Advanced',
    description: 'Unleash hidden attacks by moving a piece out of the way.',
    steps: [
      {
        fen: 'rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq - 1 4',
        text: 'This is a dummy advanced lesson for demonstration.',
        expectedMove: { from: 'c7', to: 'c5' }, // Just a random move for now
        explanation: 'Well done!',
      },
    ],
  },
  // Openings
  {
    id: 'opening-sicilian',
    title: 'Sicilian Defense',
    difficulty: 'Intermediate',
    description: 'The most popular and aggressive response to e4.',
    steps: [
      {
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        text: 'White usually starts with e4 to control the center. (Auto-play)',
        explanation: 'White occupies the center.',
      },
      {
        fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
        text: 'As Black, play c5 to fight for the d4 square from the flank. This is the Sicilian Defense.',
        expectedMove: { from: 'c7', to: 'c5' },
        explanation: 'Excellent! You have entered the Sicilian Defense.',
      },
    ],
  },
  {
    id: 'opening-french',
    title: 'French Defense',
    difficulty: 'Intermediate',
    description: 'A solid and resilient defense against e4.',
    steps: [
      {
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        text: 'White plays e4. (Auto-play)',
      },
      {
        fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
        text: 'Respond with e6. This prepares to challenge the center immediately with d5.',
        expectedMove: { from: 'e7', to: 'e6' },
        explanation: 'Good. This solid pawn structure defines the French Defense.',
      },
    ],
  },
  {
    id: 'opening-ruy-lopez',
    title: 'Ruy Lopez',
    difficulty: 'Intermediate',
    description: 'One of the oldest and most trusted openings in chess.',
    steps: [
      {
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        text: 'Play starts with e4.',
        expectedMove: { from: 'e2', to: 'e4' },
        explanation: "Standard King's Pawn opening.",
      },
      {
        fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
        text: 'Black responds with e5. (Auto-play)',
        explanation: 'Solid response.',
      },
      {
        fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        text: "Develop your King's Knight to f3 to attack the e5 pawn.",
        expectedMove: { from: 'g1', to: 'f3' },
        explanation: 'Developing with initiative.',
      },
      {
        fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
        text: 'Black defends with Nc6. (Auto-play)',
      },
      {
        fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
        text: 'Now, pin the Knight with your Bishop to b5. This is the Ruy Lopez.',
        expectedMove: { from: 'f1', to: 'b5' },
        explanation: "Perfect! You've initiated the Ruy Lopez.",
      },
    ],
  },
  {
    id: 'opening-queens-gambit',
    title: "Queen's Gambit",
    difficulty: 'Intermediate',
    description: 'A classic and ambitious opening for White.',
    steps: [
      {
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        text: "Start by moving the Queen's Pawn to d4.",
        expectedMove: { from: 'd2', to: 'd4' },
        explanation: 'Strong control of the center.',
      },
      {
        fen: 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1',
        text: 'Black mirrors with d5. (Auto-play)',
      },
      {
        fen: 'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 1',
        text: 'Now play c4! You are offering a side pawn to gain better control of the center.',
        expectedMove: { from: 'c2', to: 'c4' },
        explanation: "This is the Queen's Gambit. If Black takes, you can dominate the center.",
      },
    ],
  },
];
