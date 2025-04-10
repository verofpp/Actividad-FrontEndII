import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const authContext = createContext();

const AuthProvider = ({ children }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    {
      name: "Fincas",
      icon: "/icons/finca_icon.png",
      path: "fincas",
      alt: "fincas",
    },
    {
      name: "Lotes",
      icon: "/icons/lote_icon.png",
      path: "lotes",
      alt: "lotes",
    },
    {
      name: "Tipos de Café",
      icon: "icons/tiposcafe_icon.svg",
      path: "tipos_de_cafe",
      alt: "tipos de cafe",
    },
    {
      name: "Productos",
      icon: "/icons/producto_icon.png",
      path: "productos",
      alt: "productos",
    },
    {
      name: "Inventario",
      icon: "/icons/inventario_icon.png",
      path: "inventario",
      alt: "inventario",
    },
    {
      name: "Ventas",
      icon: "/icons/venta.icon.png",
      path: "ventas",
      alt: "ventas",
    },
    {
      name: "Compradores",
      icon: "/icons/comprador_icon.png",
      path: "compradores",
      alt: "compradores",
    },
  ];

  // Estado inicial recuperando del localStorage o usando "Dashboard" por defecto
  const [activeItem, setActiveItem] = useState(() => {
    const savedItem = localStorage.getItem('activeMenuItem');
    // Verificamos que el item guardado exista en el menú
    const isValidItem = menuItems.some(item => item.name === savedItem);
    return isValidItem ? savedItem : "Dashboard";
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleMenuItemClick = (itemName) => {
    setActiveItem(itemName);
    localStorage.setItem('activeMenuItem', itemName);
    closeMenu();
  };

  // Sincronización entre pestañas
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'activeMenuItem') {
        setActiveItem(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sincronización con la ruta actual
  useEffect(() => {
    // Eliminamos el slash inicial y normalizamos
    const currentPath = location.pathname.substring(1).toLowerCase();
    
    // Buscamos coincidencia exacta o parcial
    const currentItem = menuItems.find(item => 
      item.path.toLowerCase() === currentPath ||
      currentPath.startsWith(item.path.toLowerCase())
    );

    if (currentItem) {
      setActiveItem(currentItem.name);
      localStorage.setItem('activeMenuItem', currentItem.name);
    }
  }, [location.pathname]);

  const value = {
    activeItem,
    isMenuOpen,
    menuItems,
    toggleMenu,
    closeMenu,
    handleMenuItemClick,
  };

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) {
    throw new Error("useAuth debe ser usado en conjunto con AuthProvider");
  }
  return context;
};

export default AuthProvider;