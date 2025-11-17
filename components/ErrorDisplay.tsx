import React from 'react';

interface ErrorDisplayProps {
  message: string | null;
  onDismiss: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onDismiss }) => {
  if (!message) {
    return null;
  }

  return (
    <div 
      className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative my-2 shadow-md" 
      role="alert"
    >
      <div className="flex items-start">
        <span className="material-icons-round text-xl mr-3 mt-0.5 flex-shrink-0 text-red-500 dark:text-red-400">error_outline</span>
        <span className="block sm:inline pr-6 font-medium text-sm">{message}</span>
      </div>
      <button 
        onClick={onDismiss} 
        className="absolute top-0 bottom-0 right-0 px-4 py-3 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-200"
        aria-label="Dismiss error message"
      >
        <span className="text-xl font-bold">&times;</span>
      </button>
    </div>
  );
};

export default ErrorDisplay;