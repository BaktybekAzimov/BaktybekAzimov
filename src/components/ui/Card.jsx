import PropTypes from 'prop-types';
import clsx from 'clsx';

const Card = ({
  children,
  hover = true,
  padding = 'medium',
  className = '',
  ...props
}) => {
  const baseStyles = 'bg-white rounded-xl transition-all duration-300';

  const hoverStyles = hover && 'hover:shadow-xl hover:-translate-y-1';

  const paddingStyles = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  };

  return (
    <div
      className={clsx(
        baseStyles,
        hoverStyles,
        paddingStyles[padding],
        'shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};


Card.propTypes = {
  children: PropTypes.node.isRequired,
  hover: PropTypes.bool,
  padding: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  className: PropTypes.string
};
export default Card;
