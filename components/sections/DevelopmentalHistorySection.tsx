import React from 'react';
import { CaseStudy, AutocompleteSuggestions } from '../../types';
import { FormSection } from '../FormSection';
import { Input } from '../Input';
import { Textarea } from '../Textarea';

type Props = {
    data: CaseStudy['developmentalHistory'];
    onChange: (data: Partial<CaseStudy['developmentalHistory']>) => void;
    suggestions: AutocompleteSuggestions;
};

export const DevelopmentalHistorySection: React.FC<Props> = ({ data, onChange, suggestions }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange({ [e.target.name]: e.target.value });
    };

    const handleTextareaSelect = (name: keyof CaseStudy['developmentalHistory'], value: string) => {
        onChange({ [name]: value });
    };

    return (
        <div>
            <FormSection title="التاريخ التطوري (متى أظهر الطفل المهارات التالية؟)">
                <Input label="الحبو (العمر)" name="crawlingAge" value={data.crawlingAge} onChange={handleChange} />
                <Input label="الجلوس (العمر)" name="sittingAge" value={data.sittingAge} onChange={handleChange} />
                <Input label="المشي (العمر)" name="walkingAge" value={data.walkingAge} onChange={handleChange} />
                <Input label="نطق أول كلمة (العمر)" name="firstWordAge" value={data.firstWordAge} onChange={handleChange} />
                <Input label="نطق جملة من كلمتين (العمر)" name="firstSentenceAge" value={data.firstSentenceAge} onChange={handleChange} />
                <Input label="التسنين (العمر)" name="teethingAge" value={data.teethingAge} onChange={handleChange} />
            </FormSection>

            <FormSection title="ملاحظات تطورية">
                <Textarea 
                    label="هل كانت هناك أعراض لنمو غير طبيعي للطفل؟ الرجاء التوضيح:" 
                    name="unusualGrowthSymptoms" 
                    value={data.unusualGrowthSymptoms} 
                    onChange={handleChange}
                    previousEntries={suggestions.unusualGrowthSymptoms}
                    onValueSelect={(value) => handleTextareaSelect('unusualGrowthSymptoms', value)}
                />
                <Textarea 
                    label="هل تراجعت قدراته الاجتماعية واللغوية في سن معين؟ الرجاء التوضيح وتحديد سن التراجع:" 
                    name="languageRegression" 
                    value={data.languageRegression} 
                    onChange={handleChange}
                    previousEntries={suggestions.languageRegressions}
                    onValueSelect={(value) => handleTextareaSelect('languageRegression', value)}
                />
            </FormSection>
        </div>
    );
};