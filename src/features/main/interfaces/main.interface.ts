export interface CalcButton {
  label: string;
  mode: 'light' | 'dark' | 'primary';
  icon?: string;
}

export interface CalcButtonData {
  [key: string]: CalcButton[];
}
