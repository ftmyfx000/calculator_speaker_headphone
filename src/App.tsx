import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout';
import { CrossoverNetworkCalculator } from './components/calculators';
import {
  F0CalculationPage,
  AirLoadMassPage,
  InputVoltagePage,
  VasCalculationPage,
  QesCalculationPage,
  QmsCalculationPage,
  QtsCalculationPage,
  AmplitudeCalculationPage,
  SPLCalculationPage,
  FrequencyResponsePage,
  ThinFilmResistancePage,
  XmaxCalculationPage,
  OpenTubeResonancePage,
} from './components/calculators/pages';
import { CalculatorStateProvider } from './contexts/CalculatorStateContext';

function App() {
  return (
    <CalculatorStateProvider>
      <Router>
        {/* Skip to main content link for keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg"
        >
          メインコンテンツへスキップ
        </a>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/f0" replace />} />
            <Route path="/ts-parameters" element={<Navigate to="/f0" replace />} />
            <Route path="/f0" element={<F0CalculationPage />} />
            <Route path="/air-load-mass" element={<AirLoadMassPage />} />
            <Route path="/input-voltage" element={<InputVoltagePage />} />
            <Route path="/vas" element={<VasCalculationPage />} />
            <Route path="/qes" element={<QesCalculationPage />} />
            <Route path="/qms" element={<QmsCalculationPage />} />
            <Route path="/qts" element={<QtsCalculationPage />} />
            <Route path="/amplitude" element={<AmplitudeCalculationPage />} />
            <Route path="/spl" element={<SPLCalculationPage />} />
            <Route path="/frequency-response" element={<FrequencyResponsePage />} />
            <Route path="/thin-film" element={<ThinFilmResistancePage />} />
            <Route path="/xmax" element={<XmaxCalculationPage />} />
            <Route path="/open-tube" element={<OpenTubeResonancePage />} />
            <Route path="/crossover" element={<CrossoverNetworkCalculator />} />
          </Routes>
        </Layout>
      </Router>
    </CalculatorStateProvider>
  );
}

export default App;
