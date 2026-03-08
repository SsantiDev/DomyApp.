import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './RightPanel.css';

interface RightPanelProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

export const RightPanel: React.FC<RightPanelProps> = ({ isOpen, onClose, title, subtitle, icon, children }) => {
    // Cerrar con la tecla Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Bloquear scroll del body
        }
        return () => {
            window.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    return (
        <>
            {/* Overlay */}
            <div
                className={`panel-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            />

            {/* Panel */}
            <aside className={`right-panel ${isOpen ? 'open' : ''}`}>
                <div className="panel-header">
                    <div className="panel-header-content">
                        {icon && <div className="panel-header-icon">{icon}</div>}
                        <div className="panel-title-group">
                            <h2 className="panel-title">{title}</h2>
                            {subtitle && <p className="panel-subtitle">{subtitle}</p>}
                        </div>
                    </div>
                    <button className="panel-close-btn" onClick={onClose} title="Cerrar">
                        <X size={20} />
                    </button>
                </div>

                <div className="panel-content">
                    {children}
                </div>
            </aside>
        </>
    );
};
