import React, { FC, useState } from 'react';
import { Button, Dialog, Icon } from '@rneui/base';
import useCalcStore from '@src/store/calculate';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { api } from '../api/api';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {}

const Item = ({ input }: { input: string }) => {
  const equation = input.split('=');
  return (
    <View style={styles.item}>
      <Text adjustsFontSizeToFit numberOfLines={1} style={styles.contentText}>
        {equation[0]}
      </Text>
      <Text adjustsFontSizeToFit numberOfLines={1} style={styles.contentText}>
        = {equation[1]}
      </Text>
    </View>
  );
};

const History: FC<Props> = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [parentHeight, setParentHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [canDelete, setCanDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const history = useCalcStore((state) => state.calculationHistory);

  const clearHistory = async () => {
    try {
      await api.deleteAllTransactions();
      setIsDeleting(false);
      useCalcStore.getState().clearHistory();
    } catch (error) {}
  };

  return (
    <SafeAreaView>
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
              onPress={() => setCanDelete(true)}>
              <Icon
                name='trash-can-outline'
                type='icomoon'
                size={30}
                color={'white'}
                iconStyle={{ height: 30 }}
              />
              {!isDeleting && (
                <Dialog
                  isVisible={canDelete}
                  onBackdropPress={() => setCanDelete(!canDelete)}
                  overlayStyle={{ backgroundColor: 'white' }}>
                  <Dialog.Title title='Alert' />
                  <Text>Are you sure you want to clear history?</Text>

                  <Dialog.Actions>
                    <Dialog.Button
                      title='Confirm'
                      style={{ backgroundColor: 'red' }}
                      onPress={() => {
                        setIsDeleting(true);
                        clearHistory();
                        setCanDelete(false);
                      }}
                    />
                    <Dialog.Button
                      title='Cancel'
                      onPress={() => setCanDelete(false)}
                    />
                  </Dialog.Actions>
                </Dialog>
              )}
              {isDeleting && (
                <Dialog overlayStyle={{ backgroundColor: 'white' }}>
                  <Dialog.Loading />
                </Dialog>
              )}
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
                    contentHeight >= parentHeight - (headerHeight + 26)
                      ? 0
                      : 15,
                  borderBottomRightRadius:
                    contentHeight >= parentHeight - (headerHeight + 26)
                      ? 0
                      : 15,
                },
              ]}
              alwaysBounceVertical={false}
              onContentSizeChange={(contentWidth, contentHeight) => {
                setContentHeight(contentHeight);
              }}
              data={history}
              renderItem={({ item, index }) => <Item input={item} />}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
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
