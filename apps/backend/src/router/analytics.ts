import { Router } from 'express';
import { db } from '../db';

const router = Router();

// ==================== USER STATISTICS ====================

// Get user profile with statistics
router.get('/users/:userId/profile', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        bio: true,
        country: true,
        title: true,
        rating: true,
        puzzleRating: true,
        blitzRating: true,
        rapidRating: true,
        bulletRating: true,
        classicalRating: true,
        wins: true,
        losses: true,
        draws: true,
        totalGames: true,
        createdAt: true,
        lastLogin: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get recent games
    const recentGames = await db.game.findMany({
      where: {
        OR: [{ whitePlayerId: userId }, { blackPlayerId: userId }],
        status: 'COMPLETED',
      },
      include: {
        whitePlayer: {
          select: {
            id: true,
            name: true,
            username: true,
            rating: true,
          },
        },
        blackPlayer: {
          select: {
            id: true,
            name: true,
            username: true,
            rating: true,
          },
        },
      },
      orderBy: {
        endAt: 'desc',
      },
      take: 10,
    });

    // Get achievements
    const achievements = await db.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: {
        unlockedAt: 'desc',
      },
    });

    res.json({
      user,
      recentGames,
      achievements,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.patch('/users/me/profile', async (req, res) => {
  try {
    const userId = (req.user as any)?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, bio, country, avatar } = req.body;

    const user = await db.user.update({
      where: { id: userId },
      data: {
        name,
        bio,
        country,
        avatar,
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user game statistics
router.get('/users/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get statistics by time control
    const gamesByTimeControl = await db.game.groupBy({
      by: ['timeControl', 'result'],
      where: {
        OR: [{ whitePlayerId: userId }, { blackPlayerId: userId }],
        status: 'COMPLETED',
      },
      _count: {
        id: true,
      },
    });

    // Calculate stats for each time control
    const stats: any = {
      overall: { wins: 0, losses: 0, draws: 0, total: 0 },
      BLITZ: { wins: 0, losses: 0, draws: 0, total: 0 },
      RAPID: { wins: 0, losses: 0, draws: 0, total: 0 },
      BULLET: { wins: 0, losses: 0, draws: 0, total: 0 },
      CLASSICAL: { wins: 0, losses: 0, draws: 0, total: 0 },
    };

    for (const group of gamesByTimeControl) {
      const count = group._count.id;
      const timeControl = group.timeControl;

      if (group.result === 'DRAW') {
        stats[timeControl].draws += count;
        stats.overall.draws += count;
      } else {
        // Determine if this was a win or loss
        const games = await db.game.findMany({
          where: {
            timeControl: group.timeControl,
            result: group.result,
            OR: [{ whitePlayerId: userId }, { blackPlayerId: userId }],
          },
          select: {
            whitePlayerId: true,
            result: true,
          },
        });

        for (const game of games as any[]) {
          const isWhite = game.whitePlayerId === userId;
          const won = (isWhite && game.result === 'WHITE_WINS') || (!isWhite && game.result === 'BLACK_WINS');

          if (won) {
            stats[timeControl].wins++;
            stats.overall.wins++;
          } else {
            stats[timeControl].losses++;
            stats.overall.losses++;
          }
        }
      }

      stats[timeControl].total += count;
      stats.overall.total += count;
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

// Get user opening statistics
router.get('/users/:userId/openings', async (req, res) => {
  try {
    const { userId } = req.params;

    const games = await db.game.findMany({
      where: {
        OR: [{ whitePlayerId: userId }, { blackPlayerId: userId }],
        status: 'COMPLETED',
        opening: { not: null },
      },
      select: {
        opening: true,
        result: true,
        whitePlayerId: true,
      },
    });

    // Group by opening
    const openingStats: any = {};

    games.forEach((game: { opening: string | null; result: string; whitePlayerId: string }) => {
      const opening = game.opening!;
      if (!openingStats[opening]) {
        openingStats[opening] = { wins: 0, losses: 0, draws: 0, total: 0 };
      }

      const isWhite = game.whitePlayerId === userId;
      const won = (isWhite && game.result === 'WHITE_WINS') || (!isWhite && game.result === 'BLACK_WINS');

      if (game.result === 'DRAW') {
        openingStats[opening].draws++;
      } else if (won) {
        openingStats[opening].wins++;
      } else {
        openingStats[opening].losses++;
      }

      openingStats[opening].total++;
    });

    // Convert to array and sort by frequency
    const openings = Object.entries(openingStats)
      .map(([name, stats]: [string, any]) => ({ name, ...stats }))
      .sort((a: any, b: any) => b.total - a.total);

    res.json(openings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch opening statistics' });
  }
});

// ==================== LEADERBOARDS ====================

// Get global leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { category = 'overall', limit = 100 } = req.query;

    let orderBy: any = { rating: 'desc' };

    switch (category) {
      case 'blitz':
        orderBy = { blitzRating: 'desc' };
        break;
      case 'rapid':
        orderBy = { rapidRating: 'desc' };
        break;
      case 'bullet':
        orderBy = { bulletRating: 'desc' };
        break;
      case 'classical':
        orderBy = { classicalRating: 'desc' };
        break;
      case 'puzzle':
        orderBy = { puzzleRating: 'desc' };
        break;
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        country: true,
        title: true,
        rating: true,
        blitzRating: true,
        rapidRating: true,
        bulletRating: true,
        classicalRating: true,
        puzzleRating: true,
        wins: true,
        losses: true,
        draws: true,
      },
      orderBy,
      take: parseInt(limit as string),
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get user rank
router.get('/users/:userId/rank', async (req, res) => {
  try {
    const { userId } = req.params;
    const { category = 'overall' } = req.query;

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let ratingField = 'rating';
    let userRating = user.rating;

    switch (category) {
      case 'blitz':
        ratingField = 'blitzRating';
        userRating = user.blitzRating;
        break;
      case 'rapid':
        ratingField = 'rapidRating';
        userRating = user.rapidRating;
        break;
      case 'bullet':
        ratingField = 'bulletRating';
        userRating = user.bulletRating;
        break;
      case 'classical':
        ratingField = 'classicalRating';
        userRating = user.classicalRating;
        break;
      case 'puzzle':
        ratingField = 'puzzleRating';
        userRating = user.puzzleRating;
        break;
    }

    const rank = await db.user.count({
      where: {
        [ratingField]: {
          gt: userRating,
        },
      },
    });

    res.json({
      rank: rank + 1,
      rating: userRating,
      category,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user rank' });
  }
});

// ==================== ACHIEVEMENTS ====================

// Get all achievements
router.get('/achievements', async (req, res) => {
  try {
    const achievements = await db.achievement.findMany({
      orderBy: {
        category: 'asc',
      },
    });

    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// Get user achievements
router.get('/users/:userId/achievements', async (req, res) => {
  try {
    const { userId } = req.params;

    const userAchievements = await db.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: {
        unlockedAt: 'desc',
      },
    });

    res.json(userAchievements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user achievements' });
  }
});

// ==================== GAME HISTORY ====================

// Get user game history with filters
router.get('/users/:userId/games', async (req, res) => {
  try {
    const { userId } = req.params;
    const { timeControl, result, variant, limit = 20, offset = 0 } = req.query;

    const where: any = {
      OR: [{ whitePlayerId: userId }, { blackPlayerId: userId }],
      status: 'COMPLETED',
    };

    if (timeControl) where.timeControl = timeControl;
    if (result) where.result = result;
    if (variant) where.variant = variant;

    const games = await db.game.findMany({
      where,
      include: {
        whitePlayer: {
          select: {
            id: true,
            name: true,
            username: true,
            rating: true,
            avatar: true,
          },
        },
        blackPlayer: {
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
        endAt: 'desc',
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await db.game.count({ where });

    res.json({
      games,
      total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch game history' });
  }
});

export default router;
