import { Animated } from "react-native";

type ExtrapolateType = "identity" | "extend" | "clamp";

interface ExtrapolateConfig {
  extrapolate?: ExtrapolateType;
  extrapolateRight?: ExtrapolateType;
  extrapolateLeft?: ExtrapolateType;
}

/**
 * interpolate() interpolates the value from one input range to another output range
 */
const interpolate = (
  value: Animated.Value,
  inputRange: Array<number>,
  outputRange: number[] | string[],
  extrapolateConfig?: ExtrapolateConfig,
) => {
  return value.interpolate({
    inputRange,
    outputRange,
    ...extrapolateConfig,
  });
};

/**
 * interpolate() interpolates the value from input range 0 - 1 to another output range
 */
const bInterpolate = (
  value: Animated.Value,
  outputRange: number[] | string[],
  extrapolateConfig?: ExtrapolateConfig,
) => {
  return interpolate(value, [0, 1], outputRange, extrapolateConfig);
};

export { interpolate, bInterpolate };
