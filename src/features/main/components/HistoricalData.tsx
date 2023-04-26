import useCalcStore, { CalcState } from '@src/store/calculate';
import { StyleSheet, Text, View } from 'react-native';

export default function HistoricalData() {
  const lastHistoricalData: string = useCalcStore(
    (state: CalcState) => state.lastHistoricalData
  );

  return (
    <View style={styles.content}>
      <Text style={styles.label}>{lastHistoricalData}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 25,
    color: '#5B5E67',
  },
  content: {
    height: 70,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    paddingRight: 20,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    backgroundColor: '#292A2D',
    flexDirection: 'column',
  },
});
