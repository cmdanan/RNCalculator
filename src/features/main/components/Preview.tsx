import useCalcStore, { CalcState } from '@src/store/calculate';
import { StyleSheet, Text, View } from 'react-native';

export default function Preview() {
  const current: string = useCalcStore((state: CalcState) => state.input);

  return (
    <View style={styles.content}>
      <Text adjustsFontSizeToFit numberOfLines={1} style={styles.label}>
        {current || 0}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 70,
    color: '#FFFFFF',
  },
  content: {
    height: 150,
    paddingRight: 20,
    paddingBottom: 20,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    backgroundColor: '#292A2D',
  },
});
