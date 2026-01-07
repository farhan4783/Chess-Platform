# Antichess Platform

![Antichess Screenshot](screenshot.png)

A modern, real-time chess platform built for learning and competition. Experience smooth gameplay, powerful analysis tools, and interactive lessons.
i have taken this project from 100xchess and i have added my new features to it will add more to it in the future. 

## 🚀 Features

-   **Real-time Multiplayer**: Play against real opponents with websocket-based matchmaking.
-   **Play vs AI (Stockfish)**: Challenge a world-class engine directly in your browser.
-   **Game Analysis**: Review your games with move evaluation and "Best Move" suggestions.
-   **Learning Hub**: Master the game with interactive lessons and an opening explorer.
-   **Spectator Mode**: Watch live games as they happen.

## 🛠 Tech Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **Backend**: Node.js, Express
-   **Real-time**: WebSockets (ws)
-   **Database**: PostgreSQL, Redis (Move Queue)
-   **Engine**: Stockfish.js (WebAssembly)

## 📦 Local Setup

Follow these steps to get the project running locally:

### 1. Clone the repository


### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Configuration
Copy the example environment files:
\`\`\`bash
cp apps/backend/.env.example apps/backend/.env
# Update .env with your PostgreSQL and OAuth credentials
\`\`\`

### 4. Start the Application
You will need to run the services in separate terminals:

**Websocket Server:**
\`\`\`bash
cd apps/ws
npm run dev
\`\`\`

**Backend API:**
\`\`\`bash
cd apps/backend
npm run dev
\`\`\`

**Frontend:**
\`\`\`bash
cd apps/frontend
npm run dev
\`\`\`

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 🔄 Recent Updates (Jan 2026)
- **Auth System Refactor**: Implemented persistent "Guest Login" (stored via cookies) with simplified Name-only access.
- **User Stats & Elo**: Added tracking for Rating (Elo), Wins, Losses, and Draws. Stats are now displayed on the user profile.
- **Frontend Flow**: Improved navigation flow (Login -> Home -> Play), protecting game routes and ensuring deep links (e.g. via Sidebar) work seamlessly.
- **Bug Fixes**: Resolved Prisma client bundling issues in `apps/ws` and fixed CORS configuration for persistent sessions.