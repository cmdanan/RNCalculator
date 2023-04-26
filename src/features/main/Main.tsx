import HistoricalData from './components/HistoricalData';
import Preview from './components/Preview';
import Buttons from './components/Buttons';
import { StyleSheet, View } from 'react-native';
import History from '../history/History';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Main() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <HistoricalData></HistoricalData>
        <Preview></Preview>
        <Buttons></Buttons>
        {/* <History></History> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
});
