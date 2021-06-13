# React Native UI Animate

React Native library for gestures and animation

## Installation

```sh
npm install react-native-ui-animate
```

or
Install with yarn:

```sh
yarn add react-native-ui-animate
```

### Getting Started

`react-native-ui-animate` provides lots of easy to use APIs to create smooth animations and gestures for React Native.

```javascript
import { AnimatedBlock, useAnimatedValue } from "react-native-ui-animate";

export default function () {
  const opacity = useAnimatedValue(0); // It initializes opacity object with value 0.

  return (
    <View>
      {/* AnimatedBlock component should be used with useAnimatedValue() */}
      <AnimatedBlock
        style={{
          opacity: opacity.value, // value property should be passed
          width: 100,
          padding: 20,
          background: "#39F",
        }}
      >
        ANIMATED
      </AnimatedBlock>

      {/* Animating from 0 to 1 is very simple just assign opacity.value = 1 */}
      <TouchableOpacity onPress={() => (opacity.value = 1)}>
        <Text>Animate Me</Text>
      </TouchableOpacity>
    </View>
  );
}
```

Animates opacity from 0 to 1.

#### `useAnimatedValue()`

`useAnimatedValue()` is very flexible and powerful hook that lets you define animated values. It accepts a number and returns a node with same value on `value` property. Whenever `value` property is assigned to another value, it auto animates from one value to another.

```javascript
const opacity = useAnimatedValue(0); // initialize with 0 opacity

...
style={{
    opacity: opacity.value // access with `.value`
}}
...

...
onPress={() => opacity.value = 1} // Assignment
...
```

### `AnimatedBlock`

`AnimatedBlock` is a `View` component which can accept the animation node from `useAnimatedValue()` hook.

```javascript
const width = useAnimatedValue(100);

<AnimatedBlock
  style={{
    width: width.value,
    height: 100,
    backgroundColor: "#39f",
  }}
/>;
```

### `interpolate`

The `interpolate()` function allows animated node value to map from input ranges to different output ranges. By default, it will extrapolate the curve beyond the ranges given, but you can also have it clamp the output value.

```javascript
import {
  useAnimatedValue,
  AnimatedBlock,
  interpolate,
} from "react-native-ui-animate";

const width = useAnimatedValue(100);

<AnimatedBlock
  style={{
    width: width.value,
    height: 100,
    backgroundColor: interpolate(width.value, [100, 200], ["red", "blue"]),
  }}
/>;
```

`backgroundColor` is interpolated from input range `[100, 200]` to output range `["red", "blue"]`. So, when the width changes from 100 to 200, `backgroundColor` will change from `red` to `blue`.

## License

MIT
