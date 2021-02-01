import * as React from 'react';

import { StyleSheet, View, Text, Animated, Button } from 'react-native';
import {
  useAnimatedValue,
  AnimatedBlock,
  interpolate,
} from 'react-native-ui-animate';

export default function App() {
  const x = useAnimatedValue(0, { duration: 1000 });

  return (
    <View style={styles.container}>
      <Text>Result</Text>

      <AnimatedBlock
        style={{
          opacity: x.value,
          width: 100,
          height: 100,
          backgroundColor: '#3399ff',
          transform: [
            {
              translateX: interpolate(x.value, [0, 1], [-100, 100]),
            },
          ],
        }}
      ></AnimatedBlock>

      <Button title="Click Me" onPress={() => (x.value = 1)} />
      <Button title="Click Me" onPress={() => (x.value = 0)} />
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
