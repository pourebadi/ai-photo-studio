import { useState, useEffect, useCallback } from 'react';
import { describeStyleImage, describeProductImage } from '../services/geminiService';
import { AspectRatio, CameraPerspective, ImageFile, LightingStyle, StyleStrength } from '../types';

const PROMPT_KEYWORDS = {
  // Aspect Ratios - describes the composition and framing
  [AspectRatio.SQUARE]: 'a perfectly balanced 1:1 square composition, ideal for clean, minimalist presentations',
  [AspectRatio.STANDARD_LANDSCAPE]: 'a classic 4:3 landscape composition, versatile and well-suited for digital displays',
  [AspectRatio.STANDARD_PORTRAIT]: 'an elegant 3:4 portrait composition, perfect for focusing on subject details',
  [AspectRatio.LANDSCAPE]: 'a cinematic 16:9 widescreen composition, creating an expansive, professional feel',
  [AspectRatio.PORTRAIT]: 'a dynamic 9:16 vertical composition, emphasizing height and full-screen mobile impact',
  [AspectRatio.CINEMATIC]: 'an ultra-widescreen 21:9 cinematic composition for a dramatic, panoramic effect',


  // Lighting Styles - describes the mood and quality of light
  [LightingStyle.STUDIO]: 'impeccable studio lighting with controlled highlights and soft, diffused shadows against a neutral background',
  [LightingStyle.NATURAL]: 'soft, gentle natural light, as if from a large window or during the golden hour, creating an organic and authentic feel',
  [LightingStyle.DRAMATIC]: 'high-contrast, dramatic cinematic lighting using chiaroscuro to create deep shadows and bright, focused highlights for a moody atmosphere',
  [LightingStyle.SOFT]: 'dreamy, ethereal, and soft diffused lighting with minimal harsh shadows, creating a gentle glow that smooths surfaces',
  [LightingStyle.HIGH_KEY]: 'bright, energetic high-key lighting that floods the scene, creating a pure white or light background with minimal shadows for an airy, optimistic aesthetic',
  [LightingStyle.LOW_KEY]: 'mysterious and elegant low-key lighting where the subject emerges from a dark background, with selective light carving out details',

  // Camera Perspectives - describes the camera angle and shot type
  [CameraPerspective.EYE_LEVEL]: 'shot from a direct, eye-level perspective for a neutral and relatable view',
  [CameraPerspective.HIGH_ANGLE]: 'shot from a dynamic high-angle, looking down on the subject to showcase its top surfaces and create a sense of scale',
  [CameraPerspective.LOW_ANGLE]: 'shot from a powerful low-angle, looking up at the subject to add a sense of grandeur, importance, and dominance',
  [CameraPerspective.BIRDS_EYE_VIEW]: 'shot directly from above in a "bird\'s-eye view" or "flat lay" style, creating a clean, organized, and graphic composition',
  [CameraPerspective.WORMS_EYE_VIEW]: 'shot from an extreme low-angle "worm\'s-eye view", looking straight up at the subject, making it appear monumental and imposing',
  [CameraPerspective.MACRO]: 'an extreme macro close-up shot that reveals intricate details, fine textures, and craftsmanship with a very shallow depth of field',
  [CameraPerspective.TELEPHOTO_SHOT]: 'shot with a long telephoto lens, which compresses the background and creates a beautifully shallow depth of field with creamy bokeh, isolating the subject with professional precision',
  [CameraPerspective.WIDE_ANGLE_SHOT]: 'shot with a dynamic wide-angle lens, capturing the subject within its broader environment, creating a sense of scale and context, with leading lines and slight perspective distortion for dramatic effect',
  [CameraPerspective.DUTCH_ANGLE]: 'shot with a creative Dutch angle (tilted camera), creating a dynamic, edgy, and visually interesting composition',
};

interface UsePromptProps {
    productImage: ImageFile | null;
    styleImage: ImageFile | null;
    aspectRatio: AspectRatio;
    lightingStyle: LightingStyle;
    cameraPerspective: CameraPerspective;
    styleStrength: StyleStrength;
    setError: (error: string | null) => void;
}

