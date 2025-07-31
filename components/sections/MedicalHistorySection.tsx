import React from 'react';
import { CaseStudy, Medication, AutocompleteSuggestions } from '../../types';
import { FormSection } from '../FormSection';
import { Input } from '../Input';
import { Textarea } from '../Textarea';
import { TrashIcon, PlusCircleIcon } from '../Icons';

type Props = {
    data: CaseStudy['medicalHistory'];
    onChange: (data: Partial<CaseStudy['medicalHistory']>) => void;
    suggestions: AutocompleteSuggestions;
};

export const MedicalHistorySection: React.FC<Props> = ({ data, onChange, suggestions }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange({ [e.target.name]: e.target.value });
    };

    const handleTextareaSelect = (name: keyof CaseStudy['medicalHistory'], value: string) => {
        onChange({ [name]: value });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ [e.target.name]: e.target.checked });
    };

    // --- Medication Management ---
    const handleAddMedication = () => {
        const newMedication: Medication = {
            id: `med_${Date.now()}`,
            name: '',
            dose: '',
            reason: '',
            duration: '',
            effects: '',
        };
        onChange({ medications: [...data.medications, newMedication] });
    };

    const handleRemoveMedication = (id: string) => {
        onChange({ medications: data.medications.filter(m => m.id !== id) });
    };

    const handleMedicationChange = (id: string, field: keyof Medication, value: string) => {
        const updatedMedications = data.medications.map(m => {
            if (m.id === id) {
                return { ...m, [field]: value };
            }
            return m;
        });
        onChange({ medications: updatedMedications });
    };

    return (
        <div>
            <FormSection title="التاريخ الصحي للأم والحالة (مرحلة الحمل)">
                <Input label="عمر الأم عند الحمل" name="motherAgeAtPregnancy" value={data.motherAgeAtPregnancy} onChange={handleChange} />
                <Input label="مدة الحمل" name="pregnancyDuration" value={data.pregnancyDuration} onChange={handleChange} />
                <Input label="نوعية الحمل (طبيعي / غير طبيعي)" name="pregnancyType" value={data.pregnancyType} onChange={handleChange} datalistId="pregnancytypes-list" datalistOptions={suggestions.pregnancyTypes} />
                <Textarea 
                    label="هل عانت الأم أي من المضاعفات أثناء الحمل؟ أذكرها هنا:" 
                    name="pregnancyComplications" 
                    value={data.pregnancyComplications} 
                    onChange={handleChange}
                    previousEntries={suggestions.pregnancyComplications}
                    onValueSelect={(value) => handleTextareaSelect('pregnancyComplications', value)} 
                />
            </FormSection>

            <FormSection title="مرحلة الولادة">
                <Input label="كيف كانت ولادة الطفل؟ (طبيعية، قيصرية، شفط)" name="birthType" value={data.birthType} onChange={handleChange} datalistId="birthtypes-list" datalistOptions={suggestions.birthTypes} />
                <Input label="كم كان وزن الطفل عند الولادة؟" name="birthWeight" value={data.birthWeight} onChange={handleChange} />
                <Input label="كم كان طول الطفل عند الولادة؟" name="birthLength" value={data.birthLength} onChange={handleChange} />
                <Input label="مجموع أبغار العام (Apgar Score)" name="apgarScore" value={data.apgarScore} onChange={handleChange} />

                <div className="flex items-center space-s-4">
                    <input type="checkbox" name="oxygenDeprivation" checked={data.oxygenDeprivation} onChange={handleCheckboxChange} className="h-5 w-5 text-blue-600 rounded" />
                    <label className="text-sm text-slate-700">هل أصيب الطفل بنقص في الأوكسجين عند الولادة؟</label>
                </div>
                 <div className="flex items-center space-s-4">
                    <input type="checkbox" name="usedBirthTools" checked={data.usedBirthTools} onChange={handleCheckboxChange} className="h-5 w-5 text-blue-600 rounded" />
                    <label className="text-sm text-slate-700">هل استخدمت أدوات مساعدة في عملية الولادة؟</label>
                </div>
            </FormSection>

            <FormSection title="مرحلة ما بعد الولادة">
                <Textarea 
                    label="هل عانى المولود في مرحلة ما بعد الولادة مباشرة أي من الحالات؟" 
                    name="postNatalIssues" 
                    value={data.postNatalIssues} 
                    onChange={handleChange}
                    previousEntries={suggestions.postNatalIssues}
                    onValueSelect={(value) => handleTextareaSelect('postNatalIssues', value)}
                />
                 <div className="flex items-center space-s-4">
                    <input type="checkbox" name="incubator" checked={data.incubator} onChange={handleCheckboxChange} className="h-5 w-5 text-blue-600 rounded" />
                    <label className="text-sm text-slate-700">هل وضع الطفل في الحاضنة؟</label>
                </div>
                {data.incubator && (
                    <>
                        <Input label="سبب الوضع في الحاضنة" name="incubatorReason" value={data.incubatorReason} onChange={handleChange} />
                        <Input label="مدة الوضع في الحاضنة" name="incubatorDuration" value={data.incubatorDuration} onChange={handleChange} />
                    </>
                )}
            </FormSection>

             <div className="p-6 my-6 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="text-xl font-bold text-slate-700 border-b-2 border-blue-200 pb-2 mb-6">الأدوية التي يتناولها الطفل</h3>
                {data.medications.map((med, index) => (
                    <div key={med.id} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 p-4 mb-4 border border-slate-200 rounded-lg relative">
                        <div className="col-span-full flex justify-between items-center">
                             <h4 className="font-semibold text-slate-600">الدواء رقم {index + 1}</h4>
                             <button onClick={() => handleRemoveMedication(med.id)} className="text-slate-400 hover:text-red-600 transition-colors" aria-label="حذف الدواء">
                                 <TrashIcon className="h-5 w-5" />
                             </button>
                        </div>
                        <Input label="اسم الدواء" value={med.name} onChange={(e) => handleMedicationChange(med.id, 'name', e.target.value)} />
                        <Input label="الجرعة" value={med.dose} onChange={(e) => handleMedicationChange(med.id, 'dose', e.target.value)} />
                        <Input label="سبب الاستخدام" value={med.reason} onChange={(e) => handleMedicationChange(med.id, 'reason', e.target.value)} containerClassName="md:col-span-2" />
                        <Input label="مدة الاستخدام" value={med.duration} onChange={(e) => handleMedicationChange(med.id, 'duration', e.target.value)} />
                        <Input label="الآثار الجانبية" value={med.effects} onChange={(e) => handleMedicationChange(med.id, 'effects', e.target.value)} />
                    </div>
                ))}
                <button onClick={handleAddMedication} className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition-colors">
                    <PlusCircleIcon className="h-5 w-5" />
                    <span>إضافة دواء</span>
                </button>
            </div>
        </div>
    );
};