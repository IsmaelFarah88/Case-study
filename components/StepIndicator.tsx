import React from 'react';
import { CaseSection, SectionKey } from '../types';
import { CheckCircleIcon } from './Icons';

interface StepIndicatorProps {
    sections: CaseSection[];
    activeSectionId: string;
    onSectionClick: (section: CaseSection) => void;
    completionStatus: Record<SectionKey, boolean>;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ sections, activeSectionId, onSectionClick, completionStatus }) => {
    return (
        <nav className="w-full" aria-label="قائمة أقسام الدراسة">
            <ul className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
                {sections.map((section, index) => {
                    const isActive = activeSectionId === section.id;
                    const isComplete = completionStatus[section.id];
                    return (
                        <li key={section.id} className="flex-shrink-0 md:flex-shrink-1 w-full">
                            <button
                                onClick={() => onSectionClick(section)}
                                className={`w-full flex items-center gap-4 p-3 rounded-lg text-start transition-colors duration-200 group ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                                }`}
                                aria-current={isActive ? 'step' : undefined}
                            >
                                <div className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg transition-colors duration-200 ${isActive ? 'bg-white/20' : 'bg-slate-200 group-hover:bg-slate-300'}`}>
                                    {isComplete && !isActive ? (
                                        <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                     ) : (
                                        React.cloneElement(section.icon, { className: 'h-5 w-5' })
                                     )}
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-400 -mb-1">{`القسم ${index + 1}`}</p>
                                    <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-700 group-hover:text-slate-900'}`}>{section.title}</span>
                                </div>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};