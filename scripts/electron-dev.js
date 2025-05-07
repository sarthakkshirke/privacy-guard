
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Start the development server
const server = spawn('npm', ['run', 'dev'], { 
  shell: true,
  env: process.env,
  stdio: 'inherit'
});

// Wait for the dev server to start
setTimeout(() => {
  // Start Electron with the dev URL
  const electron = spawn('electron', [path.join(__dirname, '../electron/main.js')], {
    shell: true,
    env: {
      ...process.env,
      ELECTRON_START_URL: 'http://localhost:8080',
      NODE_ENV: 'development'
    },
    stdio: 'inherit'
  });

  // Handle clean exit
  const cleanup = () => {
    if (server && !server.killed) {
      server.kill();
    }
    if (electron && !electron.killed) {
      electron.kill();
    }
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('exit', cleanup);
}, 10000); // Wait 10 seconds for the dev server to start
