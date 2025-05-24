import React from 'react';
import clsx from 'clsx';

export const Button = ({ children, onClick, className, variant = 'default', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-lg text-sm font-semibold transition duration-300';
  const variants = {
    default: 'bg-yellow-500 text-black hover:bg-yellow-400',
    outline: 'border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black',
  };

  return (
    <button
      onClick={onClick}
      className={clsx(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};
