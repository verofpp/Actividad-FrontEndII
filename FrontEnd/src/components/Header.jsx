import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const {
    activeItem,
    isMenuOpen,
    menuItems,
    toggleMenu,
    closeMenu,
    handleMenuItemClick,
  } = useAuth();

  const navigate = useNavigate();
  
  // Encuentra el item activo o usa el primero por defecto
  const activeMenuItem = menuItems.find((item) => item.name === activeItem) || menuItems[0];

  const stylesButton = (itemName) =>
    `flex items-center cursor-pointer gap-2 px-4 py-3 font-black text-2xl hover:bg-blue-800 rounded transition-colors duration-200 ${
      activeItem === itemName ? "text-orange-300 bg-blue-800" : "text-orange-300"
    }`;

  const handleNavigation = (itemName, path) => {
    handleMenuItemClick(itemName);
    navigate(`/${path}`);
    closeMenu();
  };

  return (
    <>
      <div className="flex w-full h-16 bg-blue-900 relative">
        {/* Botón Menú */}
        <div className="flex items-center h-full w-16 justify-center">
          <button 
            onClick={toggleMenu} 
            className="p-2 cursor-pointer focus:outline-none"
            aria-label="Toggle menu"
          >
            <img src="/icons/menu_icon.svg" alt="Ícono de menú" />
          </button>
        </div>

        {/* Header dinámico */}
        <div className="flex justify-center items-center w-full">
          <img
            src={activeMenuItem.icon}
            alt={activeMenuItem.alt}
            className="flex h-10"
          />
          <h1 className="text-3xl text-orange-300 font-bold ml-2">
            {activeItem}
          </h1>
        </div>

        {/* Menú */}
        <div
          className={`fixed top-0 left-0 h-full min-w-64 w-fit bg-blue-900 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-hidden={!isMenuOpen}
        >
          {/* Encabezado del menú */}
          <div className="flex justify-center items-center w-full h-20">
            <div className="flex justify-center items-center w-full text-orange-300 text-3xl font-black">
              <span className="flex font-black">Menú</span>
            </div>
            <div className="flex justify-end p-4 w-fit">
              <button
                onClick={closeMenu}
                className="text-orange-300 w-10 hover:text-blue-200 focus:outline-none cursor-pointer"
                aria-label="Close menu"
              >
                <img 
                  src="/icons/close_small_icon.svg" 
                  alt="Cerrar menú" 
                  className="flex h-8 hover:h-10 transform transition-transform duration-300 ease-in-out"
                />
              </button>
            </div>
          </div>

          {/* Items del menú */}
          <nav>
            <div className="px-4">
              <div className="py-2">
                {menuItems.map((item, i) => (
                  <div
                    key={i}
                    className={stylesButton(item.name)}
                    onClick={() => handleNavigation(item.name, item.path)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleNavigation(item.name, item.path)}
                  >
                    <img src={item.icon} alt={item.alt} className="flex h-12" />
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          </nav>
        </div>

        {/* Overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/20 bg-opacity-10 z-40"
            onClick={closeMenu}
            role="presentation"
          />
        )}
      </div>
    </>
  );
};

export default Header;