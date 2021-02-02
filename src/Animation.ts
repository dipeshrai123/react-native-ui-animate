import * as React from 'react';
import { Animated } from 'react-native';

const isDefined = <T>(value: T): boolean => {
  return value !== undefined && value !== null;
};

type InitialConfigType = 'ease' | 'elastic' | undefined;

type AnimationConfigType = {
  velocity?: number;
  mass?: number;
  stiffness?: number;
  damping?: number;
};

const getInitialConfig = (animationType: InitialConfigType) => {
  switch (animationType) {
    case 'elastic':
      return { mass: 1, stiffness: 180, damping: 16 };

    case 'ease':
    default:
      return { mass: 1, stiffness: 100, damping: 26 };
  }
};

export interface UseAnimatedValueConfig {
  animationType?: InitialConfigType;
  duration?: number;
  veloctiy?: number;
  mass?: number;
  friction?: number; // damping
  tension?: number; // stiffness
  onAnimationEnd?: (value: number) => void;
  listener?: (value: number) => void;
  immediate?: boolean;
}

/**
 * useAnimatedValue(initialValue, config)
 * Animates the value from one state to another
 */
export const useAnimatedValue = (
  initialValue: number,
  config?: UseAnimatedValueConfig
) => {
  const _animatedValue = React.useRef(new Animated.Value(initialValue)).current;
  const previousValue = React.useRef<number>();

  // const onAnimationEnd = config?.onAnimationEnd;
  // const listener = config?.listener;
  let duration = config?.duration;
  if (isDefined(config?.immediate) && !!config?.immediate) {
    duration = 0;
  }

  // spring configuration
  const animationType = config?.animationType ?? 'ease';

  const mass = config?.mass;
  const stiffness = config?.tension;
  const damping = config?.friction;
  const velocity = config?.veloctiy;

  const initialConfig = getInitialConfig(animationType);
  const restConfig: AnimationConfigType = {};

  if (isDefined(mass)) restConfig.mass = mass;
  if (isDefined(stiffness)) restConfig.stiffness = stiffness;
  if (isDefined(damping)) restConfig.damping = damping;
  if (isDefined(velocity)) restConfig.velocity = velocity;

  const springConfig = {
    ...initialConfig,
    ...restConfig,
  };

  const _update = ({ updatedValue }: { updatedValue: number }) => {
    if (updatedValue !== undefined) {
      // For timing animation
      if (isDefined(duration)) {
        Animated.timing(_animatedValue, {
          toValue: updatedValue,
          duration,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.spring(_animatedValue, {
          toValue: updatedValue,
          ...springConfig,
          useNativeDriver: false,
        }).start();
      }
    }
  };

  const targetObject: { value: any; immediate: boolean } = {
    value: initialValue,
    immediate: false,
  };

  return new Proxy(targetObject, {
    set: function (_, key, value) {
      if (key === 'value') {
        if (value !== previousValue.current) {
          previousValue.current = value;

          _update({
            updatedValue: value,
          });
        }

        return true;
      }

      throw new Error('You cannot set any other property to animation node.');
    },
    get: function (_, key) {
      if (key === 'value') {
        return _animatedValue;
      }

      throw new Error(
        'You cannot access any other property from animation node.'
      );
    },
  });
};
