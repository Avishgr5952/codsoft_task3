import fs from 'fs';
import path from 'path';
import net from 'net';
import { spawn } from 'child_process';
import EmbeddedPostgres from 'embedded-postgres';
import { PrismaClient } from '@prisma/client';

function isPortInUse(port: number, host = '127.0.0.1'): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1500);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
}

async function main() {
  const root = process.cwd();

  // 1. Ensure .env exists
  const envPath = path.join(root, '.env');
  const envExamplePath = path.join(root, '.env.example');
  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    console.log('[CareerHub] Initializing .env from .env.example...');
    fs.copyFileSync(envExamplePath, envPath);
  }

  // 2. Ensure PostgreSQL is up
  const pgRunning = await isPortInUse(5432);
  let pgInstance: any = null;
  if (!pgRunning) {
    console.log('[CareerHub] Starting local embedded PostgreSQL server on port 5432...');
    const dbDir = path.join(root, 'data', 'db');
    pgInstance = new EmbeddedPostgres({
      databaseDir: dbDir,
      port: 5432,
      user: 'postgres',
      password: 'password',
      persistent: true,
    });
    try {
      await pgInstance.initialise();
    } catch {
      // already initialized
    }
    await pgInstance.start();
    try {
      await pgInstance.createDatabase('careerhub');
    } catch {
      // already exists
    }
    console.log('[CareerHub] PostgreSQL is running on port 5432.');
  } else {
    console.log('[CareerHub] PostgreSQL is already active on port 5432.');
  }

  // 3. Check database push & seeding
  const prisma = new PrismaClient();
  try {
    const count = await prisma.user.count();
    if (count === 0) {
      console.log('[CareerHub] Empty database detected. Auto-seeding initial demo data...');
      const seedScript = spawn('npx.cmd', ['tsx', 'prisma/seed.ts'], { stdio: 'inherit', shell: true });
      await new Promise((resolve) => seedScript.on('close', resolve));
    } else {
      console.log(`[CareerHub] Database ready with ${count} users.`);
    }
  } catch (err: any) {
    console.warn('[CareerHub] Synchronizing schema via prisma db push...');
    const pushCmd = spawn('npx.cmd', ['prisma', 'db', 'push', '--skip-generate'], { stdio: 'inherit', shell: true });
    await new Promise((resolve) => pushCmd.on('close', resolve));
    console.log('[CareerHub] Seeding database...');
    const seedCmd = spawn('npx.cmd', ['tsx', 'prisma/seed.ts'], { stdio: 'inherit', shell: true });
    await new Promise((resolve) => seedCmd.on('close', resolve));
  } finally {
    await prisma.$disconnect();
  }

  // 4. Start Next.js dev server
  console.log('[CareerHub] Launching Next.js development server...');
  const nextDev = spawn('npx.cmd', ['next', 'dev'], { stdio: 'inherit', shell: true });

  nextDev.on('close', (code) => {
    process.exit(code ?? 0);
  });
}

main().catch((err) => {
  console.error('[CareerHub] Startup error:', err);
  process.exit(1);
});
