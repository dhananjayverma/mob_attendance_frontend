import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppProvider } from '../context/AppContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AppProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="attendance-report" options={{ headerShown: false }} />
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
          <Stack.Screen name="sign-up" options={{ headerShown: false }} />
          <Stack.Screen name="dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="mark-attendance" options={{ headerShown: false }} />
          <Stack.Screen name="face-capture" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AppProvider>
  );
}
