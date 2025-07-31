import React from 'react';
import { CheckIcon } from './Icons';

interface SaveStatusIndicatorProps {
    status: 'idle' | 'saved';
}

export const SaveStatusIndicator: React.FC<SaveStatusIndicatorProps> = ({ status }) => {
    return (
        <div 
            className={`transition-all duration-300 ease-in-out transform ${status === 'saved' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
            aria-live="polite"
            aria-atomic="true"
        >
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <CheckIcon className="h-4 w-4" />
                <span>تم حفظ التغييرات</span>
            </div>
        </div>
    );
};
