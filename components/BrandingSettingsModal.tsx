import React, { useState, useEffect, useRef } from 'react';
import { BrandingSettings } from '../types';
import { Input } from './Input';
import { Textarea } from './Textarea';

interface BrandingSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (settings: BrandingSettings) => void;
    initialSettings: BrandingSettings;
}

export const BrandingSettingsModal: React.FC<BrandingSettingsModalProps> = ({ isOpen, onClose, onSave, initialSettings }) => {
    const [settings, setSettings] = useState<BrandingSettings>(initialSettings);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setSettings(initialSettings);
    }, [initialSettings, isOpen]);

    if (!isOpen) return null;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSettings(prev => ({ ...prev, logo: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(settings);
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800">إعدادات الهوية البصرية للتقارير</h2>
                    <p className="text-slate-500 mt-1">تخصيص التقارير بشعار ومعلومات مؤسستك.</p>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">شعار المؤسسة</label>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 bg-slate-100 rounded-md flex items-center justify-center border border-dashed">
                                {settings.logo ? (
                                    <img src={settings.logo} alt="الشعار الحالي" className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <span className="text-xs text-slate-400">لا يوجد شعار</span>
                                )}
                            </div>
                            <div className="flex-grow">
                                <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                    رفع شعار جديد
                                </button>
                                <button
                                    onClick={() => setSettings(prev => ({ ...prev, logo: '' }))}
                                    className="px-4 py-2 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors ms-2"
                                >
                                    إزالة الشعار
                                </button>
                                <p className="text-xs text-slate-400 mt-2">الأبعاد الموصى بها: 200x80 بكسل.</p>
                            </div>
                        </div>
                    </div>

                    <Input 
                        label="اسم المؤسسة" 
                        name="organizationName" 
                        value={settings.organizationName}
                        onChange={handleInputChange}
                        placeholder="مثال: مركز الأمل للرعاية"
                    />
                    <Textarea
                        label="عنوان المؤسسة"
                        name="address"
                        value={settings.address}
                        onChange={handleInputChange}
                        rows={2}
                        containerClassName="col-span-1"
                        placeholder="مثال: شارع الملك فهد، الرياض، المملكة العربية السعودية"
                    />
                    <Input 
                        label="معلومات التواصل (هاتف، بريد إلكتروني، موقع ويب)" 
                        name="contactInfo"
                        value={settings.contactInfo}
                        onChange={handleInputChange} 
                        placeholder="مثال: 920012345 - info@alamal.com"
                    />
                </div>
                <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="px-5 py-2 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                        إلغاء
                    </button>
                    <button onClick={handleSave} className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                        حفظ الإعدادات
                    </button>
                </div>
            </div>
        </div>
    );
};