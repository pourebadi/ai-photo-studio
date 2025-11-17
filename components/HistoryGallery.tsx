import React from 'react';

interface HistoryGalleryProps {
  images: string[];
  onViewClick: (image: string) => void;
  onUseAsBaseClick: (image: string) => void;
  onUseAsStyleClick: (image: string) => void;
}

const HistoryGallery: React.FC<HistoryGalleryProps> = ({ images, onViewClick, onUseAsBaseClick, onUseAsStyleClick }) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex-shrink-0 bg-[var(--secondary)] border-t border-[var(--border)]">
      <div className="px-4 md:px-6 py-3">
        <h3 className="text-xs font-semibold uppercase text-[var(--muted-foreground)] mb-3">History</h3>
        <div className="flex space-x-3 overflow-x-auto pb-2 -mb-2">
          {images.map((image, index) => (
            <div key={index} className="flex-shrink-0 w-24 h-24 bg-[var(--muted)] rounded-lg overflow-hidden group relative cursor-pointer shadow-sm border border-[var(--border)]">
              <img 
                src={image} 
                alt={`Generated image ${index + 1}`} 
                className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-40 group-hover:scale-105"
              />
               <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button
                  onClick={() => onViewClick(image)}
                  className="p-2 rounded-full bg-black/50 text-white hover:bg-[var(--primary)] transition-colors transform hover:scale-110"
                  aria-label="View image in fullscreen"
                  title="View Fullscreen"
                >
                  <span className="material-icons-round text-base leading-none">fullscreen</span>
                </button>
                <button
                  onClick={() => onUseAsBaseClick(image)}
                  className="p-2 rounded-full bg-black/50 text-white hover:bg-[var(--primary)] transition-colors transform hover:scale-110"
                  aria-label="Use this image as the new base product image"
                  title="Use as Base Image"
                >
                   <span className="material-icons-round text-base leading-none">image</span>
                </button>
                 <button
                  onClick={() => onUseAsStyleClick(image)}
                  className="p-2 rounded-full bg-black/50 text-white hover:bg-[var(--primary)] transition-colors transform hover:scale-110"
                  aria-label="Use this image as a style reference"
                  title="Use as Style"
                >
                   <span className="material-icons-round text-base leading-none">palette</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryGallery;