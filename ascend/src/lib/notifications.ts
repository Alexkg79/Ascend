import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const DAILY_REMINDER_IDENTIFIER = 'daily-defis-reminder';
const REMINDER_HOUR = 19;
const REMINDER_MINUTE = 0;
const ANDROID_CHANNEL_ID = 'daily-reminders';
const HAS_PROMPTED_STORAGE_KEY = 'ascend:notifications:has-prompted';

const REMINDER_MESSAGES = [
  'Tes défis du jour t’attendent 🔥',
  'Ta série continue si tu t’y mets maintenant 💪',
  'Quelques minutes suffisent pour avancer aujourd’hui ✨',
];

// Contrôle l'affichage des notifications reçues pendant que l'app est ouverte.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function pickReminderMessage(): string {
  return REMINDER_MESSAGES[Math.floor(Math.random() * REMINDER_MESSAGES.length)];
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: 'Rappels quotidiens',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

// À appeler à chaque lancement de l'app. Ne fait rien si la permission n'a
// pas été accordée. Sinon, reprogramme le rappel quotidien s'il n'est plus
// dans la liste des notifications planifiées (ex: après un redémarrage du
// téléphone, qui annule les notifications programmées par l'OS).
export async function ensureDailyReminderScheduled(): Promise<void> {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') return;

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const alreadyScheduled = scheduled.some((n) => n.identifier === DAILY_REMINDER_IDENTIFIER);
  if (alreadyScheduled) return;

  await ensureAndroidChannel();

  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_REMINDER_IDENTIFIER,
    content: {
      title: 'Ascend',
      body: pickReminderMessage(),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: REMINDER_HOUR,
      minute: REMINDER_MINUTE,
      channelId: Platform.OS === 'android' ? ANDROID_CHANNEL_ID : undefined,
    },
  });
}

// Indique si on a déjà proposé l'activation des notifications à l'utilisateur
// (accordée ou refusée) — permet de ne demander qu'une seule fois.
export async function hasPromptedForNotificationPermission(): Promise<boolean> {
  const value = await AsyncStorage.getItem(HAS_PROMPTED_STORAGE_KEY);
  return value === 'true';
}

export async function markNotificationPermissionPrompted(): Promise<void> {
  await AsyncStorage.setItem(HAS_PROMPTED_STORAGE_KEY, 'true');
}

export async function requestNotificationPermission(): Promise<Notifications.PermissionStatus> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status;
}
