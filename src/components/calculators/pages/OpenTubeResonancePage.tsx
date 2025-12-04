import React from 'react';
import { OpenTubeResonanceSection } from '../sections';

export const OpenTubeResonancePage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6" role="main">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        開管の気中共鳴周波数計算
      </h1>
      <OpenTubeResonanceSection />
    </div>
  );
};
