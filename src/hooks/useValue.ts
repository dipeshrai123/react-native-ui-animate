import * as React from "react";
import { Animated } from "react-native";

/**
 * useValue(initialValue)
 * returns memoized value for non-animated value.
 */
function useValue(initialValue: number) {
  const animatedValueRef = React.useRef(new Animated.Value(initialValue))
    .current;

  const _update = (value: number) => {
    animatedValueRef.setValue(value);
  };

  React.useEffect(() => {
    _update(initialValue);
  }, [initialValue]);

  const targetObject: { value: any } = {
    value: initialValue,
  };

  return new Proxy(targetObject, {
    set: function (_, key, value) {
      if (key === "value") {
        _update(value);

        return true;
      }

      throw new Error("You cannot set any other property to animation node.");
    },
    get: function (_, key) {
      if (key === "value") {
        return animatedValueRef;
      }

      throw new Error(
        "You cannot access any other property from animation node.",
      );
    },
  });
}

export { useValue };
