import React, { useState } from 'react';
import { CaseStudy, BrandingSettings } from '../types';
import { CopyIcon, CheckIcon } from './Icons';

type InfoFieldProps = {
  label: string;
  value: string | number | boolean | undefined | null;
  fullWidth?: boolean;
  isBoolean?: boolean;
};

const ReportBrandingHeader: React.FC<{ settings: BrandingSettings }> = ({ settings }) => {
    if (!settings.logo && !settings.organizationName) return null;

    return (
        <div className="report-branding-header flex justify-between items-center pb-4 mb-8 border-b-2 border-slate-300">
            {settings.organizationName && (
                <div className="text-right">
                    <h1 className="text-2xl font-bold text-slate-800">{settings.organizationName}</h1>
                </div>
            )}
            {settings.logo && (
                <div className="w-40 h-auto flex-shrink-0">
                    <img src={settings.logo} alt="شعار المؤسسة" className="max-w-full h-auto object-contain" />
                </div>
            )}
        </div>
    );
};

const ReportBrandingFooter: React.FC<{ settings: BrandingSettings }> = ({ settings }) => {
    if (!settings.address && !settings.contactInfo) return null;
    return (
        <div className="report-branding-footer text-center text-xs text-slate-500 pt-6 mt-10 border-t border-slate-200">
            <p>{settings.address}</p>
            <p className="mt-1">{settings.contactInfo}</p>
        </div>
    );
};


const InfoField: React.FC<InfoFieldProps> = ({ label, value, fullWidth = false, isBoolean = false }) => {
  let displayValue = value;

  if (typeof value === 'boolean') {
      displayValue = value ? 'نعم' : 'لا';
  } else if (value === null || value === undefined || value === '') {
      displayValue = 'غير محدد';
  }

  return (
    <div className={`py-3 px-2 ${fullWidth ? 'sm:col-span-2' : ''}`}>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-md text-slate-800 break-words">{displayValue as React.ReactNode}</p>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-10 report-section">
    <h2 className="text-xl font-bold text-slate-700 border-b-2 border-slate-200 pb-2 mb-3">{title}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 divide-y sm:divide-y-0 divide-slate-100">
      {children}
    </div>
  </section>
);

const TextAreaDisplay: React.FC<{ label: string; value: string | undefined; isList?: boolean }> = ({ label, value, isList = false }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        if (!value) return;
        navigator.clipboard.writeText(value)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            })
            .catch(err => console.error('Failed to copy text: ', err));
    };

    return (
        <div className="py-3 px-2 sm:col-span-2 relative group">
            <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-semibold text-slate-500">{label}</p>
                {value && (
                    <button 
                        onClick={handleCopy}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-slate-200"
                        aria-label={`نسخ ${label}`}
                    >
                        {isCopied ? (
                            <CheckIcon className="h-4 w-4 text-green-600" />
                        ) : (
                            <CopyIcon className="h-4 w-4 text-slate-500" />
                        )}
                    </button>
                )}
            </div>
            {isList && value ? (
                 <ul className="mt-1 text-md text-slate-800 list-disc list-inside space-y-1">
                    {value.split('\n').filter(item => item.trim() !== '').map((item, index) => (
                        <li key={index}>{item.replace(/^- /, '')}</li>
                    ))}
                </ul>
            ) : (
                 <p className="mt-1 text-md text-slate-800 whitespace-pre-wrap">{value || 'لا يوجد'}</p>
            )}
        </div>
    );
};


