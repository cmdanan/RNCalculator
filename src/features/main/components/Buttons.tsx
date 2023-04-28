import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { buttons } from '../assets/button-data';
import { CalcButton } from '../interfaces/main.interface';
import React, { FC } from 'react';
import { Icon } from '@rneui/base';
import useCalcStore from '@src/store/calculate';
import History from '@src/features/main/components/History';
import { api } from '../api/api';
import * as SecureStore from 'expo-secure-store';

interface Props {}

const Buttons: FC<Props> = () => {
  const canShowHistory = useCalcStore((state) => state.canShowHistory);
  const toggleHistory = () => {
    useCalcStore.setState({ canShowHistory: !canShowHistory });
  };

  return (
    <View style={styles.content}>
      {Object.keys(buttons).map((key: string) => {
        const row: CalcButton[] = buttons[key];
        return (
          <View key={key} style={styles.row}>
            {row.map((button: CalcButton) => {
              return displayedButton(button);
            })}
          </View>
        );
      })}

      <Modal
        visible={canShowHistory}
        animationType='slide'
        transparent={true}
        onRequestClose={toggleHistory}
        style={styles.overlay}>
        <History></History>
      </Modal>
    </View>
  );
};

const displayedButton = (param: {
  label: string;
  mode: 'light' | 'dark' | 'primary';
  icon?: string;
}) => {
  const bgColor =
    param.mode === 'light'
      ? styles.buttonLight
      : param.mode === 'dark'
      ? styles.buttonDark
      : styles.buttonPrimary;

  return (
    <Pressable
      key={param.label}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.8 : 1,
        },
        styles.button,
        bgColor,
      ]}
      onPress={() => onPressButton(param.label)}>
      {param.label !== 'history' && (
        <Text style={styles.label}>{param.label}</Text>
      )}
      {param.icon && (
        <Icon
          name={param.icon as any}
          size={40}
          color='white'
          type='icomoon'
          iconStyle={{ height: 40 }}
        />
      )}
    </Pressable>
  );
};

const store = useCalcStore;

const onPressButton = async (label: string) => {
  const operators = ['+', '-', 'x', '÷', '=', '+/-'];
  const input = store.getState().input;

  if (input === '' && operators.includes(label)) {
    return;
  }

  const isOperatorPressed = store.getState().isOperatorPressed;
  const isPercentagePressed = store.getState().isPercentagePressed;
  const isDecimalPressed = store.getState().isDecimalPressed;
  const isCaclulationDone = store.getState().isCalculationDone;
  let lastValue = store.getState().lastHistoricalData;
  let currentInput: string = input;
  let newInput: string = '';

  switch (label) {
    case '+':
      currentInput += ' +';
      onOperatorIsPressed(currentInput);
      break;
    case '-':
      currentInput += ' -';
      onOperatorIsPressed(currentInput);
      break;
    case 'x':
      currentInput += ' x';
      onOperatorIsPressed(currentInput);
      break;
    case '÷':
      currentInput += ' ÷';
      onOperatorIsPressed(currentInput);
      break;
    case '+/-':
      currentInput =
        +currentInput > 0
          ? (-Math.abs(+currentInput)).toString()
          : Math.abs(+currentInput).toString();
      store.getState().setInput(currentInput);
      store.getState().setIsCalculationDone(false);
      break;
    case '%':
      currentInput += '%';
      onOperatorIsPressed(currentInput);
      store.setState({ isPercentagePressed: true });
      break;
    case 'AC':
      store.getState().clear();
      store.getState().setIsCalculationDone(false);
      break;
    case 'history':
      store.getState().setCanShowHistory(true);
      break;
    case '.':
      if (isDecimalPressed) {
        return;
      }
      newInput =
        input === '' ? '0.' : isOperatorPressed ? '0.' : input.concat(label);
      onSetInput(newInput);
      store.setState({ isDecimalPressed: true });
      break;
    case '=':
      const savedUUID = await SecureStore.getItemAsync('uuid');
      if (savedUUID === null) {
        api.createUser();
      }

      if (isCaclulationDone) {
        return;
      }

      const hasOperator = new RegExp(/[(\+\-\x\÷\=\+\/\-\%/)*]/gim);
      if (!hasOperator.test(lastValue)) {
        return;
      }

      let completeEquation = !isPercentagePressed
        ? `${lastValue} ${input}`
        : `${lastValue.replace('%', '')}/100`;

      completeEquation = convertEquation(completeEquation, 'eval');

      if (completeEquation.split(' ').length > 3) {
        return;
      }

      let result = eval(completeEquation);

      completeEquation = convertEquation(completeEquation, 'display');

      result = setDecimalPts(result, completeEquation);
      const historyEntry = `${completeEquation} = ${result}`;
      onSetInput(result.toString(), true);
      store.getState().setlastHistoricalData(completeEquation);
      store.getState().addToHistory(historyEntry);
      await api.createTransaction(historyEntry);
      store.getState().setIsPercentagePressed(false);
      store.getState().setIsDecimalPressed(false);
      store.getState().setIsCalculationDone(true);
      break;
    default:
      if (label === '0' && currentInput === '0') {
        return;
      }
      newInput = isOperatorPressed ? label : input.concat(label);
      onSetInput(newInput);
      break;
  }
};

