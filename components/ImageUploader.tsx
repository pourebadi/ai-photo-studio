import React, { useCallback, useRef } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  imagePreviewUrl: string | null;
  id: string;
  className?: string;
  placeholderIcon?: React.ReactNode;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imagePreviewUrl, id, className = '', placeholderIcon }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className={`w-full h-full ${className}`}>
        <label
          htmlFor={id}
          className={`flex justify-center items-center w-full h-full border-2 border-dashed border-[var(--border)] rounded-lg cursor-pointer bg-[var(--secondary)] hover:border-[var(--primary)] hover:bg-[var(--muted)] transition-colors duration-300 relative ${imagePreviewUrl ? 'overflow-hidden border-solid' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {imagePreviewUrl ? (
            <img src={imagePreviewUrl} alt="Preview" className="h-full w-full object-contain" />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center text-[var(--muted-foreground)]">
              {placeholderIcon}
              <p className="mt-2 text-sm font-semibold">Upload Photo</p>
              <p className="text-xs">Click or drag & drop</p>
            </div>
          )}
          <input id={id} type="file" className="hidden" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
        </label>
    </div>
  );
};

export default ImageUploader;