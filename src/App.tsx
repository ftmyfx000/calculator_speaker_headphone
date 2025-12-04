import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout';
import { TSParameterCalculator, SPLCalculator, CrossoverNetworkCalculator } from './components/calculators';
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
            <Route path="/" element={<Navigate to="/ts-parameters" replace />} />
            <Route path="/ts-parameters" element={<TSParameterCalculator />} />
            <Route path="/spl" element={<SPLCalculator />} />
            <Route path="/crossover" element={<CrossoverNetworkCalculator />} />
          </Routes>
        </Layout>
      </Router>
    </CalculatorStateProvider>
  );
}

export default App;
