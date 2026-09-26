import { Router } from 'express';
import tournamentsRouter from './tournaments';
import socialRouter from './social';
import analyticsRouter from './analytics';

const v1Router = Router();

// Mount routers
v1Router.get('/', (req, res) => {
  res.json({
    message: 'Chess Platform API v1',
    status: 'healthy',
    endpoints: {
      tournaments: '/v1/tournaments',
      puzzles: '/v1/puzzles',
      dailyPuzzle: '/v1/puzzles/daily',
      social: '/v1/social',
      friends: '/v1/social/friends',
      clubs: '/v1/social/clubs',
      analytics: '/v1/users/:userId/stats',
      leaderboard: '/v1/leaderboard',
      achievements: '/v1/achievements',
    },
  });
});

// tournamentsRouter handles /tournaments and /puzzles
v1Router.use('/', tournamentsRouter);

// analyticsRouter handles /users, /leaderboard, /achievements
v1Router.use('/', analyticsRouter);

// socialRouter handles /friends, /messages, /clubs, /notifications
// Mount at /social and / so both /v1/social/friends and /v1/friends work seamlessly
v1Router.use('/social', socialRouter);
v1Router.use('/', socialRouter);

export default v1Router;
