import { Animated, View, Text, Image, ScrollView } from "react-native";

const { createAnimatedComponent } = Animated;

/**
 * makeAnimatedComponent(Component)
 * Make any component animatable
 */
function makeAnimatedComponent(WrappedComponent: any) {
  return createAnimatedComponent(WrappedComponent);
}

/**
 * AnimatedBlock
 * Animated component for View node
 */
const AnimatedBlock = makeAnimatedComponent(View);

/**
 * AnimatedText
 * Animated component for Text node
 */
const AnimatedText = makeAnimatedComponent(Text);

/**
 * AnimatedImage
 * Animated component for Image node
 */
const AnimatedImage = makeAnimatedComponent(Image);

/**
 * AnimatedScrollView
 * Animated component for ScrollView node
 */
const AnimatedScrollView = makeAnimatedComponent(ScrollView);

export {
  AnimatedBlock,
  AnimatedText,
  AnimatedImage,
  AnimatedScrollView,
  makeAnimatedComponent,
};
