import React, { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, rightIcon, className = '', ...props }, ref) => {
        return (
            <div className="input-wrapper">
                {label && (
                    <label className="input-label">
                        {label}
                        {props.required && <span className="input-required">*</span>}
                    </label>
                )}
                <div className="input-container">
                    <input
                        ref={ref}
                        className={`input-field ${error ? 'input-error' : ''} ${icon ? 'input-with-icon-left' : ''} ${rightIcon ? 'input-with-icon-right' : ''} ${className}`}
                        {...props}
                    />
                    {icon && <div className="input-icon input-icon-left">{icon}</div>}
                    {rightIcon && <div className="input-icon input-icon-right">{rightIcon}</div>}
                </div>
                {error && <span className="input-error-message">{error}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';
