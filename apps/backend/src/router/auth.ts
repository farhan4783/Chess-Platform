import { Request, Response, Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { v4 as uuidv4 } from 'uuid';
import { COOKIE_MAX_AGE } from '../consts';
const router = Router();

const CLIENT_URL = process.env.AUTH_REDIRECT_URL ?? 'http://localhost:5173/game/random';
const JWT_SECRET = process.env.JWT_SECRET || 'fk123456';

interface userJwtClaims {
  userId: string;
  name: string;
  isGuest?: boolean;
}

interface UserDetails {
  id: string;
  token?: string;
  name: string;
  isGuest?: boolean;
  rating?: number;
  wins?: number;
  losses?: number;
  draws?: number;
}

// this route is to be hit when the user wants to login as a guest
router.post('/guest', async (req: Request, res: Response) => {
  const bodyData = req.body;
  const requestedName = bodyData.name;

  if (!requestedName) {
    return res.status(400).json({ message: 'Name is required' });
  }

  let user: any = null;
  try {
    // Check if user already exists
    user = await db.user.findFirst({
      where: {
        username: requestedName,
      },
    });

    if (!user) {
      // Create new user if not found
      user = await db.user.create({
        data: {
          username: requestedName,
          email: `${requestedName}_${Date.now()}@guest.local`,
          name: requestedName,
          provider: 'GUEST',
        },
      });
    }
  } catch (error) {
    console.warn('⚠️  [Auth] Database unavailable during guest login, creating session in memory');
    user = {
      id: `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: requestedName,
      rating: 1200,
      wins: 0,
      losses: 0,
      draws: 0,
    };
  }

  const token = jwt.sign({ userId: user.id, name: user.name, isGuest: true }, JWT_SECRET);
  const UserDetails: UserDetails = {
    id: user.id,
    name: user.name!,
    token: token,
    isGuest: true,
    rating: user.rating ?? 1200,
    wins: user.wins ?? 0,
    losses: user.losses ?? 0,
    draws: user.draws ?? 0,
  };
  res.cookie('guest', token, { maxAge: COOKIE_MAX_AGE });
  res.json(UserDetails);
});

router.get('/refresh', async (req: Request, res: Response) => {
  if (req.user) {
    const user = req.user as UserDetails;

    let userDb: any = null;
    try {
      userDb = await db.user.findFirst({
        where: {
          id: user.id,
        },
      });
    } catch (e) {
      // DB offline; continue with token
    }

    const token = jwt.sign({ userId: user.id, name: userDb?.name || user.name }, JWT_SECRET);
    res.json({
      token,
      id: user.id,
      name: userDb?.name || user.name,
      rating: userDb?.rating ?? 1200,
      wins: userDb?.wins ?? 0,
      losses: userDb?.losses ?? 0,
      draws: userDb?.draws ?? 0,
    });
  } else if (req.cookies && req.cookies.guest) {
    try {
      const decoded = jwt.verify(req.cookies.guest, JWT_SECRET) as userJwtClaims;
      let userDb: any = null;
      try {
        userDb = await db.user.findUnique({ where: { id: decoded.userId } });
      } catch (e) {
        // DB offline
      }

      const token = jwt.sign({ userId: decoded.userId, name: decoded.name, isGuest: true }, JWT_SECRET);
      const User: UserDetails = {
        id: decoded.userId,
        name: userDb?.name || decoded.name,
        token: token,
        isGuest: true,
        rating: userDb?.rating ?? 1200,
        wins: userDb?.wins ?? 0,
        losses: userDb?.losses ?? 0,
        draws: userDb?.draws ?? 0,
      };
      res.cookie('guest', token, { maxAge: COOKIE_MAX_AGE });
      res.json(User);
    } catch (e) {
      res.status(401).json({ success: false, message: 'Invalid or expired session token' });
    }
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
});

router.get('/login/failed', (req: Request, res: Response) => {
  res.status(401).json({ success: false, message: 'failure' });
});

router.get('/logout', (req: Request, res: Response) => {
  res.clearCookie('guest');
  req.logout((err) => {
    if (err) {
      console.error('Error logging out:', err);
      res.status(500).json({ error: 'Failed to log out' });
    } else {
      res.clearCookie('jwt');
      res.redirect('http://localhost:5173/');
    }
  });
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: CLIENT_URL,
    failureRedirect: '/login/failed',
  })
);

router.get('/github', passport.authenticate('github', { scope: ['read:user', 'user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', {
    successRedirect: CLIENT_URL,
    failureRedirect: '/login/failed',
  })
);

export default router;
