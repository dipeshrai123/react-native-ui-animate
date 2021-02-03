import {
  AnimatedBlock,
  AnimatedImage,
  AnimatedText,
  AnimatedScrollView,
  makeAnimatedComponent,
} from "./Modules";
import { useAnimatedValue, useMountedValue } from "./Animation";
import { interpolate, bInterpolate } from "./Interpolation";

/**
 * Math functions
 * import { clamp, mix, rubberClamp, snapTo, bin, move } from './Math';
 */

export {
  /**
   * Modules
   */
  AnimatedBlock,
  AnimatedImage,
  AnimatedText,
  AnimatedScrollView,
  makeAnimatedComponent,
  /**
   * Animated Values
   */
  useAnimatedValue,
  useMountedValue,
  /**
   * Interpolation
   */
  interpolate,
  bInterpolate,
};
