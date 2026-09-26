#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');

console.log('♟️  Chess Platform - Automated Quickstart Setup\n');

// 1. Copy env files if missing
const envCopies = [
  {
    target: path.join(rootDir, 'apps', 'backend', '.env'),
    source: path.join(rootDir, 'apps', 'backend', '.env.example'),
    name: 'apps/backend/.env',
  },
  {
    target: path.join(rootDir, 'apps', 'ws', '.env'),
    source: path.join(rootDir, 'apps', 'ws', '.env.example'),
    name: 'apps/ws/.env',
  },
  {
    target: path.join(rootDir, 'apps', 'frontend', '.env'),
    source: path.join(rootDir, 'apps', 'frontend', '.env.example'),
    name: 'apps/frontend/.env',
  },
  {
    target: path.join(rootDir, 'packages', 'db', '.env'),
    source: path.join(rootDir, 'packages', 'db', '.env.example'),
    name: 'packages/db/.env',
  },
];

console.log('📁 Checking environment configuration files...');
for (const item of envCopies) {
  if (!fs.existsSync(item.target)) {
    if (fs.existsSync(item.source)) {
      fs.copyFileSync(item.source, item.target);
      console.log(`   ✅ Created ${item.name} from template`);
    } else {
      console.log(`   ⚠️  Template missing for ${item.name}`);
    }
  } else {
    console.log(`   ℹ️  ${item.name} already exists`);
  }
}

// 2. Generate Prisma client
console.log('\n🔨 Generating Prisma Client...');
try {
  execSync('npx prisma generate', {
    cwd: path.join(rootDir, 'packages', 'db'),
    stdio: 'inherit',
  });
  console.log('   ✅ Prisma client generated successfully');
} catch (error) {
  console.warn('   ⚠️  Prisma generate encountered a warning or error. Continuing...');
}

console.log('\n🎉 Setup complete! You are ready to run:');
console.log('   yarn dev          # (or npm run dev) - Starts all services (Frontend, WS, API)');
console.log('   docker compose up -d # (Optional) Starts local PostgreSQL & Redis\n');
