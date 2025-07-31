import React, { useState, useMemo } from 'react';
import { CaseFile } from '../types';
import { FolderIcon, TrashIcon, SettingsIcon, SearchIcon, ChartBarIcon, UserIcon } from './Icons';

interface CaseListViewProps {
    cases: CaseFile[];
    onSelectCase: (id: string) => void;
    onAddNewCase: () => void;
    onDeleteCase: (id: string) => void;
    onOpenSettings: () => void;
}

const StatCard: React.FC<{ title: string, value: string | number, icon: React.ReactElement }> = ({ title, value, icon }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/80 flex items-center gap-4">
        <div className="bg-blue-100 text-blue-600 rounded-full p-3">
            {icon}
        </div>
        <div>
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <p className="text-slate-900 text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const BarChart: React.FC<{data: {label: string, count: number}[]}> = ({data}) => {
    const maxCount = useMemo(() => Math.max(...data.map(d => d.count), 0), [data]);
    if (data.length === 0) return null;
    
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/80">
            <h3 className="text-lg font-bold text-slate-800 mb-4">توزيع الحالات حسب جهة الإحالة</h3>
            <div className="flex gap-4 items-end h-48">
                {data.map(({ label, count }) => (
                    <div key={label} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                            className="w-full bg-blue-400 hover:bg-blue-500 rounded-t-md transition-all"
                            style={{ height: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%` }}
                            title={`${label}: ${count} ${count > 1 ? 'حالات' : 'حالة'}`}
                        >
                        </div>
                        <span className="text-xs text-slate-500 text-center break-words">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


export const CaseListView: React.FC<CaseListViewProps> = ({ cases, onSelectCase, onAddNewCase, onDeleteCase, onOpenSettings }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSource, setSelectedSource] = useState('all');

    const { newCasesThisMonth, sourceCounts, uniqueSources } = useMemo(() => {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const counts: {[key: string]: number} = {};
        const sources = new Set<string>();

        const newCases = cases.filter(c => {
            const caseTimestamp = parseInt(c.id.split('_')[1], 10);
            const source = c.study.generalInfo.referralSource;
            if (source) {
                sources.add(source);
                counts[source] = (counts[source] || 0) + 1;
            }
            return caseTimestamp >= firstDayOfMonth.getTime();
        }).length;
        
        return {
            newCasesThisMonth: newCases,
            sourceCounts: Object.entries(counts).map(([label, count]) => ({label, count})),
            uniqueSources: Array.from(sources)
        };
    }, [cases]);

    const filteredCases = useMemo(() => {
        return cases.filter(caseFile => {
            const bySource = selectedSource === 'all' || caseFile.study.generalInfo.referralSource === selectedSource;
            const bySearch = searchQuery === '' ||
                caseFile.study.generalInfo.childFullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                caseFile.study.generalInfo.caseNumber.toLowerCase().includes(searchQuery.toLowerCase());
            return bySource && bySearch;
        });
    }, [cases, searchQuery, selectedSource]);

    return (
        <div className="max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-slate-200 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">نظام دراسة الحالة</h1>
                    <p className="text-slate-500 mt-1">إدارة وتحليل ملفات الطلاب بكفاءة وذكاء.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onAddNewCase}
                        className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        <span>إضافة حالة جديدة</span>
                    </button>
                    <button
                        onClick={onOpenSettings}
                        className="p-2.5 text-slate-500 bg-slate-100 rounded-lg shadow-sm hover:bg-slate-200 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        aria-label="إعدادات الهوية البصرية"
                    >
                        <SettingsIcon className="h-5 w-5" />
                    </button>
                </div>
            </header>
            
            {/* Dashboard Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="إجمالي الحالات" value={cases.length} icon={<UserIcon className="h-6 w-6"/>} />
                <StatCard title="حالات جديدة هذا الشهر" value={newCasesThisMonth} icon={<FolderIcon className="h-6 w-6"/>} />
                <div className="md:col-span-3">
                   <BarChart data={sourceCounts} />
                </div>
            </section>

            {/* Search and Filter Section */}
            <div className="mb-8 p-4 bg-white rounded-xl shadow-sm border border-slate-200/80">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 relative">
                        <label htmlFor="search-case" className="sr-only">بحث</label>
                        <input
                            id="search-case"
                            type="text"
                            placeholder="ابحث بالاسم أو رقم الحالة..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full ps-10 pe-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-slate-400">
                           <SearchIcon />
                        </div>
                    </div>
                    <div>
                         <label htmlFor="filter-source" className="sr-only">فلترة حسب المصدر</label>
                         <select
                            id="filter-source"
                            value={selectedSource}
                            onChange={(e) => setSelectedSource(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                         >
                            <option value="all">كل جهات الإحالة</option>
                            {uniqueSources.map(source => (
                                <option key={source} value={source}>{source}</option>
                            ))}
                         </select>
                    </div>
                </div>
            </div>

            {filteredCases.length === 0 ? (
                <div className="text-center py-20 px-6 bg-white rounded-lg shadow-sm border border-slate-200 mt-12">
                    <FolderIcon className="mx-auto h-16 w-16 text-slate-400" />
                    <h3 className="mt-4 text-xl font-medium text-slate-800">لا توجد حالات تطابق بحثك</h3>
                    <p className="mt-2 text-md text-slate-500">حاول تغيير كلمات البحث أو الفلترة.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCases.map((caseFile) => (
                        <div
                            key={caseFile.id}
                            className="bg-white p-5 rounded-xl shadow-md border border-slate-200/80 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                            onClick={() => onSelectCase(caseFile.id)}
                        >
                            <div className="flex-grow">
                                <h4 className="font-bold text-lg text-slate-900 truncate">
                                    {caseFile.study.generalInfo.childFullName || 'طالب بدون اسم'}
                                </h4>
                                <p className="text-sm text-slate-500 mt-1">
                                    رقم الحالة: {caseFile.study.generalInfo.caseNumber || 'غير محدد'}
                                </p>
                            </div>
                            <div className="mt-6 flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onSelectCase(caseFile.id); }}
                                    className="flex-1 text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    عرض / تعديل
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteCase(caseFile.id); }}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                    aria-label="حذف الحالة"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};