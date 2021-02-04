import {
  AnimatedBlock,
  AnimatedImage,
  AnimatedText,
  AnimatedScrollView,
  makeAnimatedComponent,
} from "./Modules";
import { useAnimatedValue, useMountedValue } from "./Animation";
import { interpolate, bInterpolate } from "./Interpolation";
import { useScroll, useDrag, useValue } from "./hooks";
import { clamp, mix, rubberClamp, snapTo, bin, move } from "./Math";

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
  /**
   * Hooks
   */
  useScroll,
  useDrag,
  useValue,
  /**
   * Math functions
   */
  clamp,
  mix,
  rubberClamp,
  snapTo,
  bin,
  move,
};
