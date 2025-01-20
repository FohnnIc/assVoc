import React from 'react';

interface WaveAnimationProps {
  isListening: boolean;
}

export const WaveAnimation: React.FC<WaveAnimationProps> = ({ isListening }) => {
  return (
    <div className={`flex items-center justify-center gap-1 h-16 ${!isListening && 'opacity-50'}`}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-blue-500 rounded-full transform transition-all duration-150 ${
            isListening ? 'animate-wave' : 'h-2'
          }`}
          style={{
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
};