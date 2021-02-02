import * as React from 'react';
import { Animated } from 'react-native';
import { bin } from './Math';

type AnimatedValueType = number | boolean;
type InitialConfigType = 'ease' | 'elastic' | undefined;

type AnimationConfigType = {
  velocity?: number;
  mass?: number;
  stiffness?: number;
  damping?: number;
};

const isDefined = <T>(value: T): boolean => {
  return value !== undefined && value !== null;
};

const getValue = (value: AnimatedValueType) => {
  if (typeof value === 'number') {
    return value;
  } else if (typeof value === 'boolean') {
    return bin(value);
  } else {
    throw new Error(
      'Invalid Value! Animated value only accepts boolean or number.'
    );
  }
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
  initialValue: number | boolean,
  config?: UseAnimatedValueConfig
) => {
  const _initialValue = getValue(initialValue);
  const _animatedValue = React.useRef(new Animated.Value(_initialValue))
    .current;
  const previousValue = React.useRef<number>(_initialValue);
  const currentValue = React.useRef(_initialValue);

  const onAnimationEnd = config?.onAnimationEnd;
  const listener = config?.listener;
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
        }).start(function ({ finished }) {
          if (finished) {
            onAnimationEnd && onAnimationEnd(currentValue.current);
          }
        });
      } else {
        Animated.spring(_animatedValue, {
          toValue: updatedValue,
          ...springConfig,
          useNativeDriver: false,
        }).start(function ({ finished }) {
          if (finished) {
            onAnimationEnd && onAnimationEnd(currentValue.current);
          }
        });
      }
    }
  };

  React.useEffect(() => {
    if (initialValue !== previousValue.current) {
      _update({ updatedValue: _initialValue });
      previousValue.current = _initialValue;
    }
  }, [initialValue]);

  React.useEffect(() => {
    _animatedValue.addListener(function ({ value }) {
      currentValue.current = value;
      listener && listener(value);
    });
  }, []);

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
