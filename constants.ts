
import { AspectRatio, LightingStyle, CameraPerspective, StyleStrength } from './types';

export const ASPECT_RATIO_OPTIONS = [
  AspectRatio.SQUARE,
  AspectRatio.STANDARD_LANDSCAPE,
  AspectRatio.STANDARD_PORTRAIT,
  AspectRatio.LANDSCAPE,
  AspectRatio.PORTRAIT,
  AspectRatio.CINEMATIC,
];
export const LIGHTING_STYLE_OPTIONS = Object.values(LightingStyle);
export const CAMERA_PERSPECTIVE_OPTIONS = Object.values(CameraPerspective);
export const STYLE_STRENGTH_OPTIONS = Object.values(StyleStrength);