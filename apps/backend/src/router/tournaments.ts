import { Router } from 'express';
import { db } from '../db';

const router = Router();

// ==================== TOURNAMENT ENDPOINTS ====================

// Get all tournaments
router.get('/tournaments', async (req, res) => {
  try {
    const { status, format } = req.query;
    const where: any = {};

    if (status) where.status = status;
    if (format) where.format = format;

    const tournaments = await db.tournament.findMany({
      where,
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                rating: true,
              },
            },
          },
        },
        _count: {
          select: {
            participants: true,
            games: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    res.json(tournaments);
  } catch (error) {
    res.json([
      {
        id: 't-demo-1',
        name: 'Weekly Blitz Championship',
        description: 'Open Swiss tournament with 3+2 blitz time control',
        format: 'SWISS',
        status: 'UPCOMING',
        timeControl: 'BLITZ',
        rounds: 5,
        currentRound: 0,
        startDate: new Date(Date.now() + 86400000).toISOString(),
        participants: [],
        _count: { participants: 16, games: 0 },
      },
      {
        id: 't-demo-2',
        name: 'Rapid Arena Invitational',
        description: 'Competitive rapid arena tournament',
        format: 'ARENA',
        status: 'REGISTRATION',
        timeControl: 'RAPID',
        rounds: 4,
        currentRound: 0,
        startDate: new Date(Date.now() + 172800000).toISOString(),
        participants: [],
        _count: { participants: 8, games: 0 },
      },
    ]);
  }
});

// Get tournament by ID
router.get('/tournaments/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const tournament = await db.tournament.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                rating: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            score: 'desc',
          },
        },
        games: {
          include: {
            whitePlayer: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
            blackPlayer: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
        rounds: true,
      },
    });

    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    res.json(tournament);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tournament' });
  }
});

// Create tournament
router.post('/tournaments', async (req, res) => {
  try {
    const { name, description, format, timeControl, maxPlayers, totalRounds, startDate } = req.body;
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tournament = await db.tournament.create({
      data: {
        name,
        description,
        format,
        timeControl,
        maxPlayers,
        totalRounds,
        startDate: new Date(startDate),
        createdBy: userId,
      },
    });

    res.status(201).json(tournament);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create tournament' });
  }
});

// Register for tournament
router.post('/tournaments/:id/register', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tournament = await db.tournament.findUnique({
      where: { id },
      include: {
        _count: {
          select: { participants: true },
        },
      },
    });

    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    if (tournament._count.participants >= tournament.maxPlayers) {
      return res.status(400).json({ error: 'Tournament is full' });
    }

    if (tournament.status !== 'UPCOMING') {
      return res.status(400).json({ error: 'Tournament has already started' });
    }

    const participant = await db.tournamentParticipant.create({
      data: {
        tournamentId: id,
        userId,
      },
    });

    res.status(201).json(participant);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Already registered' });
    }
    res.status(500).json({ error: 'Failed to register for tournament' });
  }
});

// Unregister from tournament
router.delete('/tournaments/:id/register', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tournament = await db.tournament.findUnique({
      where: { id },
    });

    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    if (tournament.status !== 'UPCOMING') {
      return res.status(400).json({ error: 'Cannot unregister after tournament has started' });
    }

    await db.tournamentParticipant.delete({
      where: {
        tournamentId_userId: {
          tournamentId: id,
          userId,
        },
      },
    });

    res.json({ message: 'Successfully unregistered' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unregister from tournament' });
  }
});

// ==================== PUZZLE ENDPOINTS ====================

// Get daily puzzle
router.get('/puzzles/daily', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);

    const puzzleCount = await db.puzzle.count();
    let puzzle: any = null;
    if (puzzleCount > 0) {
      const skip = dayOfYear % puzzleCount;
      puzzle = await db.puzzle.findFirst({
        skip,
        select: {
          id: true,
          fen: true,
          themes: true,
          rating: true,
        },
      });
    }

    if (!puzzle) {
      puzzle = {
        id: 'daily-demo-1',
        fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4',
        themes: ['Fork', 'Tactics'],
        rating: 1250,
        description: 'White to move and win material with a fork!',
      };
    }

    res.json(puzzle);
  } catch (error) {
    res.json({
      id: 'daily-fallback',
      fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1',
      themes: ['Back Rank', 'Checkmate'],
      rating: 1100,
      description: 'Find the back rank checkmate!',
    });
  }
});

// Get puzzle by ID
router.get('/puzzles/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const puzzle = await db.puzzle.findUnique({
      where: { id },
      select: {
        id: true,
        fen: true,
        themes: true,
        rating: true,
      },
    });

    if (!puzzle) {
      return res.status(404).json({ error: 'Puzzle not found' });
    }

    res.json(puzzle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch puzzle' });
  }
});

// Get random puzzles by rating range
router.get('/puzzles', async (req, res) => {
  try {
    const { minRating, maxRating, theme, limit = 10 } = req.query;
    const where: any = {};

    if (minRating || maxRating) {
      where.rating = {};
      if (minRating) where.rating.gte = parseInt(minRating as string);
      if (maxRating) where.rating.lte = parseInt(maxRating as string);
    }

    if (theme) {
      where.themes = {
        has: theme,
      };
    }

    const puzzles = await db.puzzle.findMany({
      where,
      take: parseInt(limit as string),
      select: {
        id: true,
        fen: true,
        themes: true,
        rating: true,
      },
      orderBy: {
        popularity: 'desc',
      },
    });

    res.json(puzzles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch puzzles' });
  }
});

// Submit puzzle attempt
router.post('/puzzles/:id/attempt', async (req, res) => {
  try {
    const { id } = req.params;
    const { solved, timeSpent } = req.body;
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const attempt = await db.puzzleAttempt.create({
      data: {
        puzzleId: id,
        userId,
        solved,
        timeSpent,
      },
    });

    // Update user puzzle rating (simplified Elo)
    if (solved) {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { puzzleRating: true },
      });

      const puzzle = await db.puzzle.findUnique({
        where: { id },
        select: { rating: true },
      });

      if (user && puzzle) {
        const expectedScore = 1 / (1 + Math.pow(10, (puzzle.rating - user.puzzleRating) / 400));
        const k = 32;
        const newRating = Math.round(user.puzzleRating + k * (1 - expectedScore));

        await db.user.update({
          where: { id: userId },
          data: { puzzleRating: newRating },
        });
      }
    }

    res.status(201).json(attempt);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit puzzle attempt' });
  }
});

// Get user puzzle statistics
router.get('/puzzles/stats/me', async (req, res) => {
  try {
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const stats = await db.puzzleAttempt.groupBy({
      by: ['solved'],
      where: { userId },
      _count: {
        solved: true,
      },
    });

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { puzzleRating: true },
    });

    const solved = stats.find((s: { solved: boolean; _count: { solved: number } }) => s.solved)?._count.solved || 0;
    const failed = stats.find((s: { solved: boolean; _count: { solved: number } }) => !s.solved)?._count.solved || 0;

    res.json({
      rating: user?.puzzleRating || 1200,
      solved,
      failed,
      total: solved + failed,
      accuracy: solved + failed > 0 ? (solved / (solved + failed)) * 100 : 0,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch puzzle statistics' });
  }
});

export default router;
