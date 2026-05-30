// import * as Notifications from "expo-notifications";

// import { PantryItem } from "@app/types";

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: true,
//     shouldShowBanner: true,
//     shouldShowList: true,
//   }),
// });

// const THRESHOLDS = [30, 15, 5] as const;

// const MESSAGES: Record<typeof THRESHOLDS[number], (name: string) => string> = {
//   30: (name) => `${name} vence em 30 dias. Planeje o consumo!`,
//   15: (name) => `${name} vence em 15 dias. Lembre de usar!`,
//   5: (name) => `⚠️ ${name} vence em 5 dias. Use logo!`,
// };

// function notifId(itemId: string, days: typeof THRESHOLDS[number]): string {
//   return `pantry_${itemId}_${days}d`;
// }

// export async function requestNotificationPermissions(): Promise<boolean> {
//   const { status: existing } = await Notifications.getPermissionsAsync();
//   if (existing === "granted") { return true; }
//   const { status } = await Notifications.requestPermissionsAsync();
//   return status === "granted";
// }

// export async function scheduleItemNotifications(item: PantryItem): Promise<void> {
//   await cancelItemNotifications(item.id);

//   for (const days of THRESHOLDS) {
//     // const trigger = new Date(item.expiresAt);
//     // trigger.setDate(trigger.getDate() - days);
//     // trigger.setHours(9, 0, 0, 0);

//     // mock de data para testes de notificações
//     const trigger = new Date(Date.now() + 30_000);

//     if (trigger > new Date()) {
//       await Notifications.scheduleNotificationAsync({
//         identifier: notifId(item.id, days),
//         content: {
//           title: "DespensaCerta",
//           body: MESSAGES[days](item.name),
//           data: { itemId: item.id, screen: "Alerts" },
//         },
//         trigger: {
//           type: Notifications.SchedulableTriggerInputTypes.DATE,
//           date: trigger,
//         },
//       });
//     }
//   }
// }

// export async function cancelItemNotifications(itemId: string): Promise<void> {
//   await Promise.all(
//     THRESHOLDS.map((d) =>
//       Notifications.cancelScheduledNotificationAsync(notifId(itemId, d)).catch(() => {}),
//     ),
//   );
// }
