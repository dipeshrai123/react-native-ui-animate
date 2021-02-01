import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { useAnimatedValue } from 'react-native-ui-animate';

// const { useAnimatedValue } = UIAnimate;

export default function App() {
  const x = useAnimatedValue(10);
  console.log(x);

  return (
    <View style={styles.container}>
      <Text>Result: {x.value}</Text>
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
