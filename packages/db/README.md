# Database Schema Documentation

## Overview
This package contains the Prisma schema and database client for the advanced chess platform.

## Models

### Core Models
- **User**: Extended user model with multiple rating categories, profile customization, and social features
- **Game**: Chess games with tournament support, variants, and analysis metadata
- **Move**: Individual moves in games with timing and notation

### Tournament System
- **Tournament**: Tournament management (Swiss, Round-Robin, Knockout, Arena formats)
- **TournamentParticipant**: Player registration and standings
- **TournamentRound**: Round management for tournaments

### Puzzle System
- **Puzzle**: Chess puzzles with difficulty ratings and themes
- **PuzzleAttempt**: User puzzle solving history and statistics

### Social Features
- **Friendship**: Friend connections between users
- **Message**: Direct messaging system
- **Club**: Chess clubs/groups
- **ClubMember**: Club membership tracking
- **ChatRoom**: Group chat rooms
- **ChatMessage**: Messages in chat rooms

### Achievements
- **Achievement**: Achievement definitions
- **UserAchievement**: Unlocked achievements per user

### Misc
- **GameAnnotation**: User annotations on games
- **Notification**: System notifications

## Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name advanced_features

# Apply migration
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

## Usage

```typescript
import prisma from '@repo/db';

// Example: Create a tournament
const tournament = await prisma.tournament.create({
  data: {
    name: 'Weekly Blitz Tournament',
    format: 'SWISS',
    timeControl: 'BLITZ',
    maxPlayers: 32,
    totalRounds: 5,
    startDate: new Date(),
    createdBy: userId,
  },
});

// Example: Get user with statistics
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    gamesAsWhite: true,
    gamesAsBlack: true,
    achievements: {
      include: {
        achievement: true,
      },
    },
  },
});
```

## Enums

### GameVariant
- STANDARD
- CHESS960
- THREE_CHECK
- KING_OF_THE_HILL
- CRAZYHOUSE

### TournamentFormat
- SWISS
- ROUND_ROBIN
- KNOCKOUT
- ARENA

### TournamentStatus
- UPCOMING
- IN_PROGRESS
- COMPLETED
- CANCELLED

### FriendshipStatus
- PENDING
- ACCEPTED
- DECLINED
- BLOCKED

### NotificationType
- FRIEND_REQUEST
- FRIEND_ACCEPTED
- GAME_INVITATION
- TOURNAMENT_STARTED
- TOURNAMENT_ROUND
- ACHIEVEMENT_UNLOCKED
- MESSAGE_RECEIVED
- CLUB_INVITATION
