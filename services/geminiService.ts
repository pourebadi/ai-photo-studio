import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getMimeType = (base64: string): string | null => {
    const match = base64.match(/^data:(image\/\w+);base64,/);
    return match ? match[1] : null;
};

const cleanBase64 = (base64: string): string => {
    return base64.replace(/^data:image\/\w+;base64,/, "");
};

export const describeStyleImage = async (styleImageBase64: string): Promise<string> => {
    try {
        const mimeType = getMimeType(styleImageBase64);
        if (!mimeType) throw new Error("Invalid image format for style reference.");

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{
                parts: [
                    {
                        inlineData: {
                            data: cleanBase64(styleImageBase64),
                            mimeType,
                        }
                    },
                    {
                        text: 'Describe this image in extreme detail. Focus on the art style, lighting, color palette, mood, composition, and any distinct textures or visual effects. This description will be used to create a new image in a similar style.'
                    }
                ]
            }]
        });

        if (!response.text) {
            throw new Error("The AI returned an empty description. The style might be too abstract or unsupported.");
        }
        return response.text;
    } catch (error) {
        console.error("Gemini API Error (describeStyleImage):", error);
        if (error instanceof Error && error.message.includes('API key')) {
             throw new Error("AI service authentication failed. Please check the API key configuration.");
        }
        throw new Error("Failed to analyze the style image. The AI service may be temporarily unavailable or the image format is unsupported.");
    }
};

export const describeProductImage = async (productImageBase64: string): Promise<string> => {
    try {
        const mimeType = getMimeType(productImageBase64);
        if (!mimeType) throw new Error("Invalid image format for product.");

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{
                parts: [
                    {
                        inlineData: {
                            data: cleanBase64(productImageBase64),
                            mimeType,
                        }
                    },
                    {
                        text: 'Analyze this product image and write a detailed, compelling, and professional photographic prompt for it. Focus on describing the product itself, its materials, and key features. The output should be a single, well-written paragraph ready to be used as the base for a new image generation prompt.'
                    }
                ]
            }]
        });

        if (!response.text) {
            throw new Error("The AI returned an empty description for the product. The image might be unclear or unsupported.");
        }
        return response.text;
    } catch (error) {
        console.error("Gemini API Error (describeProductImage):", error);
        if (error instanceof Error && error.message.includes('API key')) {
             throw new Error("AI service authentication failed. Please check the API key configuration.");
        }
        throw new Error("Failed to analyze the product image. The AI service may be temporarily unavailable or the image format is unsupported.");
    }
};


export const generateEditedImage = async (productImageBase64: string, prompt: string): Promise<string> => {
    try {
        const mimeType = getMimeType(productImageBase64);
        if (!mimeType) throw new Error("Invalid image format for product image.");

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: [{
                parts: [
                    {
                        inlineData: {
                            data: cleanBase64(productImageBase64),
                            mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            }],
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const firstPart = response.candidates?.[0]?.content?.parts[0];
        if (firstPart && 'inlineData' in firstPart && firstPart.inlineData) {
            const base64ImageBytes: string = firstPart.inlineData.data;
            const imageMimeType = firstPart.inlineData.mimeType;
            return `data:${imageMimeType};base64,${base64ImageBytes}`;
        }

        const finishReason = response.candidates?.[0]?.finishReason;
        if (finishReason === 'SAFETY') {
            throw new Error("Image generation failed. The prompt or image may have violated safety policies. Please adjust your prompt.");
        }
        
        throw new Error("The AI service did not return an image. This could be due to a complex prompt or a temporary service issue.");

    } catch (error) {
        console.error("Gemini API Error (generateEditedImage):", error);
        if (error instanceof Error) {
            // Re-throw specific, user-friendly errors we've already crafted.
            if (error.message.includes("safety policies") || error.message.includes("did not return an image")) {
                throw error;
            }
            if (error.message.includes('API key')) {
                throw new Error("AI service authentication failed. Please check the API key configuration.");
            }
        }
        throw new Error("Failed to generate the new image due to an unexpected issue with the AI service.");
    }
};