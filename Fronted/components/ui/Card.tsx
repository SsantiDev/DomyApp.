import React from 'react';
import type { HTMLAttributes } from 'react';
import './Card.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'glass' | 'solid';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'glass',
    padding = 'md',
    className = '',
    ...props
}) => {
    return (
        <div
            className={`card card-${variant} card-padding-${padding} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
