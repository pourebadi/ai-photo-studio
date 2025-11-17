
import React, { useState, useCallback, useEffect } from 'react';
import { AspectRatio, CameraPerspective, ImageFile, LightingStyle, StyleStrength, VisualEffect } from './types';
import { fileToBase64, base64ToFile } from './utils/imageUtils';
import ControlPanel from './components/ControlPanel';
import Spinner from './components/Spinner';
import HistoryGallery from './components/HistoryGallery';
import Lightbox from './components/Lightbox';
import ErrorDisplay from './components/ErrorDisplay';
import { usePrompt } from './hooks/usePrompt';
import { useImageGenerator } from './hooks/useImageGenerator';
import Header from './components/Header';
import SkeletonLoader from './components/SkeletonLoader';

const App: React.FC = () => {
  const [productImage, setProductImage] = useState<ImageFile | null>(null);
  const [styleImage, setStyleImage] = useState<ImageFile | null>(null);
  
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [lightingStyle, setLightingStyle] = useState<LightingStyle>(LightingStyle.STUDIO);
  const [cameraPerspective, setCameraPerspective] = useState<CameraPerspective>(CameraPerspective.EYE_LEVEL);
  const [styleStrength, setStyleStrength] = useState<StyleStrength>(StyleStrength.BALANCED);
  const [visualEffects, setVisualEffects] = useState<VisualEffect[]>([]);
  
  const [history, setHistory] = useState<string[]>([]);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  
  const { 
    generatedImage, 
    setGeneratedImage, 
    isLoading, 
    error, 
    setError, 
    generateImage 
  } = useImageGenerator();
  
  const { 
    userPrompt, 
    setUserPrompt, 
    autoPrompt, 
    isPromptLoading, 
    resetPrompt 
  } = usePrompt({
    productImage,
    styleImage,
    aspectRatio,
    lightingStyle,
    cameraPerspective,
    styleStrength,
    visualEffects,
    setError
  });

  const handleProductImageUpload = useCallback(async (file: File) => {
    const base64 = await fileToBase64(file);
    setProductImage({ file, base64 });
    setGeneratedImage(null);
  }, [setGeneratedImage]);

  const handleStyleImageUpload = useCallback(async (file: File) => {
    const base64 = await fileToBase64(file);
    setStyleImage({ file, base64 });
  }, []);

  const handleGenerateClick = async () => {
    if (!productImage) {
      setError("Please upload a source image in the Studio Panel.");
      return;
    }
    const newImage = await generateImage(productImage, userPrompt, aspectRatio);
    if (newImage) {
      setHistory(prev => [newImage, ...prev].slice(0, 20)); // Keep history to 20 items
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    const mimeType = generatedImage.match(/data:(image\/\w+);/)?.[1] || 'image/png';
    const extension = mimeType.split('/')[1];
    link.download = `ai-generated-image.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUseAsBaseClick = useCallback(async (imageBase64: string) => {
    try {
      const filename = `history-image-${Date.now()}.png`;
      const imageFile = base64ToFile(imageBase64, filename);
      
      setProductImage({ file: imageFile, base64: imageBase64 });
      setGeneratedImage(null);
      window.scrollTo(0, 0);
    } catch (e) {
      const message = e instanceof Error ? e.message : "An unknown error occurred.";
      console.error("Failed to use history image as base:", e);
      setError(`Failed to use the selected image. ${message}`);
    }
  }, [setGeneratedImage, setError]);

  const handleUseAsStyleClick = useCallback(async (imageBase64: string) => {
    try {
      const filename = `style-image-${Date.now()}.png`;
      const imageFile = base64ToFile(imageBase64, filename);
      setStyleImage({ file: imageFile, base64: imageBase64 });
    } catch (e) {
      const message = e instanceof Error ? e.message : "An unknown error occurred.";
      console.error("Failed to use history image as style:", e);
      setError(`Failed to use the selected image as style. ${message}`);
    }
  }, [setError]);

  return (
    <div className="flex flex-col h-screen font-sans bg-[var(--background)] text-[var(--foreground)]">
      <Header theme={theme} setTheme={setTheme} />
      
      <div className="flex-grow flex flex-col min-h-0">
        <main className="flex-grow flex gap-6 p-4 md:p-6 min-h-0">
          
          {/* Main Area: AI Canvas */}
          <div className="flex-1 flex flex-col min-h-0 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-sm p-3">
              <div className="flex-shrink-0 flex justify-between items-center mb-2">
                  <h2 className="text-sm font-semibold text-[var(--muted-foreground)]">AI Canvas</h2>
                  {generatedImage && !isLoading && (
                     <button
                        onClick={handleDownload}
                        className="flex items-center gap-1.5 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                      >
                        <span className="material-icons-round text-base leading-none">download</span>
                        Download
                    </button>
                  )}
              </div>
              <div className="flex-grow min-h-0 rounded-lg bg-[var(--secondary)]">
                  {generatedImage && !isLoading && (
                      <img
                          src={generatedImage}
                          alt="Generated result"
                          className="w-full h-full object-contain rounded-lg cursor-pointer"
                          onClick={() => setLightboxImage(generatedImage)}
                      />
                  )}
                  {!generatedImage && !isLoading && 
                      <div className="w-full h-full flex flex-col items-center justify-center text-center text-[var(--muted-foreground)] rounded-lg p-4">
                          <span className="material-icons-round text-5xl mb-4">image</span>
                          <p className="text-sm font-semibold">Your masterpiece will appear here</p>
                          <p className="text-xs mt-1">Upload a source image and click 'Generate' to begin</p>
                      </div>
                  }
                  {isLoading && <SkeletonLoader />}
              </div>
          </div>


          {/* Right Column: Controls */}
          <div className="w-full max-w-sm flex-shrink-0 flex flex-col">
            <div className="flex-grow min-h-0 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-sm">
                <ControlPanel
                  productImage={productImage}
                  onProductImageUpload={handleProductImageUpload}
                  aspectRatio={aspectRatio}
                  setAspectRatio={setAspectRatio}
                  lightingStyle={lightingStyle}
                  setLightingStyle={setLightingStyle}
                  cameraPerspective={cameraPerspective}
                  setCameraPerspective={setCameraPerspective}
                  onStyleImageUpload={handleStyleImageUpload}
                  styleImage={styleImage}
                  isStyleLoading={isPromptLoading}
                  styleStrength={styleStrength}
                  setStyleStrength={setStyleStrength}
                  userPrompt={userPrompt}
                  setUserPrompt={setUserPrompt}
                  resetPrompt={resetPrompt}
                  autoPrompt={autoPrompt}
                  isPromptLoading={isPromptLoading}
                  visualEffects={visualEffects}
                  setVisualEffects={setVisualEffects}
                />
            </div>
            <div className="flex-shrink-0 pt-4 space-y-2">
              <ErrorDisplay message={error} onDismiss={() => setError(null)} />
              <button
                onClick={handleGenerateClick}
                disabled={isLoading || !productImage || isPromptLoading}
                className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-[1.02] disabled:bg-opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center shadow-lg shadow-blue-500/20 dark:shadow-blue-400/10"
              >
                {isLoading ? <Spinner /> : (
                    <div className="flex items-center gap-2">
                        <span className="material-icons-round text-xl">auto_awesome</span>
                      <span>Generate</span>
                    </div>
                )}
              </button>
            </div>
          </div>
        </main>

        <HistoryGallery 
          images={history} 
          onViewClick={setLightboxImage} 
          onUseAsBaseClick={handleUseAsBaseClick}
          onUseAsStyleClick={handleUseAsStyleClick}
        />
      </div>
      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
};

export default App;
