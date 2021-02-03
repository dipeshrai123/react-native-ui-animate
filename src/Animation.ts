import * as React from "react";
import { Animated } from "react-native";
import { bin } from "./Math";

type AnimatedValueType = number | boolean;
type InitialConfigType = "ease" | "elastic" | "stiff" | "wooble" | undefined;

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
  if (typeof value === "number") {
    return value;
  } else if (typeof value === "boolean") {
    return bin(value);
  } else {
    throw new Error(
      "Invalid Value! Animated value only accepts boolean or number.",
    );
  }
};

const getInitialConfig = (
  animationType: InitialConfigType,
): {
  mass: number;
  stiffness: number;
  damping: number;
} => {
  switch (animationType) {
    case "elastic":
      return { mass: 1, stiffness: 180, damping: 16 };

    case "stiff":
      return { mass: 1, stiffness: 350, damping: 16 };

    case "wooble":
      return { mass: 1, stiffness: 250, damping: 8 };

    case "ease":
    default:
      return { mass: 1, stiffness: 100, damping: 26 };
  }
};

interface UseAnimatedValueConfig {
  animationType?: InitialConfigType;
  duration?: number;
  veloctiy?: number;
  mass?: number;
  friction?: number; // damping
  tension?: number; // stiffness
  onAnimationEnd?: (value: number) => void;
  listener?: (value: number) => void;
  immediate?: boolean;
  useNativeDriver?: boolean; // only for react-native ( opacity, transform )
}

/**
 * useAnimatedValue(initialValue, config)
 * Animates the value from one state to another
 */
const useAnimatedValue = (
  initialValue: number | boolean,
  config?: UseAnimatedValueConfig,
) => {
  const _initialValue = getValue(initialValue);
  const _animatedValue = React.useRef(new Animated.Value(_initialValue))
    .current;
  const previousValue = React.useRef<number>(_initialValue);
  const currentValue = React.useRef(_initialValue);

  const useNativeDriver = !!config?.useNativeDriver;
  const onAnimationEnd = config?.onAnimationEnd;
  const listener = config?.listener;
  let duration = config?.duration;
  if (isDefined(config?.immediate) && !!config?.immediate) {
    duration = 0;
  }

  // spring configuration
  const animationType = config?.animationType ?? "ease";

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

  const _update = ({
    updatedValue,
    immediate,
  }: {
    updatedValue?: number;
    immediate?: boolean;
  }) => {
    if (updatedValue !== undefined) {
      // For timing animation
      if (isDefined(duration)) {
        Animated.timing(_animatedValue, {
          toValue: updatedValue,
          duration,
          useNativeDriver,
        }).start(function ({ finished }) {
          if (finished) {
            onAnimationEnd && onAnimationEnd(currentValue.current);
          }
        });
      } else {
        Animated.spring(_animatedValue, {
          toValue: updatedValue,
          ...springConfig,
          useNativeDriver,
        }).start(function ({ finished }) {
          if (finished) {
            onAnimationEnd && onAnimationEnd(currentValue.current);
          }
        });
      }
    } else if (immediate !== undefined) {
      if (immediate) {
        Animated.timing(_animatedValue, {
          toValue: previousValue.current,
          duration: 0,
          useNativeDriver,
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
      if (key === "value") {
        if (value !== previousValue.current) {
          previousValue.current = value;

          _update({
            updatedValue: value,
          });
        }

        return true;
      }

      if (key === "immediate") {
        _update({
          immediate: value,
        });

        return true;
      }

      throw new Error("You cannot set any other property to animation node.");
    },
    get: function (_, key) {
      if (key === "value") {
        return _animatedValue;
      }

      throw new Error(
        "You cannot access any other property from animation node.",
      );
    },
  });
};

interface UseMountedValueConfig extends UseAnimatedValueConfig {
  enterDuration?: number;
  exitDuration?: number;
}

/**
 * useMountedValue(initialState, phases, config)
 * Animates the value from one state to another
 * mounts the component when animation completes
 */
const useMountedValue = (
  initialState: boolean,
  phases: [number, number, number],
  config?: UseMountedValueConfig,
) => {
  const [fromOpen, setFromOpen] = React.useState(false);
  const [entered, setEntered] = React.useState(false);
  const [from, enter, leave] = React.useRef(phases).current;

  const _animatedValue = React.useRef({ value: new Animated.Value(from) })
    .current;
  const currentValue = React.useRef(from);
  const toValue = React.useRef(from);
  const finalValue = React.useRef(from);

  const useNativeDriver = !!config?.useNativeDriver;
  const onAnimationEnd = config?.onAnimationEnd;
  const listener = config?.listener;
  let duration = config?.duration;

  if (isDefined(config?.immediate) && !!config?.immediate) {
    duration = 0;
  }

  let enterDuration = config?.enterDuration;
  let exitDuration = config?.exitDuration;

  if (isDefined(duration)) {
    enterDuration = duration;
    exitDuration = duration;
  }

  // spring configuration
  const animationType = config?.animationType ?? "ease";

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

  const enterLeaveAnimation = (
    value: boolean,
    callback: (() => void) | null,
  ) => {
    if (finalValue.current !== toValue.current) {
      finalValue.current = toValue.current;

      if (isDefined(enterDuration) && value) {
        Animated.timing(_animatedValue.value, {
          toValue: enter,
          duration: enterDuration,
          useNativeDriver,
        }).start(function ({ finished }) {
          if (finished) {
            onAnimationEnd && onAnimationEnd(currentValue.current);

            if (currentValue.current === leave) {
              setEntered(false);
            } else if (currentValue.current === enter) {
              callback && callback();
            }
          }
        });
      } else if (isDefined(exitDuration) && !value) {
        Animated.timing(_animatedValue.value, {
          toValue: leave,
          duration: exitDuration,
          useNativeDriver,
        }).start(function ({ finished }) {
          if (finished) {
            onAnimationEnd && onAnimationEnd(currentValue.current);

            if (currentValue.current === leave) {
              setEntered(false);
            } else if (currentValue.current === enter) {
              callback && callback();
            }
          }
        });
      } else {
        Animated.spring(_animatedValue.value, {
          toValue: value ? enter : leave,
          ...springConfig,
          useNativeDriver,
        }).start(function ({ finished }) {
          if (finished) {
            onAnimationEnd && onAnimationEnd(currentValue.current);

            if (currentValue.current === leave) {
              setEntered(false);
            } else if (currentValue.current === enter) {
              callback && callback();
            }
          }
        });
      }
    }
  };

  React.useEffect(() => {
    _animatedValue.value.addListener(function ({ value }) {
      currentValue.current = value;
      listener && listener(value);
    });
  }, []);

  React.useEffect(() => {
    if (initialState) {
      toValue.current = enter;
      setFromOpen(true);
      setEntered(true);
      enterLeaveAnimation(true, null);
    } else {
      toValue.current = leave;
      enterLeaveAnimation(false, function () {
        setEntered(false);
      });
    }
  }, [initialState]);

  return function (
    fn: (
      animatedValue: { value: Animated.Value },
      mounted: boolean,
    ) => React.ReactNode,
  ) {
    return fn(_animatedValue, entered && fromOpen);
  };
};

export { useAnimatedValue, useMountedValue };
