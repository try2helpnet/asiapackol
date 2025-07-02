
import React, { useEffect, useState } from 'react';
import { Icon } from './icons/Icon';

interface ToastProps {
  message: string;
  duration?: number;
  onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, duration = 3000, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300); // Wait for fade out transition
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div
      className={`fixed bottom-5 right-5 flex items-center w-full max-w-xs p-4 text-gray-100 bg-gray-700 rounded-lg shadow-lg ring-1 ring-white/10 transition-all duration-300 z-50 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-cyan-400 bg-cyan-900/50 rounded-lg">
        <Icon name="info" className="w-5 h-5"/>
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-gray-700 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 p-1.5 inline-flex h-8 w-8"
        aria-label="Close"
        onClick={onDismiss}
      >
        <span className="sr-only">Close</span>
        <Icon name="close" className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toast;
