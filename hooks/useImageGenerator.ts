
import { useState, useCallback } from 'react';
import { generateEditedImage } from '../services/geminiService';
import { resizeImageToAspectRatio } from '../utils/imageUtils';
import { AspectRatio, ImageFile } from '../types';

/**
 * Custom hook to manage the image generation process.
 * @returns An object containing the generated image state, loading/error states, and the generate function.
 */
export const useImageGenerator = () => {
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const generateImage = useCallback(async (
        productImage: ImageFile,
        prompt: string,
        aspectRatio: AspectRatio
    ): Promise<string | null> => {
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const resizedProductImageBase64 = await resizeImageToAspectRatio(productImage.file, aspectRatio);
            const newImage = await generateEditedImage(resizedProductImageBase64, prompt);
            setGeneratedImage(newImage);
            return newImage;
        } catch (e) {
            const message = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        generatedImage,
        setGeneratedImage,
        isLoading,
        error,
        setError,
        generateImage,
    };
};
