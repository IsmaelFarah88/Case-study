import React from 'react';
import { CaseStudy, AutocompleteSuggestions } from '../../types';
import { FormSection } from '../FormSection';
import { Textarea } from '../Textarea';

type Props = {
    data: CaseStudy['currentPerformance'];
    onChange: (data: Partial<CaseStudy['currentPerformance']>) => void;
    suggestions: AutocompleteSuggestions;
};

export const CurrentPerformanceSection: React.FC<Props> = ({ data, onChange, suggestions }) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange({ [e.target.name]: e.target.value });
    };
    
    const handleTextareaSelect = (name: keyof CaseStudy['currentPerformance'], value: string) => {
        onChange({ [name]: value });
    };

    return (
        <div>
            <FormSection title="مستوى الأداء الحالي">
                <Textarea label="مهارات الاعتماد على النفس" name="selfCareSkills" value={data.selfCareSkills} onChange={handleChange} previousEntries={suggestions.selfCareSkills} onValueSelect={(v) => handleTextareaSelect('selfCareSkills', v)} />
                <Textarea label="المهارات الاجتماعية" name="socialSkills" value={data.socialSkills} onChange={handleChange} previousEntries={suggestions.socialSkills} onValueSelect={(v) => handleTextareaSelect('socialSkills', v)} />
                <Textarea label="مهارات اللغة والتواصل" name="communicationSkills" value={data.communicationSkills} onChange={handleChange} previousEntries={suggestions.communicationSkills} onValueSelect={(v) => handleTextareaSelect('communicationSkills', v)} />
                <Textarea label="المهارات الأكاديمية" name="academicSkills" value={data.academicSkills} onChange={handleChange} previousEntries={suggestions.academicSkills} onValueSelect={(v) => handleTextareaSelect('academicSkills', v)} />
                <Textarea label="المهارات الحركية" name="motorSkills" value={data.motorSkills} onChange={handleChange} previousEntries={suggestions.motorSkills} onValueSelect={(v) => handleTextareaSelect('motorSkills', v)} />
                <Textarea label="الجانب الحسي" name="sensoryProfile" value={data.sensoryProfile} onChange={handleChange} previousEntries={suggestions.sensoryProfiles} onValueSelect={(v) => handleTextareaSelect('sensoryProfile', v)} />
            </FormSection>

            <FormSection title="اهتمامات الطفل">
                 <Textarea label="أشياء يحبها الطفل (أنشطة، ألعاب، أطعمة، أماكن، أشخاص، مثيرات حسية)" name="childInterests" value={data.childInterests} onChange={handleChange} previousEntries={suggestions.childInterests} onValueSelect={(v) => handleTextareaSelect('childInterests', v)} />
                 <Textarea label="أشياء لا يحبها الطفل" name="childDislikes" value={data.childDislikes} onChange={handleChange} previousEntries={suggestions.childDislikes} onValueSelect={(v) => handleTextareaSelect('childDislikes', v)} />
            </FormSection>
        </div>
    );
};