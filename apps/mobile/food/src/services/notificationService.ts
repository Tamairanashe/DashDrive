import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export const notificationService = {
    /**
     * Shows a local notification instantly (Foreground Fallback)
     */
    async showLocalNotification(title: string, body: string, data = {}) {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    data,
                    sound: true,
                    priority: 'max',
                },
                trigger: null, // trigger immediately
            });
        } catch (error) {
            console.error('Error showing notification:', error);
        }
    },

    /**
     * Register for push notifications and get the token
     */
    async registerForPushNotificationsAsync() {
        if (!Device.isDevice) {
            console.log('Push notifications require a physical device');
            return null;
        }

        if (!Constants.expoConfig?.extra?.eas?.projectId && !isExpoGo) {
            console.warn('EAS Project ID not found. Push notifications may not work.');
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('orders', {
                name: 'Order Alerts',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#10B981',
            });
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.warn('Failed to get push token for push notification!');
            return null;
        }

        try {
            const token = (await Notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig?.extra?.eas?.projectId,
            })).data;
            console.log('📲 Push Token Generated:', token);
            return token;
        } catch (error) {
            console.error('Error getting push token:', error);
            return null;
        }
    }
};
