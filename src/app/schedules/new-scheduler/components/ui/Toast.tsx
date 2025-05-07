"use client";

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  onClose, 
  duration = 3000 
}) => {
  // Auto-close toast after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  // Define background colors based on type
  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
  };
  
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center ${bgColors[type]} text-white px-4 py-2 rounded-md shadow-lg max-w-md`}>
      <span className="mr-2">{message}</span>
      <button 
        onClick={onClose}
        className="ml-auto hover:bg-white hover:bg-opacity-20 rounded-full p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;