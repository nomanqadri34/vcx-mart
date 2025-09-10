import React from 'react';

// Wrapper component to fix SVG attribute issues
const FixedIcon = ({ Icon, className = "h-5 w-5", ...props }) => {
  return (
    <Icon 
      className={className}
      width={undefined}
      height={undefined}
      {...props}
    />
  );
};

export default FixedIcon;