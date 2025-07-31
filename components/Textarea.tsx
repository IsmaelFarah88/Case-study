import React, { useState, useRef, useEffect } from 'react';
import { ClipboardListIcon } from './Icons';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    containerClassName?: string;
    previousEntries?: string[];
    onValueSelect?: (value: string) => void;
}

export const Textarea: React.FC<TextareaProps> = ({ label, id, containerClassName = 'md:col-span-2 lg:col-span-3', previousEntries, onValueSelect, ...props }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);


    const handleSelect = (value: string) => {
        if (onValueSelect) {
            onValueSelect(value);
        }
        setShowSuggestions(false);
    };

    return (
        <div className={`${containerClassName} relative`} ref={wrapperRef}>
            <div className="flex justify-between items-center mb-1">
                <label htmlFor={id} className="block text-sm font-medium text-slate-600">{label}</label>
                {previousEntries && previousEntries.length > 0 && onValueSelect && (
                    <button 
                        type="button" 
                        onClick={() => setShowSuggestions(s => !s)}
                        className="flex items-center gap-1.5 px-2 py-1 text-xs text-slate-500 rounded-md hover:bg-slate-100 hover:text-slate-700 transition-colors"
                        aria-haspopup="true"
                        aria-expanded={showSuggestions}
                    >
                        <ClipboardListIcon className="h-4 w-4" />
                        <span>مقترحات</span>
                    </button>
                )}
            </div>
            <textarea
                id={id}
                rows={4}
                {...props}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
            />
            {showSuggestions && (
                <div className="absolute top-full start-0 w-full max-h-48 overflow-y-auto bg-white border border-slate-300 rounded-md shadow-lg z-10 mt-1">
                    <ul role="listbox">
                         {previousEntries?.length === 0 ? (
                            <li className="p-3 text-sm text-slate-500 text-center">لا توجد إدخالات سابقة.</li>
                         ) : previousEntries?.map((entry, index) => (
                            <li 
                                key={index} 
                                onClick={() => handleSelect(entry)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSelect(entry)}
                                className="p-3 text-sm text-slate-700 hover:bg-blue-50 cursor-pointer truncate"
                                title={entry}
                                role="option"
                                aria-selected="false"
                                tabIndex={0}
                            >
                               {entry}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};