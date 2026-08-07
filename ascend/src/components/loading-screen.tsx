import { ActivityIndicator } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { ThemedView } from './themed-view';

export function LoadingScreen() {
  const theme = useTheme();
  return (
    <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={theme.text} />
    </ThemedView>
  );
}