/**
 * Custom hook to manage all prompt-related logic.
 * @param props - The dependencies required for prompt generation.
 * @returns An object containing the prompt state and handlers.
 */
export const usePrompt = ({
    productImage,
    styleImage,
    aspectRatio,
    lightingStyle,
    cameraPerspective,
    styleStrength,
    setError,
}: UsePromptProps) => {
    const [userPrompt, setUserPrompt] = useState<string>('');
    const [autoPrompt, setAutoPrompt] = useState<string>('');
    const [productDescription, setProductDescription] = useState<string>('');
    const [styleDescription, setStyleDescription] = useState<string>('');
    const [isPromptLoading, setIsPromptLoading] = useState<boolean>(false);

    // Effect to analyze the product image when it changes
    useEffect(() => {
        if (!productImage) {
            setProductDescription('');
            return;
        }

        const describe = async () => {
            setIsPromptLoading(true);
            setError(null);
            try {
                const description = await describeProductImage(productImage.base64);
                setProductDescription(description);
            } catch (e) {
                const message = e instanceof Error ? e.message : "An unknown error occurred.";
                setError(`Could not analyze product image: ${message}. Using a default prompt.`);
                setProductDescription('A professional, photorealistic product photograph of the subject.');
            } finally {
                setIsPromptLoading(false);
            }
        };
        describe();
    }, [productImage, setError]);

    // Effect to describe the style image when it changes
    useEffect(() => {
        if (!styleImage) {
            setStyleDescription('');
            return;
        }

        const describe = async () => {
            setIsPromptLoading(true);
            setError(null);
            try {
                const description = await describeStyleImage(styleImage.base64);
                setStyleDescription(description);
            } catch (e) {
                const message = e instanceof Error ? e.message : "An unknown error occurred.";
                setError(`Could not analyze style image: ${message}. Style reference will be ignored.`);
                setStyleDescription('');
            } finally {
                setIsPromptLoading(false);
            }
        };
        describe();
    }, [styleImage, setError]);

    // Memoized function to generate the prompt based on current selections
    const generatePrompt = useCallback(() => {
        const placeholder = !productImage 
            ? "Upload a product to start..."
            : "Analyzing product image...";
        
        if (!productDescription) {
            return placeholder;
        }

        const strengthDescription = {
          [StyleStrength.SUBTLE]: 'subtly inspired by',
          [StyleStrength.BALANCED]: 'that strongly emulates',
          [StyleStrength.STRONG]: 'that is a direct and faithful recreation of',
        };
    
        const sceneDetails = `The final image is ${PROMPT_KEYWORDS[cameraPerspective]}. It is illuminated by ${PROMPT_KEYWORDS[lightingStyle]}. The composition is ${PROMPT_KEYWORDS[aspectRatio]}. The overall image should be high-resolution, visually stunning, and commercially appealing.`;
    
        if (styleDescription) {
          return `Create a new image of the provided product. The base aesthetic for the product itself is: "${productDescription}". The new image should be ${strengthDescription[styleStrength]} the following style: "${styleDescription}". Additionally, incorporate these specific scene requirements: ${sceneDetails}`;
        }
        
        return `${productDescription} ${sceneDetails}`;
      }, [productDescription, styleDescription, lightingStyle, cameraPerspective, aspectRatio, styleStrength, productImage]);


    // Effect to update the auto-prompt and user-prompt
    useEffect(() => {
        const newAutoPrompt = generatePrompt();
        const placeholderTexts = [
            "Analyzing product image...",
            "Upload a product to start..."
        ];

        // Only update the user's prompt if they haven't manually edited it or it's a placeholder
        if (userPrompt === autoPrompt || placeholderTexts.includes(userPrompt)) {
            setUserPrompt(newAutoPrompt);
        }
        setAutoPrompt(newAutoPrompt);
    }, [generatePrompt, userPrompt, autoPrompt]);

    const resetPrompt = useCallback(() => {
        setUserPrompt(autoPrompt);
    }, [autoPrompt]);

    return {
        userPrompt,
        setUserPrompt,
        autoPrompt,
        isPromptLoading,
        resetPrompt,
    };
};