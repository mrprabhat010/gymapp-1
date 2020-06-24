import {not} from "react-native-reanimated";

const PushNotification = require("react-native-push-notification");
import messaging from '@react-native-firebase/messaging';
import {notificationActions} from "../constants/appConstants";
import RNExitApp from "react-native-exit-app";
import {navigate} from "../navigation/RootNavigation";
import RouteNames from "../navigation/RouteNames";
import requestCameraAndAudioPermission from "./permission";

export const configureFCMNotification = async () => {
  try {
    let deviceToken = await messaging().getToken();
    console.log("FCM token:", deviceToken);
    PushNotification.configure({
      onRegister: (token) => {
        console.log("TOKEN:", token);
      },
      onNotification: handleNotification,
      senderID: deviceToken,
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
      visibility: 'public',

    });
  } catch (error) {
    console.log("error", error);
  }
};

const handleNotification = async (notification) => {
  console.log("General Notification", notification);
  if(notification.action===notificationActions.Reject){
    PushNotification.cancelAllLocalNotifications();
    RNExitApp.exitApp();
  }
  if(notification.action===notificationActions.Accept){
    PushNotification.cancelAllLocalNotifications();
    console.log("Accepted call");
    const {agoraAppId,sessionId,userEmail} = notification.payload;
    const permissionGranted = await requestCameraAndAudioPermission();
    if (!permissionGranted) return;
    navigate(RouteNames.VideoCall, {
      AppID: agoraAppId,
      ChannelName: sessionId
    });
  }
  if (notification.foreground) {
    console.log("Handled notification in App");
    // showNotification(notification.message);
  }

};



export const LocalNotification = (data) => {
  const {sessionId, agoraAppId, userEmail} = data;

  PushNotification.localNotification({
    autoCancel: false, // (optional) default: true
    largeIcon: "ic_launcher",
    smallIcon: "ic_notification",
    color: "red",
    vibrate: true,
    vibration: 300,
    priority: "high",
    visibility: "public",
    importance: "high",
    ticker:'testticker',
    allowWhileIdle: true,
    ignoreInForeground: false,
    // ongoing:true,
    /* iOS and Android properties */
    title: `${userEmail} calling`,
    message: "Accept call?",
    playSound: true,
    soundName: "ringer.mp3",
    number: 10,
    actions: `["${notificationActions.Accept}", "${notificationActions.Reject}"]`,
    payload:data
  });
}