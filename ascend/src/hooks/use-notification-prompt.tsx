import { useCallback, useEffect, useState } from 'react';

import {
  ensureDailyReminderScheduled,
  hasPromptedForNotificationPermission,
  markNotificationPermissionPrompted,
  requestNotificationPermission,
} from '@/lib/notifications';

// Affiche la proposition d'activer les notifications une seule fois, la
// première fois que l'écran d'accueil est atteint (avant ça, on ne l'a
// jamais demandé — voir hasPromptedForNotificationPermission).
export function useNotificationPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    hasPromptedForNotificationPermission().then((alreadyPrompted) => {
      if (!cancelled && !alreadyPrompted) {
        setVisible(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const accept = useCallback(async () => {
    setVisible(false);
    const status = await requestNotificationPermission();
    await markNotificationPermissionPrompted();
    if (status === 'granted') {
      await ensureDailyReminderScheduled();
    }
  }, []);

  const dismiss = useCallback(async () => {
    setVisible(false);
    await markNotificationPermissionPrompted();
  }, []);

  return { visible, accept, dismiss };
}
