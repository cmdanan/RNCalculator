import React from 'react';
import Main from '@src/features/main/Main';
import { SafeAreaView, StyleSheet } from 'react-native';
import {
  ThemeProvider,
  createTheme,
  registerCustomIconType,
} from '@rneui/themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { useFonts } from 'expo-font';

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

  const customColors = {
    calcPrimary: '#3764B4',
    calcGrey0: '#5B5E67',
    calcGrey1: '#4D5057',
    calcGrey2: '#3B3D43',
    calcGrey3: '#292A2D',
  };
  const theme = createTheme({
    mode: 'light',
    lightColors: { ...customColors },
    darkColors: { ...customColors },
  });

  return (
    <ThemeProvider theme={theme}>
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
