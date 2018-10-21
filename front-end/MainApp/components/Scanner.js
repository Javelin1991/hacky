import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, Image } from 'react-native';
import { Constants, BarCodeScanner, Permissions } from 'expo';

export default class Scanner extends Component {
  state = {
    hasCameraPermission: null,
    itemList: [],
    item: null
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

//
//   HN DEBUG responseJson Object {
//   "products": Array [
//     Object {
//       "actor": "",
//       "artist": "",
//       "asin": "",
//       "audience_rating": "",
//       "author": "",
//       "barcode_formats": "UPC 028400091565, EAN 0028400091565",
//       "barcode_number": "0028400091565",
//       "barcode_type": "EAN",
//       "brand": "Lay's",
//       "category": "Food, Beverages & Tobacco > Food Items > Bakery > Cookies",
//       "color": "",
//       "description": "Lay's, Classic Potato Chips, 1.5 OZ.",
//       "director": "",
//       "features": Array [],
//       "format": "",
//       "genre": "",
//       "height": "",
//       "images": Array [
//         "https://images.barcodelookup.com/3181/31817934-1.jpg",
//       ],
//       "ingredients": "",
//       "label": "",
//       "length": "",
//       "manufacturer": "Frito Lay",
//       "model": "",
//       "mpn": "0002840009156",
//       "nutrition_facts": "",
//       "package_quantity": "",
//       "product_name": "Lay's ® Classic Potato Chips 1.5 Oz. Bag",
//       "publisher": "",
//       "release_date": "",
//       "reviews": Array [],
//       "size": "",
//       "stores": Array [
//         Object {
//           "currency_code": "USD",
//           "currency_symbol": "$",
//           "product_url": "http://www.walmart.com/ip/Lay-s-Classic-Potato-Chips-1-5-oz-Bag/148212532",
//           "store_name": "Wal-Mart.com USA, LLC",
//           "store_price": "1.48",
//         },
//         Object {
//           "currency_code": "USD",
//           "currency_symbol": "$",
//           "product_url": "https://www.shoplet.com/afred2.xgi?ue=1&pt=cj&",
//           "store_name": "Shoplet.com",
//           "store_price": "68.84",
//         },
//       ],
//       "studio": "",
//       "title": "",
//       "weight": "",
//       "width": "",
//     },
//   ],
// }
// translateBarcode = async (barcode) => {

  translateBarcode = (barcode) => {
    try {
      // const url = `https://api.barcodelookup.com/v2/products?barcode=${barcode}&formatted=y&key=ehqjkfnjvfz8di1s30g7v5jceg0pov`;
      // let response = await fetch(url);
      // let responseJson = await response.json();
      let responseJson = {
        "products": [
         {
            "actor": "",
            "artist": "",
            "asin": "",
            "audience_rating": "",
            "author": "",
            "barcode_formats": "UPC 028400091565, EAN 0028400091565",
            "barcode_number": "0028400091565",
            "barcode_type": "EAN",
            "brand": "Lay's",
            "category": "Food, Beverages & Tobacco > Food Items > Bakery > Cookies",
            "color": "",
            "description": "Lay's, Classic Potato Chips, 1.5 OZ.",
            "director": "",
            "features": [],
            "format": "",
            "genre": "",
            "height": "",
            "images": [
              "https://images.barcodelookup.com/3181/31817934-1.jpg",
            ],
            "ingredients": "",
            "label": "",
            "length": "",
            "manufacturer": "Frito Lay",
            "model": "",
            "mpn": "0002840009156",
            "nutrition_facts": "",
            "package_quantity": "",
            "product_name": "Lay's ® Classic Potato Chips 1.5 Oz. Bag",
            "publisher": "",
            "release_date": "",
            "reviews": [],
            "size": "",
            "stores": [
              {
                "currency_code": "USD",
                "currency_symbol": "$",
                "product_url": "http://www.walmart.com/ip/Lay-s-Classic-Potato-Chips-1-5-oz-Bag/148212532",
                "store_name": "Wal-Mart.com USA, LLC",
                "store_price": "1.48",
              },
              {
                "currency_code": "USD",
                "currency_symbol": "$",
                "product_url": "https://www.shoplet.com/afred2.xgi?ue=1&pt=cj&",
                "store_name": "Shoplet.com",
                "store_price": "68.84",
              },
            ],
            "studio": "",
            "title": "",
            "weight": "",
            "width": "",
          },
        ],
      }
      // console.log("HN DEBUG responseJson", responseJson);
      if (responseJson) {
          const currency_symbol = responseJson.products[0].stores[0].currency_symbol;
          const store_price = responseJson.products[0].stores[0].store_price;
          const price = `${currency_symbol}${store_price}`;
          const listObj = {
            store_name: responseJson.products[0].stores[0].store_name,
            product_name: responseJson.products[0].product_name,
            image_url: responseJson.products[0].images[0],
            price: price,
         }
         console.log("HN DEBUG array", listObj);
         const item = this.props.createListItem && this.props.createListItem(listObj.image_url, listObj.product_name, listObj.price);
      }
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }

  _handleBarCodeRead = data => {
    // Alert.alert(
    //   'Scan successful!',
    //   JSON.stringify(data)
    // );
    data && data.data && this.translateBarcode(data.data);
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.hasCameraPermission === null ?
          <Text>Requesting for camera permission</Text> :
          this.state.hasCameraPermission === false ?
            <Text>Camera permission is not granted</Text> :
            <BarCodeScanner
              onBarCodeRead={this._handleBarCodeRead}
              style={{ height: 200, width: 200 }}
            />
        }
        <View style={{ flex: 1, marginTop: 25 }}>
          {this.state.item}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
});
