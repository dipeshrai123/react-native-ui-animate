import * as React from 'react';
import { Animated } from 'react-native';

type InitialConfigType = 'ease' | 'elastic' | undefined;

export interface UseAnimatedValueConfig {
  animationType?: InitialConfigType;
  duration?: number;
  veloctiy?: number;
  mass?: number;
  friction?: number;
  tension?: number;
  onAnimationEnd?: (value: number) => void;
  listener?: (value: number) => void;
  immediate?: boolean;
}

/**
 * useAnimatedValue()
 */
export const useAnimatedValue = (
  initialValue: number,
  config?: UseAnimatedValueConfig
) => {
  const _animatedValue = React.useRef(new Animated.Value(initialValue)).current;
  const duration = config?.duration ?? 0;

  const _update = ({ updatedValue }: { updatedValue: number }) => {
    if (updatedValue !== undefined) {
      Animated.timing(_animatedValue, {
        toValue: updatedValue,
        duration,
        useNativeDriver: false,
      }).start();
    }
  };

  const targetObject: { value: any } = {
    value: initialValue,
  };

  return new Proxy(targetObject, {
    set: function (_, key, value) {
      if (key === 'value') {
        _update({
          updatedValue: value,
        });

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
