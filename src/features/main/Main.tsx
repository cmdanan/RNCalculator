import HistoricalData from './components/HistoricalData';
import Preview from './components/Preview';
import Buttons from './components/Buttons';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Main() {
  return (
    <SafeAreaView style={styles.container}>
      <HistoricalData></HistoricalData>
      <Preview></Preview>
      <Buttons></Buttons>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
});
