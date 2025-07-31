
import React from 'react';

interface RadioOption {
    value: string;
    label: string;
}

interface RadioGroupProps {
    label: string;
    name: string;
    options: RadioOption[];
    selectedValue: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    containerClassName?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ label, name, options, selectedValue, onChange, containerClassName = '' }) => {
    return (
        <div className={containerClassName}>
            <span className="block text-sm font-medium text-slate-600 mb-1">{label}</span>
            <div className="flex items-center space-s-4 mt-2">
                {options.map(option => (
                    <div key={option.value} className="flex items-center">
                        <input
                            id={`${name}-${option.value}`}
                            name={name}
                            type="radio"
                            value={option.value}
                            checked={selectedValue === option.value}
                            onChange={onChange}
                            className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                        />
                        <label htmlFor={`${name}-${option.value}`} className="ms-2 block text-sm text-slate-700">{option.label}</label>
                    </div>
                ))}
            </div>
        </div>
    );
};
