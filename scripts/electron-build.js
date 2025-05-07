
const { spawn } = require('child_process');

// Get platform from command line args
const args = process.argv.slice(2);
const platforms = args.filter(arg => arg === '--win' || arg === '--mac' || arg === '--linux');

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
  
  // Prepare electron-builder command
  let electronBuilderArgs = ['build'];
  
  // Add platform-specific flags if provided
  if (platforms.length > 0) {
    platforms.forEach(platform => {
      if (platform === '--win') electronBuilderArgs.push('--win');
      if (platform === '--mac') electronBuilderArgs.push('--mac');
      if (platform === '--linux') electronBuilderArgs.push('--linux');
    });
  }
  
  electronBuilderArgs.push('--config', 'electron-builder.json');
  
  // Build Electron app
  const buildElectron = spawn('electron-builder', electronBuilderArgs, {
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
