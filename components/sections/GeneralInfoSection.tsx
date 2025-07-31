import React, { useEffect } from 'react';
import { CaseStudy, AutocompleteSuggestions } from '../../types';
import { FormSection } from '../FormSection';
import { Input } from '../Input';
import { RadioGroup } from '../RadioGroup';
import { Textarea } from '../Textarea';

type Props = {
    data: CaseStudy['generalInfo'];
    onChange: (data: Partial<CaseStudy['generalInfo']>) => void;
    suggestions: AutocompleteSuggestions;
};

const calculateAge = (birthDate: string): string => {
    if (!birthDate) return '';
    try {
        const birth = new Date(birthDate);
        const today = new Date();
        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();

        if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
            years--;
            months = (months + 12) % 12;
        }

        if (years === 0 && months === 0) return 'أقل من شهر';
        
        const yearText = years > 0 ? `${years} ${years > 2 ? 'سنوات' : (years === 1 ? 'سنة' : 'سنتان')}` : '';
        const monthText = months > 0 ? `${months} ${months > 2 ? 'أشهر' : (months === 1 ? 'شهر' : 'شهران')}`: '';
        
        return [yearText, monthText].filter(Boolean).join(' و ');
    } catch (e) {
        return '';
    }
};


export const GeneralInfoSection: React.FC<Props> = ({ data, onChange, suggestions }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange({ [e.target.name]: e.target.value });
    };

    const handleTextareaSelect = (name: keyof CaseStudy['generalInfo'], value: string) => {
        onChange({ [name]: value });
    };

    useEffect(() => {
        if(data.birthDate) {
            const newAge = calculateAge(data.birthDate);
            if (newAge !== data.age) {
                onChange({ age: newAge });
            }
        }
    }, [data.birthDate, data.age, onChange]);


    return (
        <div>
            <FormSection title="معلومات تعريفية أولية بالحالة">
                <Input label="اسم الطفل الرباعي" name="childFullName" value={data.childFullName} onChange={handleChange} containerClassName="md:col-span-2" />
                <Input label="رقم الحالة" name="caseNumber" value={data.caseNumber} onChange={handleChange} />
                <RadioGroup 
                    label="الجنس"
                    name="gender"
                    options={[{value: 'ذكر', label: 'ذكر'}, {value: 'أنثى', label: 'أنثى'}]}
                    selectedValue={data.gender}
                    onChange={(e) => onChange({ gender: e.target.value as 'ذكر' | 'أنثى' })}
                />
                <Input label="تاريخ الميلاد" name="birthDate" type="date" value={data.birthDate} onChange={handleChange} />
                <Input label="العمر" name="age" value={data.age} onChange={() => {}} readOnly className="bg-slate-100 cursor-default" />
                <Input label="الجنسية" name="nationality" value={data.nationality} onChange={handleChange} datalistId="nationalities-list" datalistOptions={suggestions.nationalities} />
                <Input label="مكان الميلاد" name="birthPlace" value={data.birthPlace} onChange={handleChange} datalistId="birthplaces-list" datalistOptions={suggestions.birthPlaces} />
            </FormSection>

            <FormSection title="معلومات ولي الأمر والاتصال">
                <Input label="اسم ولي أمر الطفل" name="guardianName" value={data.guardianName} onChange={handleChange} />
                <Input label="صلة القرابة بالطفل" name="guardianRelation" value={data.guardianRelation} onChange={handleChange} datalistId="guardianrelations-list" datalistOptions={suggestions.guardianRelations} />
                <Input label="هاتف المنزل" name="contactHome" value={data.contactHome} onChange={handleChange} />
                <Input label="هاتف الجوال" name="contactMobile" value={data.contactMobile} onChange={handleChange} />
                <Input label="هاتف العمل" name="contactWork" value={data.contactWork} onChange={handleChange} />
                <Input label="العنوان الدائم للحالة (المنزل + البريد)" name="address" value={data.address} onChange={handleChange} containerClassName="md:col-span-3"/>
            </FormSection>

            <FormSection title="معلومات الإحالة">
                <Input label="الجهة المحولة" name="referralSource" value={data.referralSource} onChange={handleChange} datalistId="referralsources-list" datalistOptions={suggestions.referralSources} />
                <Input label="تاريخ التحويل" name="referralDate" type="date" value={data.referralDate} onChange={handleChange} />
                <Textarea 
                    label="سبب التحويل" 
                    name="referralReason" 
                    value={data.referralReason} 
                    onChange={handleChange} 
                    previousEntries={suggestions.referralReasons}
                    onValueSelect={(value) => handleTextareaSelect('referralReason', value)}
                />
            </FormSection>
        </div>
    );
};