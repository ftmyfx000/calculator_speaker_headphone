import React from 'react';
import { SPLCalculationSection } from '../sections';

export const SPLCalculationPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6" role="main">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        音圧の計算
      </h1>
      <SPLCalculationSection />
    </div>
  );
};
