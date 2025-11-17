
import React from 'react';
import { AspectRatio, LightingStyle, CameraPerspective, StyleStrength, ImageFile, VisualEffect } from '../types';
import { ASPECT_RATIO_OPTIONS, LIGHTING_STYLE_OPTIONS, CAMERA_PERSPECTIVE_OPTIONS, STYLE_STRENGTH_OPTIONS, VISUAL_EFFECT_OPTIONS } from '../constants';
import ImageUploader from './ImageUploader';
import Spinner from './Spinner';
import Tabs from './Tabs';

interface ControlPanelProps {
  aspectRatio: AspectRatio;
  setAspectRatio: (value: AspectRatio) => void;
  lightingStyle: LightingStyle;
  setLightingStyle: (value: LightingStyle) => void;
  cameraPerspective: CameraPerspective;
  setCameraPerspective: (value: CameraPerspective) => void;
  onStyleImageUpload: (file: File) => void;
  styleImage: ImageFile | null;
  isStyleLoading: boolean;
  styleStrength: StyleStrength;
  setStyleStrength: (value: StyleStrength) => void;
  userPrompt: string;
  setUserPrompt: (value: string) => void;
  resetPrompt: () => void;
  autoPrompt: string;
  isPromptLoading: boolean;
  productImage: ImageFile | null;
  onProductImageUpload: (file: File) => void;
  visualEffects: VisualEffect[];
  setVisualEffects: (effects: VisualEffect[]) => void;
}

type SectionProps = { title: string, children?: React.ReactNode };
const Section = ({ title, children }: SectionProps) => (
  <div className="space-y-4">
    <h3 className="text-sm font-semibold text-[var(--foreground)]">{title}</h3>
    {children}
  </div>
);

type SelectInputProps = { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[], id: string };
const SelectInput = ({ label, value, onChange, options, id }: SelectInputProps) => (
  <div>
    <label htmlFor={id} className="block mb-1.5 text-sm font-medium text-[var(--muted-foreground)]">{label}</label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] text-sm rounded-md focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)] block w-full p-2.5"
    >
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);


const ControlPanel: React.FC<ControlPanelProps> = ({
  aspectRatio,
  setAspectRatio,
  lightingStyle,
  setLightingStyle,
  cameraPerspective,
  setCameraPerspective,
  onStyleImageUpload,
  styleImage,
  isStyleLoading,
  styleStrength,
  setStyleStrength,
  userPrompt,
  setUserPrompt,
  resetPrompt,
  autoPrompt,
  isPromptLoading,
  productImage,
  onProductImageUpload,
  visualEffects,
  setVisualEffects,
}) => {

  const sceneControls = (
    <div className="space-y-4">
       <SelectInput
              id="aspect-ratio"
              label="Aspect Ratio"
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
              options={ASPECT_RATIO_OPTIONS}
          />
          <SelectInput
              id="lighting-style"
              label="Lighting Style"
              value={lightingStyle}
              onChange={(e) => setLightingStyle(e.target.value as LightingStyle)}
              options={LIGHTING_STYLE_OPTIONS}
          />
          <SelectInput
              id="camera-perspective"
              label="Camera Perspective"
              value={cameraPerspective}
              onChange={(e) => setCameraPerspective(e.target.value as CameraPerspective)}
              options={CAMERA_PERSPECTIVE_OPTIONS}
          />
    </div>
  );

  const styleControls = (
     <div className="space-y-4">
          <div className="relative h-48">
              <ImageUploader
                id="style-uploader"
                onImageUpload={onStyleImageUpload}
                imagePreviewUrl={styleImage?.base64 || null}
                placeholderIcon={
                   <span className="material-icons-round text-4xl text-[var(--muted-foreground)]">palette</span>
                }
              />
              {isStyleLoading && !isPromptLoading && (
                  <div className="absolute inset-0 bg-[var(--card)]/80 flex items-center justify-center rounded-lg">
                      <Spinner />
                  </div>
              )}
          </div>
          {styleImage && (
              <SelectInput
                id="style-strength"
                label="Style Influence"
                value={styleStrength}
                onChange={(e) => setStyleStrength(e.target.value as StyleStrength)}
                options={STYLE_STRENGTH_OPTIONS}
              />
          )}
        </div>
  );

  const handleEffectChange = (effect: VisualEffect, checked: boolean) => {
    if (checked) {
        setVisualEffects([...visualEffects, effect]);
    } else {
        setVisualEffects(visualEffects.filter(e => e !== effect));
    }
  };

  const effectsControls = (
      <div className="space-y-3">
          {VISUAL_EFFECT_OPTIONS.map(effect => (
              <label key={effect} className="flex items-center space-x-3 cursor-pointer">
                  <input
                      type="checkbox"
                      checked={visualEffects.includes(effect)}
                      onChange={(e) => handleEffectChange(effect, e.target.checked)}
                      className="h-4 w-4 rounded border-[var(--border)] bg-[var(--secondary)] text-[var(--primary)] focus:ring-1 focus:ring-[var(--ring)]"
                  />
                  <span className="text-sm text-[var(--foreground)]">{effect}</span>
              </label>
          ))}
      </div>
  );

  const tabs = [
    { label: 'Scene', content: sceneControls },
    { label: 'Style', content: styleControls },
    { label: 'Effects', content: effectsControls },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[var(--border)]">
        <h2 className="text-lg font-bold">Studio Panel</h2>
      </div>
      <div className="flex-grow p-4 space-y-6 overflow-y-auto control-panel-scrollbar">
        {/* Prompt Section */}
        <Section title="Prompt">
          <div className="space-y-2 h-48 flex flex-col">
            <div className="flex justify-between items-center flex-shrink-0">
                <label className="text-sm font-medium text-[var(--muted-foreground)]">AI Prompt (Editable)</label>
                <button
                    onClick={resetPrompt}
                    disabled={userPrompt === autoPrompt}
                    className="text-sm text-[var(--primary)] hover:underline transition-colors disabled:text-[var(--muted-foreground)] disabled:cursor-not-allowed"
                    aria-label="Reset prompt to its automatically generated state"
                >
                    Reset
                </button>
            </div>
            <div className="relative flex-grow">
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  className="w-full h-full p-3 bg-[var(--secondary)] border border-[var(--border)] rounded-md text-[var(--foreground)] text-sm focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)] transition-colors resize-none"
                  placeholder="Upload a source image below to automatically generate a prompt..."
                />
                {isPromptLoading && (
                  <div className="absolute inset-0 bg-[var(--card)]/70 flex items-center justify-center rounded-lg">
                      <Spinner />
                  </div>
                )}
            </div>
          </div>
        </Section>

        {/* Source Image Section */}
        <Section title="Source Image">
            <div className="h-48">
                 <ImageUploader
                    id="product-uploader"
                    onImageUpload={onProductImageUpload}
                    imagePreviewUrl={productImage?.base64 || null}
                    placeholderIcon={
                        <span className="material-icons-round text-4xl text-[var(--muted-foreground)]">add_photo_alternate</span>
                    }
                />
            </div>
        </Section>
        
        <Tabs tabs={tabs} />

      </div>
    </div>
  );
};

export default ControlPanel;
