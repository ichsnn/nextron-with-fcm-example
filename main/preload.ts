import { contextBridge, ipcRenderer } from "electron";
import {
  START_NOTIFICATION_SERVICE,
  NOTIFICATION_SERVICE_STARTED,
  NOTIFICATION_SERVICE_ERROR,
  NOTIFICATION_RECEIVED,
  TOKEN_UPDATED,
} from 'electron-push-receiver/src/constants'

// this will end up on the window object in the react app (ie `window.electron.sendNotification()` )
contextBridge.exposeInMainWorld("electron", {
  isElectron: true, // if window.electron exists, it's electron, but lets include this as well
  getFCMToken: (channel, func) => {
    ipcRenderer.once(channel, func);
    ipcRenderer.send("getFCMToken");
  },
});

// Listen for service successfully started
ipcRenderer.on(START_NOTIFICATION_SERVICE, (_, token) => {console.log('FCM service started', token)})
// Start the service
ipcRenderer.on(NOTIFICATION_SERVICE_STARTED, (_, token) => ipcRenderer.send('storeFCMToken', token))
// Handle notification errors
ipcRenderer.on(NOTIFICATION_SERVICE_ERROR, (_, error) => {console.log(error)})
// Store the new token
ipcRenderer.on(TOKEN_UPDATED, (_, token) => {
  const event = new CustomEvent('fcmTokenUpdated', { 
    detail: { token },
   });
  window.dispatchEvent(event);
})
// Display notification
ipcRenderer.on(NOTIFICATION_RECEIVED, (_, serverNotificationPayload) => {
  // check to see if payload contains a body string, if it doesn't consider it a silent push
  if (serverNotificationPayload.notification.body){
    // payload has a body, so show it to the user
    console.log('display notification', serverNotificationPayload)
    let myNotification = new Notification(serverNotificationPayload.notification.title, {
      body: serverNotificationPayload.notification.body,
    })
    
    myNotification.onclick = () => {
      console.log('Notification clicked')
    }  
  } else {
    // payload has no body, so consider it silent (and just consider the data portion)
    console.log('do something with the key/value pairs in the data', serverNotificationPayload.data)
  }
});

// FCM sender ID from FCM console
const senderId = process.env.FCM_SENDER_ID
ipcRenderer.send(START_NOTIFICATION_SERVICE, senderId)