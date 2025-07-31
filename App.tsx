import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { CaseFile, CaseStudy, SectionKey, BrandingSettings, AutocompleteSuggestions } from './types';
import { INITIAL_STUDY_DATA, DUMMY_CASE_FILE, INITIAL_BRANDING_SETTINGS } from './constants';
import { CaseListView } from './components/CaseListView';
import { CaseDetailView } from './components/CaseDetailView';
import { BrandingSettingsModal } from './components/BrandingSettingsModal';

const STORAGE_KEY = 'special_ed_case_files';
const BRANDING_STORAGE_KEY = 'special_ed_branding_settings';

type SaveStatus = 'idle' | 'saved';

const App: React.FC = () => {
    const [caseFiles, setCaseFiles] = useState<CaseFile[]>(() => {
        try {
            const storedFiles = localStorage.getItem(STORAGE_KEY);
            if (storedFiles === null) {
                return [DUMMY_CASE_FILE];
            }
            return JSON.parse(storedFiles);
        } catch (error) {
            console.error("Failed to parse case files from localStorage", error);
            return [];
        }
    });

    const [activeCaseId, setActiveCaseId] = useState<string | null>(null);

    const [brandingSettings, setBrandingSettings] = useState<BrandingSettings>(() => {
        try {
            const storedSettings = localStorage.getItem(BRANDING_STORAGE_KEY);
            return storedSettings ? JSON.parse(storedSettings) : INITIAL_BRANDING_SETTINGS;
        } catch (error) {
            console.error("Failed to parse branding settings from localStorage", error);
            return INITIAL_BRANDING_SETTINGS;
        }
    });
    
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const saveTimeoutRef = useRef<number | null>(null);

    const autocompleteSuggestions = useMemo((): AutocompleteSuggestions => {
        const suggestions: { [key: string]: Set<string> } = {
            nationalities: new Set(), birthPlaces: new Set(), guardianRelations: new Set(), referralSources: new Set(),
            fatherEducations: new Set(), fatherProfessions: new Set(), motherEducations: new Set(), motherProfessions: new Set(),
            parentsRelationships: new Set(), whoChildLivesWiths: new Set(),
            pregnancyTypes: new Set(), birthTypes: new Set(),
            unusualGrowthSymptoms: new Set(), languageRegressions: new Set(),
            selfCareSkills: new Set(), socialSkills: new Set(), communicationSkills: new Set(), academicSkills: new Set(),
            motorSkills: new Set(), sensoryProfiles: new Set(), childInterests: new Set(), childDislikes: new Set(),
            referralReasons: new Set(), familyPressures: new Set(), pregnancyComplications: new Set(), postNatalIssues: new Set(),
        };

        for (const file of caseFiles) {
            const { generalInfo, familyInfo, medicalHistory, developmentalHistory, currentPerformance } = file.study;
            const add = (key: string, value: string | undefined) => value && value.trim() && suggestions[key]?.add(value.trim());

            add('nationalities', generalInfo.nationality);
            add('birthPlaces', generalInfo.birthPlace);
            add('guardianRelations', generalInfo.guardianRelation);
            add('referralSources', generalInfo.referralSource);
            add('referralReasons', generalInfo.referralReason);

            add('fatherEducations', familyInfo.fatherEducation);
            add('fatherProfessions', familyInfo.fatherProfession);
            add('motherEducations', familyInfo.motherEducation);
            add('motherProfessions', familyInfo.motherProfession);
            add('parentsRelationships', familyInfo.parentsRelationship);
            add('whoChildLivesWiths', familyInfo.whoChildLivesWith);
            add('familyPressures', familyInfo.familyPressures);

            add('pregnancyTypes', medicalHistory.pregnancyType);
            add('birthTypes', medicalHistory.birthType);
            add('pregnancyComplications', medicalHistory.pregnancyComplications);
            add('postNatalIssues', medicalHistory.postNatalIssues);

            add('unusualGrowthSymptoms', developmentalHistory.unusualGrowthSymptoms);
            add('languageRegressions', developmentalHistory.languageRegression);

            add('selfCareSkills', currentPerformance.selfCareSkills);
            add('socialSkills', currentPerformance.socialSkills);
            add('communicationSkills', currentPerformance.communicationSkills);
            add('academicSkills', currentPerformance.academicSkills);
            add('motorSkills', currentPerformance.motorSkills);
            add('sensoryProfiles', currentPerformance.sensoryProfile);
            add('childInterests', currentPerformance.childInterests);
            add('childDislikes', currentPerformance.childDislikes);
        }
        
        const result: AutocompleteSuggestions = {};
        for (const key in suggestions) {
            result[key] = Array.from(suggestions[key]);
        }
        return result;
    }, [caseFiles]);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(caseFiles));
        } catch (error) {
            console.error("Failed to save case files to localStorage", error);
        }
    }, [caseFiles]);

    useEffect(() => {
        try {
            localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(brandingSettings));
        } catch (error) {
            console.error("Failed to save branding settings to localStorage", error);
        }
    }, [brandingSettings]);

    const handleAddNewCase = () => {
        const newCase: CaseFile = {
            id: `case_${Date.now()}`,
            study: JSON.parse(JSON.stringify(INITIAL_STUDY_DATA)) // Deep copy
        };
        setCaseFiles(prevFiles => [...prevFiles, newCase]);
        setActiveCaseId(newCase.id);
    };

    const handleSelectCase = (id: string) => {
        setActiveCaseId(id);
    };

    const handleBackToList = () => {
        setActiveCaseId(null);
    };
    
    const handleDeleteCase = (idToDelete: string) => {
        if (window.confirm('هل أنت متأكد من رغبتك في حذف هذه الحالة؟ لا يمكن التراجع عن هذا الإجراء.')) {
            setCaseFiles(prevFiles => prevFiles.filter(file => file.id !== idToDelete));
            if (activeCaseId === idToDelete) {
                setActiveCaseId(null);
            }
        }
    };

    const handleDataChange = useCallback((caseId: string, section: SectionKey, data: Partial<CaseStudy[SectionKey]>) => {
        setCaseFiles(prevFiles => 
            prevFiles.map(file => {
                if (file.id === caseId) {
                    const updatedStudy = {
                        ...file.study,
                        [section]: {
                            ...file.study[section],
                            ...data,
                        },
                    };
                    return { ...file, study: updatedStudy };
                }
                return file;
            })
        );
        
        setSaveStatus('saved');
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = window.setTimeout(() => {
            setSaveStatus('idle');
        }, 2000);

    }, []);
    
    const handleSaveBrandingSettings = (settings: BrandingSettings) => {
        setBrandingSettings(settings);
    };

    const activeCase = caseFiles.find(c => c.id === activeCaseId);

    return (
        <div className="min-h-screen bg-gray-50 text-slate-800 flex flex-col">
            <BrandingSettingsModal 
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                onSave={handleSaveBrandingSettings}
                initialSettings={brandingSettings}
            />
            <main className="flex-grow w-full max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">
                {activeCase ? (
                    <CaseDetailView 
                        caseFile={activeCase}
                        onDataChange={handleDataChange}
                        onBack={handleBackToList}
                        brandingSettings={brandingSettings}
                        saveStatus={saveStatus}
                        autocompleteSuggestions={autocompleteSuggestions}
                    />
                ) : (
                    <CaseListView 
                        cases={caseFiles}
                        onSelectCase={handleSelectCase}
                        onAddNewCase={handleAddNewCase}
                        onDeleteCase={handleDeleteCase}
                        onOpenSettings={() => setIsSettingsModalOpen(true)}
                    />
                )}
            </main>
            <footer className="text-center py-4 text-sm text-slate-500 bg-gray-50">
                تم عمل الموقع بواسطة اسماعيل فرح
            </footer>
        </div>
    );
};

export default App;