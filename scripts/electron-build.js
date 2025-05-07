
const { spawn } = require('child_process');

// Build React app
const buildReact = spawn('npm', ['run', 'build'], { 
  shell: true,
  stdio: 'inherit'
});

buildReact.on('close', (code) => {
  if (code !== 0) {
    console.error('Error building React app');
    process.exit(1);
  }
  
  console.log('React build completed successfully');
  
  // Build Electron app
  const buildElectron = spawn('electron-builder', ['build', '--config', 'electron-builder.json'], {
    shell: true,
    stdio: 'inherit'
  });
  
  buildElectron.on('close', (code) => {
    if (code !== 0) {
      console.error('Error building Electron app');
      process.exit(1);
    }
    console.log('Electron build completed successfully');
  });
});
