import { Button, Icon } from '@rneui/base';
import useCalcStore from '@src/store/calculate';
import { FC, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface Props {}

const Item = ({ input, result }: { input: string; result: string }) => {
  return (
    <View style={styles.item}>
      <Text adjustsFontSizeToFit numberOfLines={1} style={styles.contentText}>
        {input}
      </Text>
      <Text adjustsFontSizeToFit numberOfLines={1} style={styles.contentText}>
        = {result}
      </Text>
    </View>
  );
};

const History: FC<Props> = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [parentHeight, setParentHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const history = useCalcStore((state) => state.calculationHistory);
  return (
    <View
      style={styles.container}
      onLayout={(event) => setParentHeight(event.nativeEvent.layout.height)}>
      <View style={styles.parentContent}>
        <View
          style={styles.header}
          onLayout={(event) =>
            setHeaderHeight(event.nativeEvent.layout.height)
          }>
          <Button
            type='clear'
            buttonStyle={styles.button}
            onPress={() => useCalcStore.getState().setCanShowHistory(false)}>
            <Icon
              name='close'
              size={30}
              color={'white'}
              iconStyle={{ height: 30 }}
            />
          </Button>
          <Text style={styles.headerTitle}>History</Text>
          <Button
            type='clear'
            buttonStyle={styles.button}
            onPress={() => useCalcStore.getState().clearHistory()}>
            <Icon
              name='trash-can-outline'
              type='icomoon'
              size={30}
              color={'white'}
              iconStyle={{ height: 30 }}
            />
          </Button>
        </View>
        {history.length === 0 && (
          <View style={styles.contentEmpty}>
            <Text style={styles.contentText}>Empty!</Text>
            <Text style={styles.contentText}>Do some calculations</Text>
          </View>
        )}

        {history.length !== 0 && (
          <FlatList
            style={{ width: '90%' }}
            contentContainerStyle={[
              styles.content,
              {
                borderBottomLeftRadius:
                  contentHeight >= parentHeight - (headerHeight + 26) ? 0 : 15,
                borderBottomRightRadius:
                  contentHeight >= parentHeight - (headerHeight + 26) ? 0 : 15,
              },
            ]}
            alwaysBounceVertical={false}
            onContentSizeChange={(contentWidth, contentHeight) => {
              setContentHeight(contentHeight);
            }}
            data={history}
            renderItem={({ item, index }) => (
              <Item input={item.input} result={item.result} />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentEmpty: {
    height: 150,
    borderRadius: 15,
    width: '90%',
    backgroundColor: '#3B3D43',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  item: {
    padding: 20,
    borderBottomWidth: 1.8,
    borderBottomColor: '#292A2D',
  },
  content: {
    borderRadius: 15,
    backgroundColor: '#4D5057',
  },
  button: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 'auto',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
  },
  invisibleFiller: {
    fontSize: 24,
    color: '#292A2D',
  },
  header: {
    marginVertical: 20,
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  parentContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: '#292A2D',
    alignItems: 'center',
    bottom: 0,
  },
  container: {
    height: '100%',
    display: 'flex',
    backgroundColor: '#000',
    flexDirection: 'column',
  },
});

export default History;
