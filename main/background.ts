import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import {setup as setupPushReceiver} from 'electron-push-receiver';
import Store from 'electron-store';
import path from 'path';

const isProd: boolean = process.env.NODE_ENV === 'production';

const store = new Store();

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    }
  });

  setupPushReceiver(mainWindow.webContents)

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }

  ipcMain.on("storeFCMToken", (e, token) => {
    store.set('fcm_token', token);
  });

  ipcMain.on("getFCMToken", async (e) => {
    e.sender.send('getFCMToken', store.get('fcm_token'));
  });
})();

app.on('window-all-closed', () => {
  app.quit();
});
