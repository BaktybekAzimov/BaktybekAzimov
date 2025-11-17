import { Link, useLocation } from 'react-router-dom';

const Navigation = ({ mobile = false }) => {
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Главная' },
    { to: '/about', label: 'О компании' },
    {
      label: 'Бренды',
      submenu: [
        { to: '/brands/kelechek', label: 'KELECHEK №27' },
        { to: '/brands/adygene', label: 'ADYGENE' },
        { to: '/brands/gimalai', label: 'GIMALAI' },
        { to: '/brands/lemonads', label: 'ЛИМОНАДЫ' },
      ]
    },
    { to: '/where-to-buy', label: 'Где купить' },
    { to: '/partners', label: 'Партнерам' },
    { to: '/contacts', label: 'Контакты' },
  ];

  const isActive = (path) => location.pathname === path;

  if (mobile) {
    return (
      <nav className="flex flex-col space-y-2 mt-4">
        {navLinks.map((link, index) => (
          link.submenu ? (
            <div key={index}>
              <div className="px-4 py-2 font-semibold text-kelechek-dark text-sm uppercase">
                {link.label}
              </div>
              {link.submenu.map((sublink, subIndex) => (
                <Link
                  key={subIndex}
                  to={sublink.to}
                  className={`block px-6 py-2 font-secondary transition-colors ${
                    isActive(sublink.to)
                      ? 'text-kelechek-primary bg-kelechek-bg'
                      : 'text-kelechek-dark hover:text-kelechek-primary hover:bg-kelechek-bg'
                  }`}
                >
                  {sublink.label}
                </Link>
              ))}
            </div>
          ) : (
            <Link
              key={index}
              to={link.to}
              className={`block px-4 py-2 font-secondary transition-colors ${
                isActive(link.to)
                  ? 'text-kelechek-primary bg-kelechek-bg'
                  : 'text-kelechek-dark hover:text-kelechek-primary hover:bg-kelechek-bg'
              }`}
            >
              {link.label}
            </Link>
          )
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex items-center space-x-8">
      {navLinks.map((link, index) => (
        link.submenu ? (
          <div key={index} className="relative group">
            <button className="font-secondary text-kelechek-dark hover:text-kelechek-primary transition-colors py-2">
              {link.label}
              <svg className="inline-block ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {link.submenu.map((sublink, subIndex) => (
                <Link
                  key={subIndex}
                  to={sublink.to}
                  className={`block px-4 py-3 font-secondary transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    isActive(sublink.to)
                      ? 'text-kelechek-primary bg-kelechek-bg'
                      : 'text-kelechek-dark hover:text-kelechek-primary hover:bg-kelechek-bg'
                  }`}
                >
                  {sublink.label}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <Link
            key={index}
            to={link.to}
            className={`font-secondary transition-colors py-2 ${
              isActive(link.to)
                ? 'text-kelechek-primary border-b-2 border-kelechek-primary'
                : 'text-kelechek-dark hover:text-kelechek-primary'
            }`}
          >
            {link.label}
          </Link>
        )
      ))}
    </nav>
  );
};

export default Navigation;
