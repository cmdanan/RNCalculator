import { CalcButtonData } from '../interfaces/main.interface';

export const buttons: CalcButtonData = {
  firstRow: [
    {
      label: 'AC',
      mode: 'light',
    },
    {
      label: '+/-',
      mode: 'light',
    },
    {
      label: '%',
      mode: 'light',
    },
    {
      label: '÷',
      mode: 'primary',
    },
  ],
  secondRow: [
    {
      label: '7',
      mode: 'dark',
    },
    {
      label: '8',
      mode: 'dark',
    },
    {
      label: '9',
      mode: 'dark',
    },
    {
      label: 'x',
      mode: 'primary',
    },
  ],
  thirdRow: [
    {
      label: '4',
      mode: 'dark',
    },
    {
      label: '5',
      mode: 'dark',
    },
    {
      label: '6',
      mode: 'dark',
    },
    {
      label: '-',
      mode: 'primary',
    },
  ],
  fourthRow: [
    {
      label: '1',
      mode: 'dark',
    },
    {
      label: '2',
      mode: 'dark',
    },
    {
      label: '3',
      mode: 'dark',
    },
    {
      label: '+',
      mode: 'primary',
    },
  ],
  fifthRow: [
    {
      label: '.',
      mode: 'dark',
    },
    {
      label: '0',
      mode: 'dark',
    },
    {
      label: 'history',
      icon: 'history',
      mode: 'dark',
    },
    {
      label: '=',
      mode: 'primary',
    },
  ],
};
