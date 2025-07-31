import type { ReactElement } from 'react';

export interface IconProps {
    className?: string;
}

export interface CaseSection {
    id: SectionKey;
    title: string;
    icon: ReactElement<IconProps>;
}

export interface Sibling {
    id: string;
    name: string;
    gender: string;
    birthDate: string;
    age: string;
    healthStatus: string;
    educationLevel: string;
    profession: string;
}

export interface Medication {
    id: string;
    name: string;
    reason: string;
    dose: string;
    duration: string;
    effects: string;
}

export interface RelativeWithCondition {
    id: string;
    condition: string;
    relationship: string;
}

export interface BrandingSettings {
    logo: string;
    organizationName: string;
    address: string;
    contactInfo: string;
}

export interface AutocompleteSuggestions {
    [key: string]: string[];
}

export interface CaseStudy {
    generalInfo: {
        caseNumber: string;
        childFullName: string;
        gender: 'ذكر' | 'أنثى' | '';
        birthDate: string;
        age: string;
        nationality: string;
        birthPlace: string;
        guardianName: string;
        guardianRelation: string;
        contactHome: string;
        contactMobile: string;
        contactWork: string;
        address: string;
        referralSource: string;
        referralDate: string;
        referralReason: string;
    };
    familyInfo: {
        fatherName: string;
        fatherBirthDate: string;
        fatherEducation: string;
        fatherProfession: string;
        motherName: string;
        motherBirthDate: string;
        motherEducation: string;
        motherProfession: string;
        parentsRelationship: string;
        whoChildLivesWith: string;
        familyIncomeSource: string[];
        monthlyIncome: string;
        parentsSeparated: boolean;
        familyPressures: string;
        siblings: Sibling[];
        relativesWithConditions: boolean;
        relativesConditionsDetails: RelativeWithCondition[];
        relativesConditionReport: string;
    };
    medicalHistory: {
        motherAgeAtPregnancy: string;
        pregnancyDuration: string;
        pregnancyType: string;
        pregnancyComplications: string;
        birthType: string;
        birthWeight: string;
        birthLength: string;
        oxygenDeprivation: boolean;
        apgarScore: string;
        usedBirthTools: boolean;
        postNatalIssues: string;
        incubator: boolean;
        incubatorReason: string;
        incubatorDuration: string;
        medications: Medication[];
    };
    developmentalHistory: {
        crawlingAge: string;
        sittingAge: string;
        walkingAge: string;
        firstWordAge: string;
        firstSentenceAge: string;
        teethingAge: string;
        unusualGrowthSymptoms: string;
        languageRegression: string;
        regressionAge: string;
    };
    currentPerformance: {
        selfCareSkills: string;
        socialSkills: string;
        communicationSkills: string;
        academicSkills: string;
        motorSkills: string;
        sensoryProfile: string;
        childInterests: string;
        childDislikes: string;
    };
    finalReport: {
        specialistOpinion: string;
        recommendations: string;
    };
}

export interface CaseFile {
    id: string;
    study: CaseStudy;
}

export type SectionKey = keyof CaseStudy;