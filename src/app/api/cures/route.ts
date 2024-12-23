import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(`${process.env.API_KEY}`);

export async function POST(req: Request, res: Response) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
        const { diseaseDescription } = await req.json();
        // console.log(diseaseDescription);

        const prompt = `I am suffering from "${diseaseDescription}". Suggest 6 yoga poses that can cure my health problem. The suggested poses should take into account every aspect of my health issue, tailored to my mentioned body condition. List names of yoga poses in the following parsable JSON format:
        [
            {
                "PoseName": "Yoga pose Name in english lower case without special character",
                "PoseDescription": "basic description of the pose and why it is good for this case",
                "PoseSteps":  ["1st step", "2nd step", "nth step"],
                "Precautions": ["precaution1", "precaution2", "precaution-n"],
                "Benefits": ["benefit1", "benefit2", "benefit-n"]
            }
        ]`;

        const result = await model.generateContent([prompt]);
        const response = result.response;
        const text = await response.text();

        // Remove any potential surrounding content and extract JSON
        const jsonStartIndex = text.indexOf('[');
        const jsonEndIndex = text.lastIndexOf(']') + 1;
        const jsonString = text.slice(jsonStartIndex, jsonEndIndex);

        const posesArray = JSON.parse(jsonString);
        return new Response(JSON.stringify({ posesArray }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to generate yoga poses' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}