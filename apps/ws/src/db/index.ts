import prisma from '@repo/db/client';

export const db = prisma;

let dbConnected = false;

export const checkDbConnection = async (): Promise<boolean> => {
  try {
    await prisma.$connect();
    dbConnected = true;
    console.log('✅ [WS] Database connected successfully');
    return true;
  } catch (error) {
    dbConnected = false;
    console.log('⚠️  [WS] Database not reachable. Running in real-time in-memory mode');
    return false;
  }
};

checkDbConnection();

export const isDbConnected = () => dbConnected;
