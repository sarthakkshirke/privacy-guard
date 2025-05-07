
// Preload script runs before the renderer process is loaded
// It has access to Node.js APIs and can expose limited functionality to the renderer

const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');

// Expose specific APIs to the renderer process
contextBridge.exposeInMainWorld('electron', {
  // File system access for enhanced file operations
  fileSystem: {
    readFile: (filePath) => {
      return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(data);
        });
      });
    },
    getPath: (name) => ipcRenderer.invoke('get-path', name)
  },
  // Expose app information
  app: {
    getVersion: () => ipcRenderer.invoke('get-app-version')
  }
});
