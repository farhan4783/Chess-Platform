-- CreateEnum
CREATE TYPE "GameVariant" AS ENUM ('STANDARD', 'CHESS960', 'THREE_CHECK', 'KING_OF_THE_HILL', 'CRAZYHOUSE');

-- CreateEnum
CREATE TYPE "TournamentFormat" AS ENUM ('SWISS', 'ROUND_ROBIN', 'KNOCKOUT', 'ARENA');

-- CreateEnum
CREATE TYPE "TournamentStatus" AS ENUM ('UPCOMING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "ClubRole" AS ENUM ('OWNER', 'ADMIN', 'MODERATOR', 'MEMBER');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('FRIEND_REQUEST', 'FRIEND_ACCEPTED', 'GAME_INVITATION', 'TOURNAMENT_STARTED', 'TOURNAMENT_ROUND', 'ACHIEVEMENT_UNLOCKED', 'MESSAGE_RECEIVED', 'CLUB_INVITATION');

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "blackAccuracy" DOUBLE PRECISION,
ADD COLUMN     "blackTimeRemaining" INTEGER,
ADD COLUMN     "blunders" INTEGER DEFAULT 0,
ADD COLUMN     "brilliantMoves" INTEGER DEFAULT 0,
ADD COLUMN     "increment" INTEGER DEFAULT 0,
ADD COLUMN     "roundNumber" INTEGER,
ADD COLUMN     "tournamentId" TEXT,
ADD COLUMN     "variant" "GameVariant" NOT NULL DEFAULT 'STANDARD',
ADD COLUMN     "whiteAccuracy" DOUBLE PRECISION,
ADD COLUMN     "whiteTimeRemaining" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "allowFriendRequests" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "blitzRating" INTEGER NOT NULL DEFAULT 1200,
ADD COLUMN     "bulletRating" INTEGER NOT NULL DEFAULT 1200,
ADD COLUMN     "classicalRating" INTEGER NOT NULL DEFAULT 1200,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "puzzleRating" INTEGER NOT NULL DEFAULT 1200,
ADD COLUMN     "rapidRating" INTEGER NOT NULL DEFAULT 1200,
ADD COLUMN     "showOnlineStatus" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "totalGames" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "format" "TournamentFormat" NOT NULL,
    "timeControl" "TimeControl" NOT NULL,
    "status" "TournamentStatus" NOT NULL DEFAULT 'UPCOMING',
    "maxPlayers" INTEGER NOT NULL,
    "currentRound" INTEGER NOT NULL DEFAULT 0,
    "totalRounds" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentParticipant" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rank" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TournamentParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentRound" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),

    CONSTRAINT "TournamentRound_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Puzzle" (
    "id" TEXT NOT NULL,
    "fen" TEXT NOT NULL,
    "moves" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 1500,
    "themes" TEXT[],
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Puzzle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuzzleAttempt" (
    "id" TEXT NOT NULL,
    "puzzleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "solved" BOOLEAN NOT NULL,
    "timeSpent" INTEGER NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PuzzleAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "id" TEXT NOT NULL,
    "initiatorId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" "FriendshipStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "avatar" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubMember" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ClubRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClubMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatRoom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clubId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "category" TEXT NOT NULL,
    "requirement" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progress" INTEGER NOT NULL DEFAULT 100,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameAnnotation" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moveNumber" INTEGER NOT NULL,
    "annotation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameAnnotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmotionalAnalytics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tiltScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tiltTriggerMove" INTEGER,
    "blundersInTilt" INTEGER NOT NULL DEFAULT 0,
    "avgMoveTimeMs" INTEGER NOT NULL,
    "panicModeStart" INTEGER,
    "movesUnder10Sec" INTEGER NOT NULL DEFAULT 0,
    "blundersUnder30s" INTEGER NOT NULL DEFAULT 0,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "overconfidentAt" INTEGER,
    "hesitationMoves" INTEGER NOT NULL DEFAULT 0,
    "accuracyDrop" DOUBLE PRECISION,
    "ratingChange" INTEGER,

    CONSTRAINT "EmotionalAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CognitiveSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "focusScore" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "fatigueLevel" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "optimalDuration" INTEGER,
    "sharpnessScore" DOUBLE PRECISION,
    "blunderRate" DOUBLE PRECISION,
    "tacticalMisses" INTEGER NOT NULL DEFAULT 0,
    "gamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "avgAccuracy" DOUBLE PRECISION,
    "peakPerformance" INTEGER,

    CONSTRAINT "CognitiveSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayingStyleDNA" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "aggressionScore" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "sacrificeRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "attackFrequency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "gambitsPlayed" INTEGER NOT NULL DEFAULT 0,
    "sharpPositions" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tacticalComplexity" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "combinationRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quietMoveRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "positionalScore" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "pawnStructure" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pieceActivity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "timeUsagePattern" TEXT,
    "avgMoveTime" INTEGER,
    "timeScrambles" INTEGER NOT NULL DEFAULT 0,
    "e4Frequency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "d4Frequency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sicilianDefense" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "favoriteOpening" TEXT,
    "styleArchetype" TEXT,
    "similarGrandmaster" TEXT,

    CONSTRAINT "PlayingStyleDNA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdaptivePuzzleSet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weaknessType" TEXT NOT NULL,
    "targetRating" INTEGER NOT NULL,
    "difficultyLevel" INTEGER NOT NULL,
    "generatedBy" TEXT NOT NULL DEFAULT 'ml_model',
    "clusteringData" JSONB,
    "puzzleIds" TEXT[],
    "completedCount" INTEGER NOT NULL DEFAULT 0,
    "successRate" DOUBLE PRECISION,
    "currentDifficulty" INTEGER NOT NULL DEFAULT 5,
    "adjustmentFactor" DOUBLE PRECISION NOT NULL DEFAULT 1.0,

    CONSTRAINT "AdaptivePuzzleSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currentLevel" INTEGER NOT NULL DEFAULT 1,
    "targetRating" INTEGER NOT NULL DEFAULT 1000,
    "currentRating" INTEGER NOT NULL DEFAULT 800,
    "chaptersCompleted" INTEGER NOT NULL DEFAULT 0,
    "currentChapter" TEXT NOT NULL DEFAULT 'beginner',
    "storylineChoices" JSONB,
    "defeatedOpponents" TEXT[],
    "currentOpponent" TEXT,
    "tournamentsWon" INTEGER NOT NULL DEFAULT 0,
    "sponsorships" TEXT[],
    "unlockedLessons" TEXT[],
    "unlockedThemes" TEXT[],
    "unlockedAvatars" TEXT[],
    "careerAchievements" TEXT[],
    "totalGamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "winRate" DOUBLE PRECISION,
    "fastestPromotion" INTEGER,

    CONSTRAINT "CareerProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AICoachInsight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "moveNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "insightType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "suggestion" TEXT,
    "position" TEXT NOT NULL,
    "evaluation" DOUBLE PRECISION,
    "bestMove" TEXT,
    "playerMove" TEXT,
    "isRealtime" BOOLEAN NOT NULL DEFAULT false,
    "wasDisplayed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AICoachInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpeningResearch" (
    "id" TEXT NOT NULL,
    "opening" TEXT NOT NULL,
    "fen" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "whiteWins" INTEGER NOT NULL DEFAULT 0,
    "blackWins" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "popularMoves" JSONB NOT NULL,
    "winningMoves" JSONB NOT NULL,
    "aiEvaluation" DOUBLE PRECISION,
    "aiSummary" TEXT,
    "keyIdeas" TEXT[],
    "commonMistakes" TEXT[],
    "contributorCount" INTEGER NOT NULL DEFAULT 0,
    "lastAnalyzedAt" TIMESTAMP(3),

    CONSTRAINT "OpeningResearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlunderCluster" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clusterType" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL DEFAULT 1,
    "avgRatingLoss" DOUBLE PRECISION NOT NULL,
    "positionPatterns" JSONB NOT NULL,
    "movePatterns" JSONB NOT NULL,
    "embeddingVector" JSONB,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "BlunderCluster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Tournament_status_idx" ON "Tournament"("status");

-- CreateIndex
CREATE INDEX "Tournament_startDate_idx" ON "Tournament"("startDate");

-- CreateIndex
CREATE INDEX "TournamentParticipant_tournamentId_idx" ON "TournamentParticipant"("tournamentId");

-- CreateIndex
CREATE INDEX "TournamentParticipant_userId_idx" ON "TournamentParticipant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TournamentParticipant_tournamentId_userId_key" ON "TournamentParticipant"("tournamentId", "userId");

-- CreateIndex
CREATE INDEX "TournamentRound_tournamentId_idx" ON "TournamentRound"("tournamentId");

-- CreateIndex
CREATE UNIQUE INDEX "TournamentRound_tournamentId_roundNumber_key" ON "TournamentRound"("tournamentId", "roundNumber");

-- CreateIndex
CREATE INDEX "Puzzle_rating_idx" ON "Puzzle"("rating");

-- CreateIndex
CREATE INDEX "Puzzle_themes_idx" ON "Puzzle"("themes");

-- CreateIndex
CREATE INDEX "PuzzleAttempt_puzzleId_idx" ON "PuzzleAttempt"("puzzleId");

-- CreateIndex
CREATE INDEX "PuzzleAttempt_userId_idx" ON "PuzzleAttempt"("userId");

-- CreateIndex
CREATE INDEX "PuzzleAttempt_solved_idx" ON "PuzzleAttempt"("solved");

-- CreateIndex
CREATE INDEX "Friendship_initiatorId_idx" ON "Friendship"("initiatorId");

-- CreateIndex
CREATE INDEX "Friendship_receiverId_idx" ON "Friendship"("receiverId");

-- CreateIndex
CREATE INDEX "Friendship_status_idx" ON "Friendship"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_initiatorId_receiverId_key" ON "Friendship"("initiatorId", "receiverId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_receiverId_idx" ON "Message"("receiverId");

-- CreateIndex
CREATE INDEX "Message_isRead_idx" ON "Message"("isRead");

-- CreateIndex
CREATE INDEX "Club_name_idx" ON "Club"("name");

-- CreateIndex
CREATE INDEX "ClubMember_clubId_idx" ON "ClubMember"("clubId");

-- CreateIndex
CREATE INDEX "ClubMember_userId_idx" ON "ClubMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ClubMember_clubId_userId_key" ON "ClubMember"("clubId", "userId");

-- CreateIndex
CREATE INDEX "ChatRoom_clubId_idx" ON "ChatRoom"("clubId");

-- CreateIndex
CREATE INDEX "ChatMessage_roomId_idx" ON "ChatMessage"("roomId");

-- CreateIndex
CREATE INDEX "ChatMessage_userId_idx" ON "ChatMessage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_name_key" ON "Achievement"("name");

-- CreateIndex
CREATE INDEX "UserAchievement_userId_idx" ON "UserAchievement"("userId");

-- CreateIndex
CREATE INDEX "UserAchievement_achievementId_idx" ON "UserAchievement"("achievementId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_userId_achievementId_key" ON "UserAchievement"("userId", "achievementId");

-- CreateIndex
CREATE INDEX "GameAnnotation_gameId_idx" ON "GameAnnotation"("gameId");

-- CreateIndex
CREATE INDEX "GameAnnotation_userId_idx" ON "GameAnnotation"("userId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "EmotionalAnalytics_userId_idx" ON "EmotionalAnalytics"("userId");

-- CreateIndex
CREATE INDEX "EmotionalAnalytics_gameId_idx" ON "EmotionalAnalytics"("gameId");

-- CreateIndex
CREATE INDEX "EmotionalAnalytics_createdAt_idx" ON "EmotionalAnalytics"("createdAt");

-- CreateIndex
CREATE INDEX "CognitiveSession_userId_idx" ON "CognitiveSession"("userId");

-- CreateIndex
CREATE INDEX "CognitiveSession_startTime_idx" ON "CognitiveSession"("startTime");

-- CreateIndex
CREATE UNIQUE INDEX "PlayingStyleDNA_userId_key" ON "PlayingStyleDNA"("userId");

-- CreateIndex
CREATE INDEX "PlayingStyleDNA_userId_idx" ON "PlayingStyleDNA"("userId");

-- CreateIndex
CREATE INDEX "AdaptivePuzzleSet_userId_idx" ON "AdaptivePuzzleSet"("userId");

-- CreateIndex
CREATE INDEX "AdaptivePuzzleSet_weaknessType_idx" ON "AdaptivePuzzleSet"("weaknessType");

-- CreateIndex
CREATE UNIQUE INDEX "CareerProgress_userId_key" ON "CareerProgress"("userId");

-- CreateIndex
CREATE INDEX "CareerProgress_userId_idx" ON "CareerProgress"("userId");

-- CreateIndex
CREATE INDEX "CareerProgress_currentLevel_idx" ON "CareerProgress"("currentLevel");

-- CreateIndex
CREATE INDEX "AICoachInsight_userId_idx" ON "AICoachInsight"("userId");

-- CreateIndex
CREATE INDEX "AICoachInsight_gameId_idx" ON "AICoachInsight"("gameId");

-- CreateIndex
CREATE INDEX "AICoachInsight_createdAt_idx" ON "AICoachInsight"("createdAt");

-- CreateIndex
CREATE INDEX "OpeningResearch_opening_idx" ON "OpeningResearch"("opening");

-- CreateIndex
CREATE INDEX "OpeningResearch_fen_idx" ON "OpeningResearch"("fen");

-- CreateIndex
CREATE INDEX "OpeningResearch_gamesPlayed_idx" ON "OpeningResearch"("gamesPlayed");

-- CreateIndex
CREATE INDEX "BlunderCluster_userId_idx" ON "BlunderCluster"("userId");

-- CreateIndex
CREATE INDEX "BlunderCluster_clusterType_idx" ON "BlunderCluster"("clusterType");

-- CreateIndex
CREATE INDEX "Game_tournamentId_idx" ON "Game"("tournamentId");

-- CreateIndex
CREATE INDEX "Game_whitePlayerId_idx" ON "Game"("whitePlayerId");

-- CreateIndex
CREATE INDEX "Game_blackPlayerId_idx" ON "Game"("blackPlayerId");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_puzzleRating_idx" ON "User"("puzzleRating");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentParticipant" ADD CONSTRAINT "TournamentParticipant_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentParticipant" ADD CONSTRAINT "TournamentParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentRound" ADD CONSTRAINT "TournamentRound_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuzzleAttempt" ADD CONSTRAINT "PuzzleAttempt_puzzleId_fkey" FOREIGN KEY ("puzzleId") REFERENCES "Puzzle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuzzleAttempt" ADD CONSTRAINT "PuzzleAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_initiatorId_fkey" FOREIGN KEY ("initiatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubMember" ADD CONSTRAINT "ClubMember_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubMember" ADD CONSTRAINT "ClubMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameAnnotation" ADD CONSTRAINT "GameAnnotation_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameAnnotation" ADD CONSTRAINT "GameAnnotation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmotionalAnalytics" ADD CONSTRAINT "EmotionalAnalytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CognitiveSession" ADD CONSTRAINT "CognitiveSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayingStyleDNA" ADD CONSTRAINT "PlayingStyleDNA_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdaptivePuzzleSet" ADD CONSTRAINT "AdaptivePuzzleSet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerProgress" ADD CONSTRAINT "CareerProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AICoachInsight" ADD CONSTRAINT "AICoachInsight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlunderCluster" ADD CONSTRAINT "BlunderCluster_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
