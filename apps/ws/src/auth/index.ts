import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';
import { User } from '../SocketManager';
//import { Player } from '../Game';
import { WebSocket } from 'ws';

const JWT_SECRET = process.env.JWT_SECRET || 'fk123456';

export interface userJwtClaims {
  userId: string;
  name: string;
  isGuest?: boolean;
}

export const extractAuthUser = (token: string, ws: WebSocket): User => {
  try {
    // Try to decode JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as userJwtClaims;
    return new User(ws, decoded);
  } catch (error) {
    // If JWT fails, treat token as username directly
    const userId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userClaims: userJwtClaims = {
      userId: userId,
      name: token || 'Guest',
      isGuest: true,
    };
    return new User(ws, userClaims);
  }
};
