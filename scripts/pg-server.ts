import EmbeddedPostgres from 'embedded-postgres';
import path from 'path';
import net from 'net';

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

async function startDatabase() {
  const inUse = await isPortInUse(5432);
  const dbDir = path.join(process.cwd(), 'data', 'db');

  if (inUse) {
    console.log('PostgreSQL is already active and listening on 127.0.0.1:5432.');
    console.log('Ready for connections: postgresql://postgres:password@127.0.0.1:5432/careerhub?schema=public');
    return;
  }

  const pg = new EmbeddedPostgres({
    databaseDir: dbDir,
    port: 5432,
    user: 'postgres',
    password: 'password',
    persistent: true,
  });

  try {
    await pg.initialise();
  } catch (err: any) {
    // Already initialized or directory exists
  }

  await pg.start();
  console.log('Official Embedded PostgreSQL Server is now running on 127.0.0.1:5432');

  try {
    await pg.createDatabase('careerhub');
    console.log('Created database "careerhub"');
  } catch (e) {
    // Database already exists
  }

  console.log('Ready for connections: postgresql://postgres:password@127.0.0.1:5432/careerhub?schema=public');
}

startDatabase().catch(console.error);
