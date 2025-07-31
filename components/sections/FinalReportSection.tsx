import React from 'react';
import { CaseStudy } from '../../types';
import { FormSection } from '../FormSection';
import { Textarea } from '../Textarea';

type Props = {
    data: CaseStudy['finalReport'];
    onChange: (data: Partial<CaseStudy['finalReport']>) => void;
};

export const FinalReportSection: React.FC<Props> = ({ data, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange({ [e.target.name]: e.target.value });
    };

    return (
        <div>
            <FormSection title="التقرير الختامي لدراسة الحالة">
                 <Textarea label="رأي الاختصاصي" name="specialistOpinion" value={data.specialistOpinion} onChange={handleChange} />
                 <Textarea label="التوصيات النهائية" name="recommendations" value={data.recommendations} onChange={handleChange} />
            </FormSection>
        </div>
    );
};