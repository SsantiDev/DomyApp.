import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import './MainLayout.css';

export const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved !== null ? saved === 'true' : true;
    });
    const [theme, setTheme] = useState(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'dark');

    const handleLogoutStart = () => {
        setIsLoggingOut(true);
    };

    // Aplicar tema al cambiar
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    useEffect(() => {
        // Verificar sesión en localStorage
        const userSession = localStorage.getItem('userSession');
        const urlToken = searchParams.get('token');

        if (!userSession) {
            navigate('/', { replace: true });
            return;
        }

        try {
            const parsedData = JSON.parse(userSession);
            if (!parsedData.isAuthenticated) {
                navigate('/', { replace: true });
                return;
            }

            // Si hay token en URL, verificar que coincida con el guardado
            if (urlToken && urlToken !== parsedData.token) {
                console.warn('Token en URL no coincide con sesión');
                localStorage.removeItem('userSession');
                navigate('/', { replace: true });
                return;
            }
        } catch (error) {
            console.error('Error al verificar sesión:', error);
            localStorage.removeItem('userSession');
            navigate('/', { replace: true });
        }
    }, [navigate, searchParams]);

    // Mock Notificaciones
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Nuevo pedido', message: 'El pedido #1234 ha sido creado.', time: 'Hace 5 min', read: false },
        { id: 2, title: 'Actualización de sistema', message: 'Mantenimiento programado para hoy.', time: 'Hace 1 hora', read: false },
        { id: 3, title: 'Bienvenida', message: 'Gracias por unirte a Jolifoods SAS.', time: 'Hace 1 día', read: true }
    ]);

    const handleDeleteNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className={`main-layout ${isLoggingOut ? 'logging-out' : ''}`}>
            <Sidebar
                onLogoutStart={handleLogoutStart}
                onCollapse={setIsSidebarCollapsed}
                theme={theme}
                toggleTheme={toggleTheme}
                notificationCount={unreadCount}
            />

            <main className={`main-container ${isLoggingOut ? 'logging-out' : ''}`}>
                {isSidebarCollapsed && (
                    <TopHeader
                        onLogoutStart={handleLogoutStart}
                        theme={theme}
                        toggleTheme={toggleTheme}
                        notifications={notifications}
                        onDeleteNotification={handleDeleteNotification}
                    />
                )}
                <div className="main-content-wrapper">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
