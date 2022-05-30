import React from 'react';

interface LoadingButtonProps {
  isLoading?: boolean;
  children: string | JSX.Element | JSX.Element[];
  className?: string,
  isSubmit?: boolean;
}

function CustomButton({
  isLoading = false,
  children = 'Submit',
  isSubmit = false,
  className = 'btn btn-warning btn-lg',
}: LoadingButtonProps) {
  return (
    <button
      type={isSubmit ? 'submit' : 'button'}
      className={className}
      disabled={isLoading}
    >
      {children}
      {' '}
      {isLoading && <span className="spinner-border spinner-border-sm" />}
    </button>
  );
}

CustomButton.defaultProps = {
  isLoading: false,
  className: 'btn btn-warning btn-lg',
  isSubmit: 'Submit',
};

export default CustomButton;
