import { Animated, View, Text, Image, ScrollView } from 'react-native';

const { createAnimatedComponent } = Animated;

/**
 * Make any component animatable
 */
export function makeAnimatedComponent(WrappedComponent: any) {
  return createAnimatedComponent(WrappedComponent);
}

/**
 * AnimatedBlock : Animated View
 */
export const AnimatedBlock = makeAnimatedComponent(View);
/**
 * AnimatedText : Animated Text
 */
export const AnimatedText = makeAnimatedComponent(Text);
/**
 * AnimatedImage : Animated Image
 */
export const AnimatedImage = makeAnimatedComponent(Image);
/**
 * AnimatedImage : Animated ScrollView
 */
export const AnimatedScrollView = makeAnimatedComponent(ScrollView);
