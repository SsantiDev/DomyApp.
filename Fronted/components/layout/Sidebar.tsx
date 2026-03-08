import React, { useEffect } from 'react';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import { Home, Users, Settings, LogOut, BarChart3, Package, ChevronRight, ChevronLeft, Bell, Sun, Moon } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
    className?: string;
    onLogoutStart?: () => void;
    onCollapse?: (collapsed: boolean) => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    notificationCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '', onLogoutStart, onCollapse, theme, toggleTheme, notificationCount }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLoggingOut, setIsLoggingOut] = React.useState(false);
    const [isCollapsed, setIsCollapsed] = React.useState(() => {
        // Recuperar estado del localStorage, por defecto colapsado
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved !== null ? saved === 'true' : true; // Por defecto true (colapsado)
    });

    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    const userEmail = userSession.user || 'Usuario';
    const userType = userSession.tipo || '';
    const token = searchParams.get('token') || userSession.token || '';

    // Guardar estado en localStorage cuando cambia
    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', String(isCollapsed));
    }, [isCollapsed]);

    const handleToggle = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        if (onCollapse) onCollapse(newState);
    };

    const handleLogout = () => {
        setIsLoggingOut(true);
        if (onLogoutStart) {
            onLogoutStart();
        }

        // Esperar a que termine la animación antes de navegar
        setTimeout(() => {
            localStorage.removeItem('userSession');
            navigate('/', { replace: true });
        }, 600); // Duración de la animación de salida
    };

    const [openMenus, setOpenMenus] = React.useState<string[]>([]);

    // Función para alternar submenús
    const toggleSubmenu = (label: string) => {
        if (!isCollapsed) {
            setOpenMenus(prev =>
                prev.includes(label)
                    ? prev.filter(item => item !== label)
                    : [...prev, label]
            );
        } else {
            // Si está colapsado, abrir el sidebar al intentar abrir un submenú
            setIsCollapsed(false);
            setOpenMenus([label]);
            if (onCollapse) onCollapse(false);
        }
    };

    const location = useLocation();

    // Definición de ítems con submenús
    const menuItems = [
        {
            icon: Home,
            label: 'Inicio',
            href: `/home?token=${token}`,
            active: location.pathname === '/home'
        },
        {
            icon: BarChart3,
            label: 'Dashboard',
            // href eliminado para ítems padres
            active: location.pathname.startsWith('/dashboard'),
            subItems: [
                { label: 'Analíticas', href: '/dashboard/analiticas' },
                { label: 'Reportes', href: '/dashboard/reportes' }
            ]
        },
        {
            icon: Package,
            label: 'Productos',
            active: location.pathname.startsWith('/productos'),
            subItems: [
                { label: 'Inventario', href: '/productos/inventario' },
                { label: 'Categorías', href: '/productos/categorias' },
                { label: 'Catálogo', href: '/productos/catalogo' }
            ]
        },
        {
            icon: Users,
            label: 'Usuarios',
            href: `/usuarios?token=${token}`,
            active: location.pathname === '/usuarios'
        },
        {
            icon: Settings,
            label: 'Configuración',
            active: location.pathname.startsWith('/configuracion'),
            subItems: [
                { label: 'General', href: '/configuracion/general' },
                { label: 'Seguridad', href: '/configuracion/seguridad' }
            ]
        },
    ];

    return (
        <aside className={`sidebar ${className} ${isLoggingOut ? 'logging-out' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <button
                    className="sidebar-toggle"
                    onClick={handleToggle}
                    title={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
                    aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>

                <div className="sidebar-logo">
                    <img
                        src="/src/assets/logo.png"
                        alt="VIBRA Logo"
                        className="logo-icon"
                    />
                    {!isCollapsed && <h1 className="logo-text">Jolifoods SAS</h1>}
                </div>
            </div>

            <nav className="sidebar-nav">
                <ul className="sidebar-menu">
                    {menuItems.map((item) => (
                        <li key={item.label} className={`sidebar-item-container ${item.subItems && openMenus.includes(item.label) ? 'expanded' : ''}`}>
                            {item.subItems ? (
                                <>
                                    <div
                                        className={`sidebar-link parent ${item.active ? 'active' : ''}`}
                                        onClick={() => toggleSubmenu(item.label)}
                                        title={isCollapsed ? item.label : ''}
                                    >
                                        <div className="sidebar-link-content">
                                            <item.icon size={20} />
                                            {!isCollapsed && <span>{item.label}</span>}
                                            {isCollapsed && (
                                                <div className="collapsed-submenu-indicator">
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                            )}
                                        </div>
                                        {!isCollapsed && (
                                            <ChevronRight
                                                size={16}
                                                className={`submenu-arrow ${openMenus.includes(item.label) ? 'open' : ''}`}
                                            />
                                        )}
                                    </div>
                                    <div className="sidebar-submenu">
                                        {item.subItems.map((subItem) => (
                                            <Link
                                                key={subItem.label}
                                                to={`${subItem.href}?token=${token}`}
                                                className="sidebar-sublink"
                                            >
                                                <span className="sublink-dot"></span>
                                                <span>{subItem.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <Link
                                    to={item.href!}
                                    className={`sidebar-link ${item.active ? 'active' : ''}`}
                                    title={isCollapsed ? item.label : ''}
                                >
                                    <div className="sidebar-link-content">
                                        <item.icon size={20} />
                                        {!isCollapsed && <span>{item.label}</span>}
                                    </div>
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                {isCollapsed ? (
                    <div className="sidebar-footer-collapsed">
                        <button
                            onClick={handleLogout}
                            className="sidebar-logout"
                            title="Cerrar sesión"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                ) : (
                    <div className="sidebar-footer-expanded">
                        <button className="sidebar-theme-toggle" onClick={toggleTheme}>
                            <div className="theme-toggle-content">
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                                <span>Modo {theme === 'dark' ? 'Claro' : 'Oscuro'}</span>
                            </div>
                            <div className={`theme-pill ${theme}`}>
                                {theme === 'dark' ? 'Noche' : 'Día'}
                            </div>
                        </button>

                        <div className="sidebar-user-section">
                            <Link
                                to={`/perfil?token=${token}`}
                                className="sidebar-user-link"
                                title="Ver mi perfil"
                            >
                                <div className="sidebar-user">
                                    <div className="user-avatar-wrapper">
                                        <div className="user-avatar">
                                            {userSession.avatar ? (
                                                <img src={userSession.avatar} alt="Profile" className="sidebar-avatar-img" />
                                            ) : (
                                                userEmail.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div className="status-indicator"></div>
                                    </div>
                                    <div className="user-info">
                                        <p className="user-name">{userEmail.split('@')[0]}</p>
                                        <p className="user-role">{userType === 'sa' ? 'Super Admin' : 'Usuario'}</p>
                                    </div>
                                </div>
                            </Link>

                            <div className="sidebar-actions">
                                <button className="sidebar-footer-btn" title="Notificaciones">
                                    <Bell size={20} />
                                    {notificationCount > 0 ? (
                                        <span className="sidebar-notif-badge count">{notificationCount}</span>
                                    ) : (
                                        <span className="sidebar-notif-badge dot"></span>
                                    )}
                                </button>
                                <button onClick={handleLogout} className="sidebar-logout" title="Cerrar sesión">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};
