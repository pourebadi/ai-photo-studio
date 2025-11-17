
import React from 'react';

interface LightboxProps {
  image: string | null;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ image, onClose }) => {
  if (!image) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <button 
        className="absolute top-4 right-4 text-white text-3xl font-bold"
        onClick={onClose}
      >
        &times;
      </button>
      <div className="max-w-screen-lg max-h-screen-lg p-4" onClick={(e) => e.stopPropagation()}>
        <img src={image} alt="Full resolution" className="max-w-full max-h-[90vh] object-contain" />
      </div>
    </div>
  );
};

export default Lightbox;
