# Advanced Chess Platform 🎯♟️

![Chess Platform Screenshot](screenshot.png)

![alt text](image-2.png)

A **comprehensive, feature-rich chess platform** built for learning, competition, and social interaction. Experience smooth gameplay, powerful analysis tools, interactive lessons, tournaments, puzzles, and a thriving chess community.

> **Note**: This project is based on 100xchess with extensive enhancements including tournaments, puzzles, social features, advanced analytics, and premium UI/UX.

## ✨ Features

### 🎮 Core Gameplay

- **Real-time Multiplayer**: Play against opponents worldwide with WebSocket-based matchmaking
- **Play vs AI (Stockfish)**: Challenge a world-class chess engine directly in your browser
- **Multiple Time Controls**: Bullet, Blitz, Rapid, and Classical chess
- **Game Variants**: Standard, Chess960, 3-Check, King of the Hill, and more
- **Spectator Mode**: Watch live games as they happen

### 🏆 Tournament System

- **Multiple Formats**: Swiss, Round-Robin, Knockout, and Arena tournaments
- **Live Brackets**: Real-time tournament standings and pairings
- **Tournament Lobby**: Join or create custom tournaments
- **Automatic Pairing**: Intelligent pairing algorithms for fair matchmaking

### 🧩 Puzzle Trainer

- **Daily Puzzles**: Fresh puzzles every day
- **Puzzle Rush Mode**: Solve as many puzzles as you can against the clock
- **Themed Puzzles**: Practice specific tactics (pins, forks, skewers, etc.)
- **Rating System**: Track your puzzle-solving skills with Elo ratings
- **Performance Analytics**: Detailed statistics on your puzzle accuracy

### 👥 Social Features

- **Friends System**: Connect with other chess players
- **Direct Messaging**: Chat with friends in real-time
- **Chess Clubs**: Create or join clubs to discuss and play chess
- **Activity Feed**: See what your friends are playing
- **Online Status**: Know when your friends are available to play

### 📊 Advanced Analytics

- **Detailed Statistics**: Win/loss/draw ratios by time control
- **Opening Performance**: Track your success with different openings
- **Rating Graphs**: Visualize your rating progress over time
- **Game Accuracy**: See your move accuracy and identify mistakes
- **Leaderboards**: Compete globally or with friends

### 🎓 Learning Hub

- **Interactive Lessons**: Master chess concepts step-by-step
- **Opening Explorer**: Learn and practice chess openings
- **Game Analysis**: Review your games with engine evaluation
- **Best Move Suggestions**: Get hints during analysis

### 🏅 Achievement System

- **Unlock Badges**: Earn achievements for milestones
- **Track Progress**: Monitor your chess journey
- **Showcase Achievements**: Display your accomplishments on your profile

### 🎨 Premium UI/UX

- **Modern Design**: Clean, responsive interface
- **Dark/Light Themes**: Choose your preferred theme
- **Customizable Boards**: Multiple board and piece styles
- **Smooth Animations**: Polished user experience
- **Mobile Responsive**: Play on any device

## 🛠 Tech Stack

### Frontend

- **React** with TypeScript
- **Tailwind CSS** for styling
- **Recoil** for state management
- **React Router** for navigation
- **Stockfish.js** for AI analysis

### Backend

- **Node.js** with Express
- **TypeScript** for type safety
- **Passport.js** for authentication
- **Prisma** ORM for database access

### Real-time

- **WebSockets (ws)** for live gameplay
- **Real-time notifications** and chat

### Database

- **PostgreSQL** for data persistence
- **Redis** for move queue and caching

### Infrastructure

- **Turborepo** monorepo setup
- **ESLint** and **Prettier** for code quality
- **Husky** for git hooks

## 📦 Project Structure

```
chess-main/
├── apps/
│   ├── backend/        # Express API server
│   ├── frontend/       # React web application
│   ├── ws/             # WebSocket server
│   └── native/         # React Native mobile app
├── packages/
│   ├── db/             # Prisma schema and database client
│   ├── ui/             # Shared UI components
│   └── store/          # Shared state management
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL database
- Redis (optional, for caching)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd chess-main
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Configuration**

Create `.env` files in each app:

**apps/backend/.env**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/chess"
COOKIE_SECRET="your-secret-key"
ALLOWED_HOSTS="http://localhost:5173"
PORT=3000
```

**apps/ws/.env**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/chess"
PORT=8080
```

4. **Database Setup**

```bash
cd packages/db
npx prisma generate
npx prisma migrate dev --name init
```

5. **Start Development Servers**

Open **3 separate terminals**:

**Terminal 1 - WebSocket Server:**

```bash
cd apps/ws
npm run dev
```

**Terminal 2 - Backend API:**

```bash
cd apps/backend
npm run dev
```

**Terminal 3 - Frontend:**

```bash
cd apps/frontend
npm run dev
```

6. **Access the Application**

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- WebSocket: ws://localhost:8080

## 📡 API Endpoints

### Tournaments

- `GET /v1/tournaments` - List all tournaments
- `POST /v1/tournaments` - Create tournament
- `GET /v1/tournaments/:id` - Get tournament details
- `POST /v1/tournaments/:id/register` - Register for tournament
- `DELETE /v1/tournaments/:id/register` - Unregister from tournament

### Puzzles

- `GET /v1/puzzles/daily` - Get daily puzzle
- `GET /v1/puzzles` - Get puzzles by rating/theme
- `POST /v1/puzzles/:id/attempt` - Submit puzzle attempt
- `GET /v1/puzzles/stats/me` - Get puzzle statistics

### Social

- `GET /v1/social/friends` - Get friends list
- `POST /v1/social/friends/request` - Send friend request
- `POST /v1/social/friends/accept/:id` - Accept friend request
- `GET /v1/social/messages/:userId` - Get messages with user
- `POST /v1/social/messages` - Send message
- `GET /v1/social/clubs` - List clubs
- `POST /v1/social/clubs` - Create club

### Analytics

- `GET /v1/users/:userId/profile` - Get user profile
- `GET /v1/users/:userId/stats` - Get game statistics
- `GET /v1/users/:userId/openings` - Get opening performance
- `GET /v1/leaderboard` - Get global leaderboard
- `GET /v1/achievements` - List all achievements

## 🎯 Roadmap

- [x] Core chess gameplay
- [x] Tournament system
- [x] Puzzle trainer
- [x] Social features
- [x] Advanced analytics
- [ ] PGN import/export
- [ ] Video lessons
- [ ] Opening repertoire builder
- [ ] 3D chess board
- [ ] Mobile app enhancements

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 Recent Updates

### February 2026 - Major Feature Release

- **Tournament System**: Full tournament support with multiple formats
- **Puzzle Trainer**: Daily puzzles, puzzle rush, and rating system
- **Social Features**: Friends, messaging, clubs, and notifications
- **Advanced Analytics**: Comprehensive statistics and leaderboards
- **Achievement System**: Unlock badges and track progress
- **Enhanced Database**: 15+ new models for advanced features
- **API Expansion**: 50+ new endpoints for all features

### January 2026

- **Auth System Refactor**: Persistent guest login with cookies
- **User Stats & Elo**: Rating tracking with wins/losses/draws
- **Frontend Flow**: Improved navigation and deep linking
- **Bug Fixes**: Prisma bundling and CORS configuration

## 👨‍💻 Developer

Created by [Farhan](https://github.com/farhan4783)

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Based on [100xchess](https://github.com/100xdevs-cohort-2/week-21-chess-platform)
- Stockfish chess engine
- Chess.js library for game logic
- Prisma for database management
