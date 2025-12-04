import React from 'react';
import { ThinFilmResistanceSection } from '../sections';

export const ThinFilmResistancePage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6" role="main">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        薄膜パターンの抵抗値計算
      </h1>
      <ThinFilmResistanceSection />
    </div>
  );
};
