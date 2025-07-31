
import { GoogleGenAI, Type } from "@google/genai";
import { CaseStudy } from "../types";

// Use a singleton pattern to initialize the AI client only when needed.
// This prevents a crash on load if process.env.API_KEY is not immediately available.
let ai: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
}

function formatCaseDataForPrompt(caseData: CaseStudy): string {
    // We only need to stringify the data, as the prompt will instruct the model
    // on how to interpret it.
    return JSON.stringify(caseData, null, 2);
}

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        geminiSummary: {
            type: Type.STRING,
            description: "ملخص شامل للحالة بناءً على البيانات المقدمة. يجب أن يكون موجزًا ومركّزًا على النقاط الرئيسية."
        },
        specialistOpinion: {
            type: Type.STRING,
            description: "رأي متخصص مبدئي حول الحالة، مع تحديد نقاط القوة والضعف المحتملة ومجالات الاهتمام الرئيسية."
        },
        recommendations: {
            type: Type.STRING,
            description: "قائمة بالتوصيات الأولية المقترحة. يمكن أن تشمل اقتراحات لتقييمات إضافية، تدخلات سلوكية، أو دعم أسري. يجب أن تكون على شكل نقاط."
        }
    },
    required: ["geminiSummary", "specialistOpinion", "recommendations"]
};


export const generateCaseSummary = async (caseData: CaseStudy): Promise<{ specialistOpinion: string; recommendations: string; geminiSummary: string } | null> => {
    const model = "gemini-2.5-flash";
    const formattedData = formatCaseDataForPrompt(caseData);

    const prompt = `
    أنت أخصائي تربية خاصة محترف ومحلل بيانات. مهمتك هي تحليل بيانات دراسة الحالة التالية لطفل، ثم إنشاء تقرير منظم بصيغة JSON.
    البيانات المقدمة تغطي جوانب متعددة من حياة الطفل، بما في ذلك المعلومات العامة، الأسرية، الصحية، والتطورية.
    
    البيانات:
    \`\`\`json
    ${formattedData}
    \`\`\`

    بناءً على البيانات أعلاه فقط، قم بإنشاء الرد بصيغة JSON متوافق مع المخطط (schema) المحدد. يجب أن تكون جميع المخرجات باللغة العربية.
    1.  **geminiSummary**: قدم ملخصًا عامًا للحالة.
    2.  **specialistOpinion**: اكتب رأيًا متخصصًا يحدد نقاط القوة والضعف المحتملة.
    3.  **recommendations**: اقترح قائمة من التوصيات العملية على شكل نقاط.
    `;

    try {
        const client = getAiClient();
        const response = await client.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.5,
            }
        });

        const jsonText = response.text.trim();
        if (!jsonText) {
             console.error("Gemini response text is empty.");
             return null;
        }

        const parsedResponse = JSON.parse(jsonText);
        return parsedResponse;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate summary from Gemini API.");
    }
};
