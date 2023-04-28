import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface CalcState {
  input: string;
  lastHistoricalData: string;
  calculationHistory: string[];
  isOperatorPressed: boolean;
  isDecimalPressed: boolean;
  isPercentagePressed: boolean;
  isCalculationDone: boolean;
  canShowHistory: boolean;
  setInput: (value: string) => void;
  clear: () => void;
  addToHistory: (value: string) => void;
  setIsOperatorPressed: (value: boolean) => void;
  setIsCalculationDone: (value: boolean) => void;
  setIsPercentagePressed: (value: boolean) => void;
  setIsDecimalPressed: (value: boolean) => void;
  setlastHistoricalData: (value: string) => void;
  clearHistory: () => void;
  setCanShowHistory: (value: boolean) => void;
}

export interface HistoryData {
  input: string;
  result: string;
}

const useCalcStore = create(
  immer<CalcState>((set) => ({
    input: '',
    lastHistoricalData: '',
    calculationHistory: [],
    isOperatorPressed: false,
    isDecimalPressed: false,
    isPercentagePressed: false,
    isCalculationDone: false,
    canShowHistory: false,
    setInput: (value: string) => set((state: CalcState) => ({ input: value })),
    clear: () => set(() => ({ input: '', lastHistoricalData: '' })),
    setIsCalculationDone: (value: boolean) =>
      set(() => ({ isCalculationDone: value })),
    setlastHistoricalData: (value: string) =>
      set((state: CalcState) => ({ lastHistoricalData: value })),
    setIsOperatorPressed: (value: boolean) =>
      set(() => ({ isOperatorPressed: value })),
    setIsPercentagePressed: (value: boolean) =>
      set(() => ({ isPercentagePressed: value })),
    setIsDecimalPressed: (value: boolean) =>
      set(() => ({ isDecimalPressed: value })),
    addToHistory: (value: string) =>
      set((state: CalcState) => ({
        calculationHistory: [...state.calculationHistory, value],
      })),
    clearHistory: () => set(() => ({ calculationHistory: [] })),
    setCanShowHistory: (value: boolean) =>
      set({
        canShowHistory: value,
      }),
  }))
);

export default useCalcStore;
