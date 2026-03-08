import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { User, Settings, LogOut, Key, ChevronDown, Bell, Sun, Moon } from 'lucide-react';
import './TopHeader.css';

interface TopHeaderProps {
    onLogoutStart?: () => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    notifications: any[]; // Usar 'any' temporalmente o definir interfaz si fuera necesario
    onDeleteNotification: (id: number) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onLogoutStart, theme, toggleTheme, notifications, onDeleteNotification }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const menuRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLButtonElement>(null);

    // Contar no leídas
    const unreadCount = notifications.filter(n => !n.read).length;

    const filteredNotifications = filter === 'all'
        ? notifications
        : notifications.filter(n => !n.read);

    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    const userEmail = userSession.user || 'Usuario';
    const userName = userEmail.split('@')[0];
    const token = searchParams.get('token') || userSession.token || '';

    // Cerrar menús al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
            // Lógica similar para notificaciones si es un contenedor separado, 
            // pero como está en un botón, lo manejaremos con cuidado o añadiremos un ref al contenedor del dropdown
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        if (onLogoutStart) onLogoutStart();

        // Simular retraso para animación de salida si fuera necesario
        setTimeout(() => {
            localStorage.removeItem('userSession');
            navigate('/', { replace: true });
        }, 500);
    };

    return (
        <header className="top-header fade-in">
            <div className="top-header-left">
                {/* Espacio reservado o breadcrumbs en el futuro */}
            </div>

            <div className="top-header-right">
                <div
                    className="notification-container"
                    ref={notifRef as any}
                    onMouseEnter={() => setIsNotifOpen(true)}
                    onMouseLeave={() => setIsNotifOpen(false)}
                >
                    <button
                        className={`icon-notification-btn ${isNotifOpen ? 'active' : ''}`}
                        title="Notificaciones"
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 ? (
                            <span className="notification-badge count">{unreadCount}</span>
                        ) : (
                            <span className="notification-badge dot"></span>
                        )}
                    </button>

                    {isNotifOpen && (
                        <div className="notification-dropdown glass fade-in">
                            <div className="notif-header">
                                <div className="notif-tabs">
                                    <button
                                        className={`notif-tab ${filter === 'all' ? 'active' : ''}`}
                                        onClick={() => setFilter('all')}
                                    >
                                        Todas
                                    </button>
                                    <button
                                        className={`notif-tab ${filter === 'unread' ? 'active' : ''}`}
                                        onClick={() => setFilter('unread')}
                                    >
                                        Nuevas
                                    </button>
                                </div>
                            </div>
                            <div className="notif-list">
                                {filteredNotifications.length > 0 ? (
                                    filteredNotifications.map(notif => (
                                        <div key={notif.id} className={`notif-item ${!notif.read ? 'unread' : ''}`}>
                                            <div className="notif-icon">
                                                <Bell size={16} />
                                                {!notif.read && <span className="unread-dot"></span>}
                                            </div>
                                            <div className="notif-content">
                                                <p className="notif-title">{notif.title}</p>
                                                <p className="notif-message">{notif.message}</p>
                                                <span className="notif-time">{notif.time}</span>
                                            </div>
                                            <button
                                                className="delete-notif-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteNotification(notif.id);
                                                }}
                                                title="Borrar"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="notif-empty">
                                        {filter === 'unread' ? 'No tienes notificaciones nuevas' : 'No tienes notificaciones'}
                                    </div>
                                )}
                            </div>
                            <div className="notif-footer">
                                <button className="view-all-btn">Ver todas</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="user-profile-menu" ref={menuRef}>
                    <button
                        className={`profile-trigger ${isMenuOpen ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <div className="profile-trigger-avatar">
                            {userSession.avatar ? (
                                <img src={userSession.avatar} alt="Profile" className="avatar-img-fit" />
                            ) : (
                                userName.charAt(0).toUpperCase()
                            )}
                            <div className="status-indicator-dot online"></div>
                        </div>
                        <ChevronDown size={16} className={`chevron-icon ${isMenuOpen ? 'rotate' : ''}`} />
                    </button>

                    {isMenuOpen && (
                        <div className="profile-dropdown-menu glass fade-in">
                            <div className="dropdown-header">
                                <div className="dropdown-avatar">
                                    {userSession.avatar ? (
                                        <img src={userSession.avatar} alt="Profile" className="avatar-img-fit" />
                                    ) : (
                                        userName.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="dropdown-user-info">
                                    <p className="dropdown-user-name">{userName}</p>
                                    <p className="dropdown-user-email">{userEmail}</p>
                                </div>
                            </div>

                            <div className="dropdown-divider"></div>

                            <Link to={`/perfil?token=${token}`} className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                                <User size={18} />
                                <span>Mi Perfil</span>
                            </Link>

                            <button className="dropdown-item">
                                <Key size={18} />
                                <span>Cambiar Contraseña</span>
                            </button>

                            <button className="dropdown-item">
                                <Settings size={18} />
                                <span>Ajustes</span>
                            </button>

                            <div className="dropdown-divider"></div>

                            <button className="dropdown-item theme-toggle-item" onClick={toggleTheme}>
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                                <span>Modo {theme === 'dark' ? 'Claro' : 'Oscuro'}</span>
                                <div className={`theme-status-pill ${theme}`}>
                                    {theme === 'dark' ? 'Noche' : 'Día'}
                                </div>
                            </button>

                            <div className="dropdown-divider"></div>

                            <button className="dropdown-item logout" onClick={handleLogout}>
                                <LogOut size={18} />
                                <span>Cerrar Sesión</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