export const ReportView: React.FC<{ study: CaseStudy; brandingSettings: BrandingSettings }> = ({ study, brandingSettings }) => {
  const { generalInfo, familyInfo, medicalHistory, developmentalHistory, currentPerformance, finalReport } = study;

  return (
    <div className="font-sans bg-white p-4 sm:p-8">
      <ReportBrandingHeader settings={brandingSettings} />
      
      <header className="text-center mb-12 border-b-4 border-blue-600 pb-6">
        <h1 className="text-4xl font-extrabold text-slate-900">تقرير دراسة حالة</h1>
        <p className="text-xl text-slate-600 mt-2">{generalInfo.childFullName || 'طالب جديد'}</p>
      </header>

      <div className="max-w-4xl mx-auto">
        <Section title="معلومات عامة">
            <InfoField label="رقم الحالة" value={generalInfo.caseNumber} />
            <InfoField label="الجنس" value={generalInfo.gender} />
            <InfoField label="تاريخ الميلاد" value={generalInfo.birthDate} />
            <InfoField label="العمر" value={generalInfo.age} />
            <InfoField label="الجنسية" value={generalInfo.nationality} />
            <InfoField label="مكان الميلاد" value={generalInfo.birthPlace} />
            <InfoField label="اسم ولي الأمر" value={generalInfo.guardianName} />
            <InfoField label="صلة القرابة" value={generalInfo.guardianRelation} />
            <InfoField label="جهة الإحالة" value={generalInfo.referralSource} />
            <InfoField label="تاريخ الإحالة" value={generalInfo.referralDate} />
            <TextAreaDisplay label="سبب التحويل" value={generalInfo.referralReason} />
        </Section>
        
        <Section title="معلومات الأسرة">
            <InfoField label="اسم الأب" value={familyInfo.fatherName} />
            <InfoField label="مهنة الأب" value={familyInfo.fatherProfession} />
            <InfoField label="اسم الأم" value={familyInfo.motherName} />
            <InfoField label="مهنة الأم" value={familyInfo.motherProfession} />
            <InfoField label="العلاقة بين الوالدين" value={familyInfo.parentsRelationship} />
            <InfoField label="مقيم مع" value={familyInfo.whoChildLivesWith} />
            <InfoField label="دخل الأسرة الشهري" value={familyInfo.monthlyIncome} />
            <InfoField label="انفصال الوالدين" value={familyInfo.parentsSeparated} isBoolean />
            <TextAreaDisplay label="ضغوط أسرية" value={familyInfo.familyPressures} />
            <InfoField label="أقارب بحالات مشابهة" value={familyInfo.relativesWithConditions} isBoolean />
            {familyInfo.relativesWithConditions && <TextAreaDisplay label="تقرير عن حالة الأقارب" value={familyInfo.relativesConditionReport} />}
        </Section>
        
        {familyInfo.siblings && familyInfo.siblings.length > 0 && (
            <Section title="معلومات الإخوة والأخوات">
                <div className="sm:col-span-2 overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead className="border-b-2 border-slate-200">
                            <tr>
                                <th className="p-2 font-semibold text-slate-600">الاسم</th>
                                <th className="p-2 font-semibold text-slate-600">العمر</th>
                                <th className="p-2 font-semibold text-slate-600">الحالة الصحية</th>
                                <th className="p-2 font-semibold text-slate-600">المستوى التعليمي</th>
                            </tr>
                        </thead>
                        <tbody>
                            {familyInfo.siblings.map(sibling => (
                                <tr key={sibling.id} className="border-b border-slate-100">
                                    <td className="p-2 text-slate-800">{sibling.name || '-'}</td>
                                    <td className="p-2 text-slate-800">{sibling.age || '-'}</td>
                                    <td className="p-2 text-slate-800">{sibling.healthStatus || '-'}</td>
                                    <td className="p-2 text-slate-800">{sibling.educationLevel || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Section>
        )}

        <Section title="التاريخ الصحي">
            <InfoField label="مدة الحمل" value={medicalHistory.pregnancyDuration} />
            <InfoField label="نوع الولادة" value={medicalHistory.birthType} />
            <InfoField label="وزن الولادة" value={medicalHistory.birthWeight} />
            <InfoField label="مقياس أبغار" value={medicalHistory.apgarScore} />
            <InfoField label="نقص الأوكسجين عند الولادة" value={medicalHistory.oxygenDeprivation} isBoolean />
            <InfoField label="استخدام أدوات مساعدة بالولادة" value={medicalHistory.usedBirthTools} isBoolean />
            <InfoField label="وضع في الحاضنة" value={medicalHistory.incubator} isBoolean />
            <TextAreaDisplay label="مضاعفات الحمل" value={medicalHistory.pregnancyComplications} />
            <TextAreaDisplay label="مشاكل ما بعد الولادة" value={medicalHistory.postNatalIssues} />
        </Section>

        {medicalHistory.medications && medicalHistory.medications.length > 0 && (
            <Section title="الأدوية المستخدمة">
                 <div className="sm:col-span-2 overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead className="border-b-2 border-slate-200">
                            <tr>
                                <th className="p-2 font-semibold text-slate-600">اسم الدواء</th>
                                <th className="p-2 font-semibold text-slate-600">الجرعة</th>
                                <th className="p-2 font-semibold text-slate-600">سبب الاستخدام</th>
                                <th className="p-2 font-semibold text-slate-600">مدة الاستخدام</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicalHistory.medications.map(med => (
                                <tr key={med.id} className="border-b border-slate-100">
                                    <td className="p-2 text-slate-800">{med.name || '-'}</td>
                                    <td className="p-2 text-slate-800">{med.dose || '-'}</td>
                                    <td className="p-2 text-slate-800">{med.reason || '-'}</td>
                                    <td className="p-2 text-slate-800">{med.duration || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Section>
        )}
        
        <Section title="التاريخ التطوري">
            <InfoField label="عمر الحبو" value={developmentalHistory.crawlingAge} />
            <InfoField label="عمر الجلوس" value={developmentalHistory.sittingAge} />
            <InfoField label="عمر المشي" value={developmentalHistory.walkingAge} />
            <InfoField label="عمر نطق أول كلمة" value={developmentalHistory.firstWordAge} />
            <InfoField label="عمر نطق أول جملة" value={developmentalHistory.firstSentenceAge} />
            <InfoField label="عمر التسنين" value={developmentalHistory.teethingAge} />
            <TextAreaDisplay label="أعراض نمو غير طبيعية" value={developmentalHistory.unusualGrowthSymptoms} />
            <TextAreaDisplay label="تراجع لغوي أو اجتماعي" value={developmentalHistory.languageRegression} />
        </Section>
        
        <Section title="مستوى الأداء الحالي">
            <TextAreaDisplay label="مهارات الاعتماد على النفس" value={currentPerformance.selfCareSkills} />
            <TextAreaDisplay label="المهارات الاجتماعية" value={currentPerformance.socialSkills} />
            <TextAreaDisplay label="مهارات اللغة والتواصل" value={currentPerformance.communicationSkills} />
            <TextAreaDisplay label="المهارات الأكاديمية" value={currentPerformance.academicSkills} />
            <TextAreaDisplay label="المهارات الحركية" value={currentPerformance.motorSkills} />
            <TextAreaDisplay label="الجانب الحسي" value={currentPerformance.sensoryProfile} />
            <TextAreaDisplay label="أشياء يحبها الطفل" value={currentPerformance.childInterests} />
            <TextAreaDisplay label="أشياء لا يحبها الطفل" value={currentPerformance.childDislikes} />
        </Section>
        
        <Section title="التقرير النهائي والتوصيات">
            <TextAreaDisplay label="رأي الاختصاصي" value={finalReport.specialistOpinion} />
            <TextAreaDisplay label="التوصيات النهائية" value={finalReport.recommendations} isList />
        </Section>

      </div>
      <ReportBrandingFooter settings={brandingSettings} />
    </div>
  );
};