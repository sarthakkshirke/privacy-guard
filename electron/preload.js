
// Preload script runs before the renderer process is loaded
// It has access to Node.js APIs and can expose limited functionality to the renderer

const { contextBridge } = require('electron');

// Expose specific APIs to the renderer process
contextBridge.exposeInMainWorld('electron', {
  // Add any secure electron APIs here that you want to expose to the renderer process
  // Example: openFile: () => ipcRenderer.invoke('open-file'),
});
