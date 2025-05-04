import React from 'react';

const Alert = ({ type, message }) => {
  const alertStyles = {
      success:'bg-green-100 text-green-700',
      error:'bg-red-100 text-red-700',
      info: 'bg-blue-100 text-blue-700 border-blue-400'
  };

  return (
    <div className={`p-4 rounded-lg ${getAlertClass()}`} role="alert">
      <p className="text-sm font-medium">{message}</p>
      <pre className="whitespace-pre-wrap font-sans">
        {message}
      </pre>
    </div>
  );
};

export default Alert;
