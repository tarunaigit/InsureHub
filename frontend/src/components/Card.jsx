import React from 'react';

export function Card({ children, className = '', hover = true }) {
  return (
    <div className={`bg-white rounded-xl shadow-md border border-gray-100 ${hover ? 'hover:shadow-lg transition-shadow duration-300' : ''} ${className}`}>
      {children}
    </div>
  );
}