import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import {
  ThemeProvider,
  registerCustomIconType,
} from '@rneui/themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { useFonts } from 'expo-font';
import Main from '@src/features/main/Main';
import { api } from '@src/features/main/api/api';

const Icon = createIconSetFromIcoMoon(
  require('@src/assets/icons/selection.json')
);

export default function App() {
  registerCustomIconType('icomoon', Icon);

  const [fontsLoaded] = useFonts({
    icomoon: require('@src/assets/icons/icomoon.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  api.init();

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar />
          <Main></Main>
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
