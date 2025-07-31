import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    containerClassName?: string;
    datalistId?: string;
    datalistOptions?: string[];
}

export const Input: React.FC<InputProps> = ({ label, id, containerClassName = '', datalistId, datalistOptions, ...props }) => {
    return (
        <div className={containerClassName}>
            <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
            <input
                id={id}
                list={datalistId}
                {...props}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
            />
            {datalistId && datalistOptions && datalistOptions.length > 0 && (
                <datalist id={datalistId}>
                    {datalistOptions.map((option) => (
                        <option key={option} value={option} />
                    ))}
                </datalist>
            )}
        </div>
    );
};