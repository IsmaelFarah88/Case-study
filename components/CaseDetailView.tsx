import React, { useState, useCallback, useMemo } from 'react';
import { CaseFile, CaseStudy, CaseSection, SectionKey, BrandingSettings, AutocompleteSuggestions } from '../types';
import { SECTIONS } from '../constants';
import { StepIndicator } from './StepIndicator';
import { GeneralInfoSection } from './sections/GeneralInfoSection';
import { FamilyInfoSection } from './sections/FamilyInfoSection';
import { MedicalHistorySection } from './sections/MedicalHistorySection';
import { DevelopmentalHistorySection } from './sections/DevelopmentalHistorySection';
import { CurrentPerformanceSection } from './sections/CurrentPerformanceSection';
import { FinalReportSection } from './sections/FinalReportSection';
import { EyeIcon, EditIcon } from './Icons';
import { ReportView } from './ReportView';
import { FormNavigation } from './FormNavigation';
import { SaveStatusIndicator } from './SaveStatusIndicator';


interface CaseDetailViewProps {
    caseFile: CaseFile;
    onDataChange: (caseId: string, section: SectionKey, data: Partial<CaseStudy[SectionKey]>) => void;
    onBack: () => void;
    brandingSettings: BrandingSettings;
    saveStatus: 'idle' | 'saved';
    autocompleteSuggestions: AutocompleteSuggestions;
}

export const CaseDetailView: React.FC<CaseDetailViewProps> = ({ caseFile, onDataChange, onBack, brandingSettings, saveStatus, autocompleteSuggestions }) => {
    const [activeSection, setActiveSection] = useState<CaseSection>(SECTIONS[0]);
    const [isReportView, setIsReportView] = useState(false);

    const handleDataChange = useCallback(<K extends SectionKey>(section: K, data: Partial<CaseStudy[K]>) => {
        onDataChange(caseFile.id, section, data);
    }, [caseFile.id, onDataChange]);

    const sectionCompletionStatus = useMemo(() => {
        const isComplete = (obj: object) => {
            if (!obj) return false;
            return Object.values(obj).some(value => {
                if (Array.isArray(value)) return value.length > 0;
                if (typeof value === 'boolean') return value === true;
                return !!value;
            });
        };

        return SECTIONS.reduce((acc, section) => {
            const sectionData = caseFile.study[section.id];
            acc[section.id] = sectionData ? isComplete(sectionData) : false;
            return acc;
        }, {} as Record<SectionKey, boolean>);
    }, [caseFile.study]);

    const activeSectionIndex = useMemo(() => SECTIONS.findIndex(s => s.id === activeSection.id), [activeSection]);

    const handleNextSection = () => {
        if (activeSectionIndex < SECTIONS.length - 1) {
            setActiveSection(SECTIONS[activeSectionIndex + 1]);
        }
    };

    const handlePrevSection = () => {
        if (activeSectionIndex > 0) {
            setActiveSection(SECTIONS[activeSectionIndex - 1]);
        }
    };
    
    const renderSection = () => {
        switch (activeSection.id) {
            case 'generalInfo':
                return <GeneralInfoSection data={caseFile.study.generalInfo} onChange={(d) => handleDataChange('generalInfo', d)} suggestions={autocompleteSuggestions} />;
            case 'familyInfo':
                return <FamilyInfoSection data={caseFile.study.familyInfo} onChange={(d) => handleDataChange('familyInfo', d)} suggestions={autocompleteSuggestions} />;
            case 'medicalHistory':
                return <MedicalHistorySection data={caseFile.study.medicalHistory} onChange={(d) => handleDataChange('medicalHistory', d)} suggestions={autocompleteSuggestions} />;
            case 'developmentalHistory':
                return <DevelopmentalHistorySection data={caseFile.study.developmentalHistory} onChange={(d) => handleDataChange('developmentalHistory', d)} suggestions={autocompleteSuggestions} />;
            case 'currentPerformance':
                return <CurrentPerformanceSection data={caseFile.study.currentPerformance} onChange={(d) => handleDataChange('currentPerformance',d)} suggestions={autocompleteSuggestions} />;
            case 'finalReport':
                return <FinalReportSection 
                          data={caseFile.study.finalReport} 
                          onChange={(d) => handleDataChange('finalReport', d)}
                          />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
            <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 border-b border-slate-200 pb-4">
                 <h2 className="text-2xl font-bold text-slate-800">
                    ملف الطالب: <span className="text-blue-600">{caseFile.study.generalInfo.childFullName || 'طالب جديد'}</span>
                 </h2>
                 <div className="flex items-center gap-3 self-end">
                    <SaveStatusIndicator status={saveStatus} />
                    <button
                        onClick={() => setIsReportView(!isReportView)}
                        className="text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2 font-semibold px-4 py-2 rounded-lg hover:bg-slate-100"
                        aria-label={isReportView ? 'التبديل إلى وضع التعديل' : 'التبديل إلى عرض التقرير'}
                    >
                        {isReportView ? <EditIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                        <span>{isReportView ? 'تعديل' : 'عرض التقرير'}</span>
                    </button>
                    <button
                        onClick={onBack}
                        className="bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-2 font-semibold px-4 py-2 rounded-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <span>العودة</span>
                    </button>
                 </div>
            </header>
            
            {/* --- EDITING VIEW --- */}
            <div className={`${isReportView ? 'hidden' : ''}`}>
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                    <aside className="md:w-64 lg:w-72 flex-shrink-0">
                        <StepIndicator
                            sections={SECTIONS}
                            activeSectionId={activeSection.id}
                            onSectionClick={setActiveSection}
                            completionStatus={sectionCompletionStatus}
                        />
                    </aside>
                    <div className="flex-grow min-w-0">
                        {renderSection()}
                        <FormNavigation
                            onNext={handleNextSection}
                            onPrev={handlePrevSection}
                            isFirst={activeSectionIndex === 0}
                            isLast={activeSectionIndex === SECTIONS.length - 1}
                        />
                    </div>
                </div>
            </div>

            {/* --- REPORT VIEW (for screen only) --- */}
            {isReportView && (
                <div id="report-container-for-screen">
                    <ReportView study={caseFile.study} brandingSettings={brandingSettings} />
                </div>
            )}
        </div>
    );
};