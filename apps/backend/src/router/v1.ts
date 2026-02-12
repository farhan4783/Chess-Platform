import { Router } from 'express';
import tournamentsRouter from './tournaments';
import socialRouter from './social';
import analyticsRouter from './analytics';

const v1Router = Router();

// Mount routers
v1Router.use('/tournaments', tournamentsRouter);
v1Router.use('/puzzles', tournamentsRouter); // Puzzles are in tournaments router
v1Router.use('/social', socialRouter);
v1Router.use('/analytics', analyticsRouter);
v1Router.use('/users', analyticsRouter); // User endpoints are in analytics router
v1Router.use('/leaderboard', analyticsRouter);
v1Router.use('/achievements', analyticsRouter);

v1Router.get('/', (req, res) => {
  res.json({
    message: 'Chess Platform API v1',
    endpoints: {
      tournaments: '/v1/tournaments',
      puzzles: '/v1/puzzles',
      social: '/v1/social',
      analytics: '/v1/analytics',
      users: '/v1/users',
      leaderboard: '/v1/leaderboard',
      achievements: '/v1/achievements',
    },
  });
});

export default v1Router;
