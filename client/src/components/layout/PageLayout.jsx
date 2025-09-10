import React from "react";

const PageLayout = ({ children, className = "", fullWidth = false }) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div
        className={
          fullWidth ? "w-full" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        }
      >
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
