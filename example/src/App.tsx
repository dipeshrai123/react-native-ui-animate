import * as React from 'react';

import { StyleSheet, View, Text, Animated, Button, Alert } from 'react-native';
import {
  useAnimatedValue,
  AnimatedBlock,
  interpolate,
} from 'react-native-ui-animate';

export default function App() {
  const [open, setOpen] = React.useState(false);
  const [a, setA] = React.useState(0);
  const x = useAnimatedValue(open, {
    onAnimationEnd: function (value) {
      setA(value);
    },
  });

  return (
    <View style={styles.container}>
      <Text>Result</Text>

      <AnimatedBlock
        style={{
          width: 100,
          height: 100,
          backgroundColor: interpolate(x.value, [0, 1], ['#3399ff', 'red']),
          transform: [
            {
              translateX: interpolate(x.value, [0, 1], [-100, 100]),
            },
          ],
        }}
      ></AnimatedBlock>

      <Text>{a}</Text>

      <Button title="Click Me" onPress={() => setOpen(true)} />
      <Button title="Click Me" onPress={() => setOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
