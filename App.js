import React from 'react';
import {Image, View, Dimensions, StyleSheet, Animated} from 'react-native';
import {PinchGestureHandler} from 'react-native-gesture-handler';

const image = require('./flight.jpg');

const {width, height} = Dimensions.get('window');

const App = () => {
  // コンポーネントのアニメーションにはAnimated.Valueから生成したオブジェクトが必要
  const scale = new Animated.Value(1);

  // panningやscrollingなどのジェスチャーに関するイベントを直接animated values(Animated.valueで生成された値)に結びつけるためのシンタックス
  // 複雑なイベントオブジェクトを簡単に結びつけることに繋がる
  // あと、確かこのやり方じゃないとuseNativeDriverが使えなかった気がする
  // listnerを加えることでコールバックも実装できる
  const onZoomEvent = Animated.event([{nativeEvent: {scale: scale}}], {
    useNativeDriver: true,
    listener: () => console.log('this is listner!'),
  });

  return (
    <View style={styles.container}>
      <PinchGestureHandler onGestureEvent={onZoomEvent}>
        <Animated.Image
          source={image}
          style={[styles.image, {transform: [{scale}]}]}
          resizeMode="contain"
        />
      </PinchGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width,
    height,
  },
});

export default App;
