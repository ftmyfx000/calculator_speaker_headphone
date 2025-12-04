import React from 'react';
import { AmplitudeCalculationSection } from '../sections';

export const AmplitudeCalculationPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6" role="main">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        振幅の計算
      </h1>
      <AmplitudeCalculationSection />
    </div>
  );
};
