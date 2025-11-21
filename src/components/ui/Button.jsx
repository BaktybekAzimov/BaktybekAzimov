import clsx from 'clsx';
import PropTypes from 'prop-types';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  onClick,
  className = '',
  disabled = false,
  ...props
}) => {
  const baseStyles = 'font-secondary font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-kelechek-primary text-white hover:bg-opacity-90 hover:shadow-lg',
    secondary: 'bg-white text-kelechek-primary hover:bg-opacity-90 hover:shadow-lg border-2 border-kelechek-primary',
    outline: 'border-2 border-white text-white hover:bg-white hover:text-kelechek-primary',
    ghost: 'text-kelechek-primary hover:bg-kelechek-bg',
    dark: 'bg-kelechek-dark text-white hover:bg-opacity-90 hover:shadow-lg',
  };

  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'dark']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool
};

export default Button;
