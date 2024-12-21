// src/components/Layout.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

export const Layout = ({ children, title, showBack }: LayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex items-center px-4 py-3 border-b border-gray-200">
        {showBack && (
          <button 
            onClick={() => navigate(-1)}
            className="text-2xl text-gray-600 bg-transparent border-none px-4 py-2 cursor-pointer"
          >
            ←
          </button>
        )}
        <h1 className="flex-1 text-center text-lg font-medium m-0">
          {title}
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="flex justify-around p-3 border-t border-gray-200 bg-white">
        <button 
          onClick={() => navigate('/calender')}
          className="flex flex-col items-center px-6 py-2 text-sm text-gray-600"
        >
          <span>캘린더</span>
        </button>
        <button 
          onClick={() => navigate('/plan')}
          className="flex flex-col items-center px-6 py-2 text-sm text-gray-600"
        >
          <span>계획</span>
        </button>
      </nav>
    </div>
  );
};