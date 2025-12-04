import React from 'react';
import { FrequencyResponseSection } from '../sections';

export const FrequencyResponsePage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6" role="main">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        低音域音圧計算
      </h1>
      <FrequencyResponseSection />
    </div>
  );
};
