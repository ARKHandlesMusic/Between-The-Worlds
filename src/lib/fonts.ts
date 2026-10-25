import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadJetBrainsMono } from '@remotion/google-fonts/JetBrainsMono';

export const { fontFamily: fontFamilyInter } = loadInter('normal', {
  weights: ['400', '600', '700'],
  subsets: ['latin'],
});

export const { fontFamily: fontFamilyMono } = loadJetBrainsMono('normal', {
  weights: ['400'],
  subsets: ['latin'],
});
