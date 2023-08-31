# nextron-with-fcm

This is example of using [nextron](https://github.com/saltyshiomix/nextron) with [electron-push-receiver](https://github.com/MatthieuLemoine/electron-push-receiver) to send notification from Google Firebase Cloud Messaging (FCM) service.

## How To Use

```bash
# Clone this repository
$ git clone

# Go into the repository
$ cd nextron-with-fcm

# Install dependencies
$ yarn (or `npm install`)
```

You need to set your senderId in ```./main/preload.ts``` file, u can use ```.env``` file to set it.
To test the notification just import the ```example electron FCM.postman_collection.json``` file to your postman and send the request by change the SERVER_KEY with your Firebase FCM Server Key.
To see the FCM token you can open the devtools and see the console log in Chromonium the debug console.

### Run in development mode

```bash
# Run the app
$ yarn dev (or `npm run dev`)
```

## References

- [electron-push-receiver](https://github.com/MatthieuLemoine/electron-push-receiver)
- [electron-fcm-demo](https://github.com/CydeSwype/electron-fcm-demo)
- [nextron](https://github.com/saltyshiomix/nextron)
