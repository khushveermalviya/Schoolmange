import React from 'react';

const CustomAlert = ({ className, children }) => {
  return (
    <div className={`p-4 border rounded-lg ${className}`}>
      {children}
    </div>
  );
};

const CustomAlertTitle = ({ children }) => {
  return (
    <h4 className="font-semibold">{children}</h4>
  );
};

const CustomAlertDescription = ({ children }) => {
  return (
    <p className="mt-2">{children}</p>
  );
};

export { CustomAlert, CustomAlertTitle, CustomAlertDescription };