const convertEquation = (equation: string, type: 'display' | 'eval') => {
  const isPercentagePressed = store.getState().isPercentagePressed;
  switch (true) {
    case type === 'eval' && equation.includes('x'):
      equation = equation.replace('x', '*');
      break;
    case type === 'eval' && equation.includes('÷'):
      equation = equation.replace('÷', '/');
      break;
    case type === 'display' && equation.includes('/') && isPercentagePressed:
      equation = equation.replace('/100', '%');
      break;
    case type === 'display' && equation.includes('/') && !isPercentagePressed:
      equation = equation.replace('/', '÷');
      break;
    case type === 'display' && equation.includes('*'):
      equation = equation.replace('*', 'x');
    default:
      break;
  }
  return equation;
};

const setDecimalPts = (result: string, data: string) => {
  const isPercentagePressed = store.getState().isPercentagePressed;
  const isDecimalPressed = store.getState().isDecimalPressed;
  let equation: string[] = [];
  let firstVar: string = '';
  let secondVar: string = '';
  let longest: number = 0;

  if (!isDecimalPressed && !isPercentagePressed) {
    return Math.round(+result).toFixed(0);
  }

  if (!isPercentagePressed && isDecimalPressed) {
    equation = data.split(' ');
    firstVar = equation[0].slice(equation[0].indexOf('.') + 1);
    secondVar = equation[2].slice(equation[2].indexOf('.') + 1);
    longest =
      firstVar.length > secondVar.length ? firstVar.length : secondVar.length;
  } else {
    equation = result.toString().split('.');
    longest = equation[equation.length - 1].length;
  }

  return Number(result).toFixed(longest);
};

const onSetInput = (data: string, isPressed: boolean = false) => {
  store.getState().setInput(data);
  store.getState().setIsOperatorPressed(isPressed);
};

const onOperatorIsPressed = (data: string) => {
  store.getState().setlastHistoricalData(data);
  store.getState().setIsOperatorPressed(true);
  store.getState().setIsCalculationDone(false);
};

const styles = StyleSheet.create({
  overlay: {
    display: 'flex',
  },
  content: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#292A2D',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    height: 100,
  },
  /** Button */
  button: {
    flex: 1,
    borderRadius: 10,
    margin: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 40,
    color: '#FFFFFF',
  },
  buttonLight: {
    backgroundColor: '#5B5E67',
  },
  buttonDark: {
    backgroundColor: '#3B3D43',
  },
  buttonPrimary: {
    backgroundColor: '#3764B4',
  },
});

export default Buttons;
