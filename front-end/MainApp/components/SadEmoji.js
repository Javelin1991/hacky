import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, Dimensions, Image } from 'react-native';
import { Constants, BarCodeScanner, Permissions } from 'expo';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

export default class SadEmoji extends Component {
  state = {
    hasCameraPermission: null,
    itemList: [],
    item: null,
    scannerReady: true
  };

  componentDidMount() {

  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{
            width: 500,
            height: 500,
            backgroundColor: 'white',
            resizeMode: 'contain',
          }}
          defaultSource={require('../assets/images/sad.png')}
          source={require('../assets/images/sad.png')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
