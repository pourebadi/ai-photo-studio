
export enum AspectRatio {
  SQUARE = '1:1',
  STANDARD_LANDSCAPE = '4:3',
  STANDARD_PORTRAIT = '3:4',
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16',
  CINEMATIC = '21:9',
}

export enum LightingStyle {
  STUDIO = 'Studio lighting',
  NATURAL = 'Natural light',
  DRAMATIC = 'Dramatic cinematic lighting',
  SOFT = 'Soft, diffused lighting',
  HIGH_KEY = 'High-key lighting',
  LOW_KEY = 'Low-key lighting',
}

export enum CameraPerspective {
  EYE_LEVEL = 'Eye-level shot',
  HIGH_ANGLE = 'High-angle shot',
  LOW_ANGLE = 'Low-angle shot',
  BIRDS_EYE_VIEW = "Bird's-eye view (Flat lay)",
  WORMS_EYE_VIEW = "Worm's-eye view",
  MACRO = 'Macro close-up shot',
  TELEPHOTO_SHOT = 'Telephoto compression shot',
  WIDE_ANGLE_SHOT = 'Wide-angle environmental shot',
  DUTCH_ANGLE = 'Dutch angle',
}

export enum StyleStrength {
  SUBTLE = 'Subtle',
  BALANCED = 'Balanced',
  STRONG = 'Strong',
}

export interface ImageFile {
  file: File;
  base64: string;
}