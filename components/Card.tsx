import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition-all duration-300';
  const interactiveClasses = onClick ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : '';
  
  return (
    <div className={`${baseClasses} ${interactiveClasses} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
