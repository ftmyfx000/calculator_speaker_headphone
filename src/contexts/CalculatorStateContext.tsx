import { createContext, useContext, useState, ReactNode } from 'react';

// Define state types for each calculator
interface TSParameterState {
  mms: string;
  kms: string;
  bl: string;
  re: string;
  effectiveRadius: string;
  airDensity: string;
  power: string;
  rms: string;
  
  // 振幅・音圧計算用
  spl: string;
  frequency: string;
  micDistance: string;
  inputVoltage: string;
  
  // 薄膜パターン用
  volumeResistivity: string;
  lineWidth: string;
  lineThickness: string;
  lineLength: string;
  
  // Xmax計算用
  vcWindingWidth: string;
  plateThickness: string;
  
  // 開管共鳴用
  soundSpeed: string;
  tubeLength: string;
}

interface SPLState {
  airDensity: string;
  effectiveRadius: string;
  mms: string;
  f0: string;
  re: string;
  micDistance: string;
  inputVoltage: string;
  rms: string;
  bl: string;
  frequency: string;
}

interface CrossoverState {
  wooferImpedance: string;
  tweeterImpedance: string;
  cutoffFrequency: string;
  wooferSPL: string;
  tweeterSPL: string;
}

interface CalculatorStates {
  tsParameters: TSParameterState;
  spl: SPLState;
  crossover: CrossoverState;
}

interface CalculatorStateContextType {
  states: CalculatorStates;
  updateTSParameterState: (state: Partial<TSParameterState>) => void;
  updateSPLState: (state: Partial<SPLState>) => void;
  updateCrossoverState: (state: Partial<CrossoverState>) => void;
}

const defaultTSParameterState: TSParameterState = {
  mms: '',
  kms: '',
  bl: '',
  re: '',
  effectiveRadius: '',
  airDensity: '1.29',
  power: '',
  rms: '',
  
  // 振幅・音圧計算用
  spl: '',
  frequency: '',
  micDistance: '1',
  inputVoltage: '',
  
  // 薄膜パターン用
  volumeResistivity: '',
  lineWidth: '',
  lineThickness: '',
  lineLength: '',
  
  // Xmax計算用
  vcWindingWidth: '',
  plateThickness: '',
  
  // 開管共鳴用
  soundSpeed: '346.1',
  tubeLength: '',
};

const defaultSPLState: SPLState = {
  airDensity: '1.184',
  effectiveRadius: '',
  mms: '',
  f0: '',
  re: '',
  micDistance: '1',
  inputVoltage: '',
  rms: '',
  bl: '',
  frequency: '100',
};

const defaultCrossoverState: CrossoverState = {
  wooferImpedance: '8',
  tweeterImpedance: '8',
  cutoffFrequency: '',
  wooferSPL: '',
  tweeterSPL: '',
};

const CalculatorStateContext = createContext<CalculatorStateContextType | undefined>(undefined);

export function CalculatorStateProvider({ children }: { children: ReactNode }) {
  const [states, setStates] = useState<CalculatorStates>({
    tsParameters: defaultTSParameterState,
    spl: defaultSPLState,
    crossover: defaultCrossoverState,
  });

  const updateTSParameterState = (newState: Partial<TSParameterState>) => {
    setStates((prev) => ({
      ...prev,
      tsParameters: { ...prev.tsParameters, ...newState },
    }));
  };

  const updateSPLState = (newState: Partial<SPLState>) => {
    setStates((prev) => ({
      ...prev,
      spl: { ...prev.spl, ...newState },
    }));
  };

  const updateCrossoverState = (newState: Partial<CrossoverState>) => {
    setStates((prev) => ({
      ...prev,
      crossover: { ...prev.crossover, ...newState },
    }));
  };

  return (
    <CalculatorStateContext.Provider
      value={{
        states,
        updateTSParameterState,
        updateSPLState,
        updateCrossoverState,
      }}
    >
      {children}
    </CalculatorStateContext.Provider>
  );
}

export function useCalculatorState() {
  const context = useContext(CalculatorStateContext);
  if (context === undefined) {
    throw new Error('useCalculatorState must be used within a CalculatorStateProvider');
  }
  return context;
}
