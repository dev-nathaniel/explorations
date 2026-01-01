import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { ExplorationsProvider } from '@/hooks/useExplorations';

export {
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

const ExplorationsTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#09090B',
    card: '#18181B',
    text: '#FAFAFA',
    border: '#27272A',
    primary: '#2665f1',
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <ThemeProvider value={ExplorationsTheme}>
      <ExplorationsProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="add-exploration"
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="exploration/[id]"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </ExplorationsProvider>
    </ThemeProvider>
  );
}
