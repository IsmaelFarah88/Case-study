
import React from 'react';

interface FormSectionProps {
    title: string;
    children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
    return (
        <div className="p-6 my-6 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="text-xl font-bold text-slate-700 border-b-2 border-blue-200 pb-2 mb-6">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {children}
            </div>
        </div>
    );
};
