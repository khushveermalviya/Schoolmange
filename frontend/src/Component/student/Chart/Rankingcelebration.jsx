import React, { useState, useEffect } from 'react';
import { Trophy, Star } from 'lucide-react';

const RankingCelebration = ({ studentRank, studentName }) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (studentRank === 1 && !showCelebration) {
      setShowCelebration(true);
      createParticles();
    }
  }, [studentRank]);

  const createParticles = () => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][Math.floor(Math.random() * 5)]
    }));
    setParticles(newParticles);
  };

  if (!showCelebration || studentRank !== 1) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="absolute inset-0 bg-black bg-opacity-30" />
      
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            animation: 'fall 2s ease-out forwards'
          }}
        />
      ))}

      <div className="relative bg-white rounded-lg p-8 text-center shadow-2xl animate-bounce">
        <div className="flex justify-center mb-4">
          <Trophy className="w-16 h-16 text-yellow-400" />
        </div>
        
        <h2 className="text-3xl font-bold mb-2 text-gray-800">
          Congratulations!
        </h2>
        
        <p className="text-xl text-gray-600 mb-4">
          {studentName}, you're #1 in your class!
        </p>
        
        <div className="flex justify-center space-x-4">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <Star className="w-8 h-8 text-blue-500" />
          <Trophy className="w-8 h-8 text-yellow-500" />
        </div>
      </div>
    </div>
  );
};

export default RankingCelebration;