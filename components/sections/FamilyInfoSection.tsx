import React from 'react';
import { CaseStudy, Sibling, AutocompleteSuggestions } from '../../types';
import { FormSection } from '../FormSection';
import { Input } from '../Input';
import { RadioGroup } from '../RadioGroup';
import { Textarea } from '../Textarea';
import { TrashIcon, PlusCircleIcon } from '../Icons';

type Props = {
    data: CaseStudy['familyInfo'];
    onChange: (data: Partial<CaseStudy['familyInfo']>) => void;
    suggestions: AutocompleteSuggestions;
};

export const FamilyInfoSection: React.FC<Props> = ({ data, onChange, suggestions }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange({ [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ [e.target.name]: e.target.checked });
    };

    const handleTextareaSelect = (name: keyof CaseStudy['familyInfo'], value: string) => {
        onChange({ [name]: value });
    };

    // --- Sibling Management ---
    const handleAddSibling = () => {
        const newSibling: Sibling = {
            id: `sib_${Date.now()}`,
            name: '',
            gender: '',
            birthDate: '',
            age: '',
            healthStatus: '',
            educationLevel: '',
            profession: '',
        };
        onChange({ siblings: [...data.siblings, newSibling] });
    };

    const handleRemoveSibling = (id: string) => {
        onChange({ siblings: data.siblings.filter(s => s.id !== id) });
    };

    const handleSiblingChange = (id: string, field: keyof Sibling, value: string) => {
        const updatedSiblings = data.siblings.map(s => {
            if (s.id === id) {
                return { ...s, [field]: value };
            }
            return s;
        });
        onChange({ siblings: updatedSiblings });
    };

    return (
        <div>
            <FormSection title="معلومات الوالدين">
                <Input label="اسم الأب" name="fatherName" value={data.fatherName} onChange={handleChange} />
                <Input label="تاريخ ميلاد الأب" name="fatherBirthDate" type="date" value={data.fatherBirthDate} onChange={handleChange} />
                <Input label="المستوى التعليمي للأب" name="fatherEducation" value={data.fatherEducation} onChange={handleChange} datalistId="fathereducations-list" datalistOptions={suggestions.fatherEducations} />
                <Input label="مهنة الأب" name="fatherProfession" value={data.fatherProfession} onChange={handleChange} datalistId="fatherprofessions-list" datalistOptions={suggestions.fatherProfessions} />

                <Input label="اسم الأم" name="motherName" value={data.motherName} onChange={handleChange} />
                <Input label="تاريخ ميلاد الأم" name="motherBirthDate" type="date" value={data.motherBirthDate} onChange={handleChange} />
                <Input label="المستوى التعليمي للأم" name="motherEducation" value={data.motherEducation} onChange={handleChange} datalistId="mothereducations-list" datalistOptions={suggestions.motherEducations} />
                <Input label="مهنة الأم" name="motherProfession" value={data.motherProfession} onChange={handleChange} datalistId="motherprofessions-list" datalistOptions={suggestions.motherProfessions} />
            </FormSection>
            
            <div className="p-6 my-6 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="text-xl font-bold text-slate-700 border-b-2 border-blue-200 pb-2 mb-6">معلومات الإخوة والأخوات</h3>
                {data.siblings.map((sibling, index) => (
                    <div key={sibling.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 p-4 mb-4 border border-slate-200 rounded-lg relative">
                        <div className="col-span-full flex justify-between items-center">
                             <h4 className="font-semibold text-slate-600">الأخ / الأخت رقم {index + 1}</h4>
                             <button onClick={() => handleRemoveSibling(sibling.id)} className="text-slate-400 hover:text-red-600 transition-colors" aria-label="حذف الأخ/الأخت">
                                 <TrashIcon className="h-5 w-5" />
                             </button>
                        </div>
                        <Input label="الاسم" value={sibling.name} onChange={(e) => handleSiblingChange(sibling.id, 'name', e.target.value)} />
                        <Input label="تاريخ الميلاد" type="date" value={sibling.birthDate} onChange={(e) => handleSiblingChange(sibling.id, 'birthDate', e.target.value)} />
                        <Input label="العمر" value={sibling.age} onChange={(e) => handleSiblingChange(sibling.id, 'age', e.target.value)} />
                        <Input label="الجنس" value={sibling.gender} onChange={(e) => handleSiblingChange(sibling.id, 'gender', e.target.value)} />
                        <Input label="الحالة الصحية" value={sibling.healthStatus} onChange={(e) => handleSiblingChange(sibling.id, 'healthStatus', e.target.value)} />
                        <Input label="المستوى التعليمي" value={sibling.educationLevel} onChange={(e) => handleSiblingChange(sibling.id, 'educationLevel', e.target.value)} />
                        <Input label="المهنة" value={sibling.profession} onChange={(e) => handleSiblingChange(sibling.id, 'profession', e.target.value)} />
                    </div>
                ))}
                 <button onClick={handleAddSibling} className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition-colors">
                    <PlusCircleIcon className="h-5 w-5" />
                    <span>إضافة أخ / أخت</span>
                </button>
            </div>


            <FormSection title="الوضع الأسري">
                 <Input label="صلة القرابة بين الأب والأم" name="parentsRelationship" value={data.parentsRelationship} onChange={handleChange} datalistId="parentsrelationships-list" datalistOptions={suggestions.parentsRelationships} />
                 <Input label="مع من يقيم الطفل؟" name="whoChildLivesWith" value={data.whoChildLivesWith} onChange={handleChange} datalistId="whochildliveswiths-list" datalistOptions={suggestions.whoChildLivesWiths} />
                 <Input label="مجموع دخل الأسرة شهرياً" name="monthlyIncome" value={data.monthlyIncome} onChange={handleChange} />
                
                 <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-600 mb-2">هل الأبوين منفصلين؟</label>
                    <input type="checkbox" name="parentsSeparated" checked={data.parentsSeparated} onChange={handleCheckboxChange} className="h-5 w-5 text-blue-600 rounded" />
                 </div>

                 <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-600 mb-2">هل يوجد لدى الطفل أقرباء لديهم مشكلات صحية؟</label>
                    <input type="checkbox" name="relativesWithConditions" checked={data.relativesWithConditions} onChange={handleCheckboxChange} className="h-5 w-5 text-blue-600 rounded" />
                 </div>
                 
                 <Textarea 
                    label="هل تعاني الأسرة من ضغوط معينة؟ (نفسية، اجتماعية، مادية، أخرى). أرجو تحديد نوع الضغوط:" 
                    name="familyPressures" 
                    value={data.familyPressures} 
                    onChange={handleChange} 
                    previousEntries={suggestions.familyPressures}
                    onValueSelect={(value) => handleTextareaSelect('familyPressures', value)}
                 />
                 {data.relativesWithConditions && (
                     <Textarea 
                        label="يرجى كتابة تقرير مبسط يشرح وضع الأقارب المصابين أو الذين لديهم مشاكل إن أمكن:" 
                        name="relativesConditionReport" 
                        value={data.relativesConditionReport} 
                        onChange={handleChange} 
                     />
                 )}
            </FormSection>
        </div>
    );
};