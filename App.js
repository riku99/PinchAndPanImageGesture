import React, {useRef} from 'react';
import {View, Dimensions, StyleSheet, Animated} from 'react-native';
import {PinchGestureHandler, State} from 'react-native-gesture-handler';

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
  const onZoomEvent = Animated.event([{nativeEvent: {scale: scale}}], {
    useNativeDriver: true,
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

  return (
    <View style={styles.container}>
      <PinchGestureHandler
        onGestureEvent={onZoomEvent}
        onHandlerStateChange={onHandlerStateChange}>
        <Animated.Image
          source={image}
          style={[styles.image, {transform: [{scale: _scale}]}]}
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
