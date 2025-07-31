import React from 'react';
import { ChevronRightIcon, ChevronLeftIcon } from './Icons';

interface FormNavigationProps {
    onNext: () => void;
    onPrev: () => void;
    isFirst: boolean;
    isLast: boolean;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({ onNext, onPrev, isFirst, isLast }) => {
    return (
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
            <button
                onClick={onPrev}
                disabled={isFirst}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 font-semibold rounded-lg border border-slate-300 shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRightIcon />
                <span>السابق</span>
            </button>
            <button
                onClick={onNext}
                disabled={isLast}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
                <span>التالي</span>
                <ChevronLeftIcon />
            </button>
        </div>
    );
};
