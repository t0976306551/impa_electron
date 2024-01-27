import { app, BrowserWindow, shell, ipcMain , dialog } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import * as path from 'path';
import sqlite3 from 'sqlite3';
import * as os from 'os';
import { ipcRenderer } from "electron";
import { exec } from 'child_process';
// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null

// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    width: 800,  
    height: 600, 
    minWidth:800,
    title: 'Main window',
 
    
    icon: join(process.env.VITE_PUBLIC, 'impa_placeholder.png'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}

let dbSlot = ''
if(app.isPackaged){
  dbSlot = 'resources/';
}

const db = new sqlite3.Database(path.resolve(dbSlot+'db/impa.db'));


app.whenReady().then(() => {
  createWindow().then(() => {
    getMacAddress();
  });
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow();
   
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

// const dbPath = path.join("C:/SQLite", 'impa.db');
// const filePath = path.resolve(app.getAppPath(), 'db', 'impa.db');


// const db = new sqlite3.Database(filePath);

// Example query
// db.serialize(() => {
//   db.each('SELECT * FROM your_table', (err, row) => {
//     console.log(row);
//   });
// });


ipcMain.handle('query-database', async (event, query) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (db) {
        // console.log('Database initialized.');
        const rows = await new Promise((resolve, reject) => {
          db.all(query, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          });
        });
        resolve(rows);
      } else {
        console.log('Database not initialized.');
        
        throw new Error('Database not initialized.');
      }
    } catch (error) {
      reject(error);
    }
  });
});


const getMacAddress = async () => {
  try {
    const macAddresses:any = await new Promise((resolve, reject) => {
      // 使用 child_process 的 exec 函數執行 getmac 命令
      exec('getmac', (err, data) => {
        if (err) {
          reject(err);
        } else {
          const macRegex = /([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/;
          // 將 getmac 命令的輸出按行分割
          const lines = data.split('\n');
          // 選擇包含有效 MAC 地址的行
          const validLines = lines.filter(line => macRegex.test(line));
          // 提取每一行的 MAC 地址
          const addresses = validLines.map(line => line.match(macRegex)[0]);
          resolve(addresses);
         
        }
      });
    });

    if (macAddresses.length > 0) {
      const primaryMacAddress = macAddresses[0].trim();
      try {
        const results:any = await new Promise((resolve, reject) => {
          db.all("SELECT * FROM hardwareInfo", (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          });
        });
      
        if (results.length < 1) {
          await new Promise((resolve, reject) => {
            db.all(`INSERT INTO hardwareInfo (info) VALUES ("${primaryMacAddress}")`, (err, rows) => {
              if (err) {
                reject(err);
              } else {
                resolve(rows);
              }
            });
          });
        }else if(results.length > 0){
          const getMac:any = await new Promise((resolve, reject) => {
            db.all(`SELECT * FROM hardwareInfo WHERE info = "${primaryMacAddress}"`, (err, rows) => {
              if (err) {
                reject(err);
              } else {
                resolve(rows);
              }
            });
          });
        
          if(getMac.length < 1){
            dialog.showErrorBox('錯誤', 'MAC 地址不正確，程式即將關閉。');
            app.quit();
          }

        }
      } catch (error) {
        console.error("Error in query-database:", error);
      }

    } else {
      console.error("No MAC addresses found.");
    }
  } catch (error) {
    // 在這裡處理 `exec` 的錯誤
    console.error("Error in getmac command:", error);
  }
};
