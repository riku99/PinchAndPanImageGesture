import {transform} from '@babel/core';
import React, {useRef} from 'react';
import {View, Dimensions, StyleSheet, Animated} from 'react-native';
import {
  PinchGestureHandler,
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';

const image = require('./flight.jpg');

const {width, height} = Dimensions.get('window');

const App = () => {
  // コンポーネントのアニメーションにはAnimated.Valueから生成したオブジェクトが必要
  const scale = useRef(new Animated.Value(1)).current;
  const _scale = useRef(new Animated.Value(1)).current;

  const totalDiff = useRef(0);
  const scaleRef = useRef(1);

  scale.addListener(e => {
    const diff = (1 - e.value) / 3;
    totalDiff.current = diff;
    const value = scaleRef.current - diff;
    _scale.setValue(value);
  });

  // panningやscrollingなどのジェスチャーに関するイベントを直接animated values(Animated.valueで生成された値)に結びつけるためのシンタックス
  // 複雑なイベントオブジェクトを簡単に結びつけることに繋がる
  // あと、確かこのやり方じゃないとuseNativeDriverが使えなかった気がする
  //listnerを加えることでコールバックも実装できる;
  // gesture-handlerをネストする場合はuseNativeDriverはtrueにできない
  const onZoomEvent = Animated.event([{nativeEvent: {scale: scale}}], {
    useNativeDriver: false,
    listener: e => {
      //console.log('Eventの値' + e.nativeEvent.scale);
    },
  });

  const onHandlerStateChange = e => {
    if (e.nativeEvent.state === State.END || State.CANCELLED) {
      scaleRef.current -= totalDiff.current;
      totalDiff.current = 0;
    }
  };

  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const onPanGesture = Animated.event(
    [{nativeEvent: {translationX: translateX, translationY: translateY}}],
    {useNativeDriver: false},
  );

  return (
    <View style={styles.container}>
      <PinchGestureHandler
        onGestureEvent={onZoomEvent}
        onHandlerStateChange={onHandlerStateChange}>
        <PanGestureHandler onGestureEvent={onPanGesture}>
          <Animated.Image
            source={image}
            style={[
              styles.image,
              {transform: [{scale: _scale}, {translateX}, {translateY}]},
            ]}
            resizeMode="contain"
          />
        </PanGestureHandler>
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
