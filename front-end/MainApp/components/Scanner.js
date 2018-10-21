import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, Dimensions, Image } from 'react-native';
import { Constants, BarCodeScanner, Permissions } from 'expo';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;


export default class Scanner extends Component {
  state = {
    hasCameraPermission: null,
    itemList: [],
    item: null,
    scannerReady: true
  };

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  translateBarcode = async (barcode) => {
    try {
      console.log("HN DEBUG barcode", barcode);
      const ITEMS_LIST = {
          "0094187018385"   :   [{
            "image_url": "https://images.barcodelookup.com/5103/51033191-1.jpg",
            "price": "$11.09",
            "product_name": "Convenience Valet Crest Tpaste Travel Tbrush Combo",
            "store_name": "Walmart.com",
          }],
          "0036600828010": [{
            "image_url": "https://images.barcodelookup.com/324/3246818-1.jpg",
            "price": "$1.69",
            "product_name": "ChapStick Lip Moisturizer SPF 12 0.15 Oz",
            "store_name": "Walmart",
          }],
          "0722252102003": [{
           "image_url": "https://images.barcodelookup.com/1413/14137045-1.jpg",
           "price": "$1.50",
           "product_name": "Clif Bar, Energy Bar, Cool Mint Chocolate",
           "store_name": "Walmart",
         }],
           "0028400091565": [{
            "image_url": "https://images.barcodelookup.com/3181/31817934-1.jpg",
            "price": "$1.48",
            "product_name": "Lay's ® Classic Potato Chips 1.5 Oz. Bag",
            "store_name": "Wal-Mart.com USA, LLC",
        }]
      }
      let response = ITEMS_LIST[`${barcode}`];

      if (response === null || response == undefined) {
          // const url = `https://api.barcodelookup.com/v2/products?barcode=${barcode}&formatted=y&key=ehqjkfnjvfz8di1s30g7v5jceg0pov`;
          const url = `https://api.barcodelookup.com/v2/products?barcode=${barcode}&formatted=y&key=1ydacz2lvfndqbihnl4nlzvff4z3el`;
          realTimeResponse = await fetch(url);
          if (realTimeResponse && realTimeResponse.status === 404) {
                Alert.alert(
                  "Sorry, the item can't be tracked. Please try again later or scan another item.",
                );
                setTimeout(() => {
                  this.setState({
                      scannerReady: true
                  })
                }, 500);
              return;
          }
          realTimeResponseJson = await realTimeResponse.json();
          const currency_symbol = realTimeResponseJson.products[0].stores[0].currency_symbol;
          const store_price = realTimeResponseJson.products[0].stores[0].store_price;
          const price = `${currency_symbol}${store_price}`;
          const listObj = {
            store_name: realTimeResponseJson.products[0].stores[0].store_name,
            product_name: realTimeResponseJson.products[0].product_name,
            image_url: realTimeResponseJson.products[0].images[0],
            price: price,
            barcode: barcode
         }
         console.log("HN DEBUG listObj", listObj);
         this.props.createListItem && this.props.createListItem(listObj.image_url, listObj.product_name, listObj.price, listObj.store_name);
      } else {
          let responseJson = response[0];
          if (responseJson) {
            this.props.createListItem && this.props.createListItem(responseJson.image_url, responseJson.product_name, responseJson.price, responseJson.store_name);
          }
      }
      const soundObject =  new Expo.Audio.Sound();
      try {
        soundObject.loadAsync(require('../assets/beep.mp3'))
        .then((res) => {
            soundObject.playAsync();
        })
        .then(() => {
            setTimeout(() => {
              this.setState({
                  scannerReady: true
              })
            }, 500);
        });
        // Your sound is playing!
      } catch (error) {
        // An error occurred!
      }
    } catch (error) {
      console.error(error);
    }
  }

  _handleBarCodeRead = data => {
    if (this.state.scannerReady) {
        this.setState({
            scannerReady: false
        });
        data && data.data && this.translateBarcode(data.data);
    }
    // Alert.alert(
    //   'Scan successful!',
    //   JSON.stringify(data)
    // );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.hasCameraPermission === null ?
          <Text>Requesting for camera permission</Text> :
          this.state.hasCameraPermission === false ?
            <Text>Camera permission is not granted</Text> :
            <View>
              <BarCodeScanner
                onBarCodeRead={this._handleBarCodeRead}
                style={{ height: HEIGHT/3 }}
              />
              <View style={{ position: 'absolute', top: 24, left: 24, borderRadius: 4, borderColor: 'yellow', borderWidth: 2, backgroundColor: 'transparent', width: WIDTH - 50, height: HEIGHT/3 - 50 }}/>
            </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ecf0f1',
  },
});
