import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Alert,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import Scanner from '../components/Scanner';
import SadEmoji from '../components/Scanner';
import Button from '../components/Button';
import SlidingUpPanel from 'rn-sliding-up-panel';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Buffer = require('buffer/').Buffer

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class HomeScreen extends React.Component {

  state = {
    showScanner: false,
    purchased: false,
    btnText: 'Shop',
    showSlidingUpPanel: false,
    total: 0,
    seeMore: false,
    itemList: [],
    showSpinner: false,
  };

  static navigationOptions = {
    header: null,
  };

  onPrimaryBtnPress = (flag) => {
    if (this.state.showScanner) {
      this.setState({
          showSpinner: true
      });
      this._spinner = true;
      setTimeout(() => {
        this.setState({
            showSpinner: false
        });
        this.state.total && Alert.alert(
          'Purchase Success'
        );
      }, 1000)
    } else {
      if (this.state.total !== 0) {
        this.setState({
            itemList: [],
            total: 0
        });
      }
    }
    this.setState({
        purchased: true,
        showScanner: flag,
        btnText: flag ? 'Checkout' : 'Shop More',
    });

    if (flag) {
        const data = {
            price: this.state.total,
            payerId: 7,
            payeeId: 10,
            itemType: "groceries"
        }
        fetch('http://hacky.nicklum.space/api/pay', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        .then((res) => {
           console.log("HN DEBUG nick res", res);
        });
    }
  }

  createListItem = (image_url, product_name, price, storePrice, store_name) => {
    let showSlidingUpPanel = false;
    if (this.state.itemList.length === 3) {
        showSlidingUpPanel = true;
        this.setState({
            showSlidingUpPanel
        });
    }
    const newTotal = Math.round((this.state.total + storePrice) * 100) / 100;
    this.setState({ total: newTotal });
    const item = (
    <View key={this.state.itemList.length} style={{ margin: 16 }}>
        { this.state.itemList.length === 0 &&
          <View style={{ marginTop: 20, backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'flex-start', height: 100, borderTopWidth: 2, borderColor: "#FB877F"  }}>
            <Image
              style={{
                width: 200,
                height: 55,
                marginTop: 10,
                backgroundColor: 'white',
                resizeMode: 'cover',
                bottom: -10
              }}
              defaultSource={require('../assets/images/walmart.png')}
              source={require('../assets/images/walmart.png')}
            />
          </View>
        }
        <View style={{ padding: 8, backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'space-between', height: 76, borderWidth: 1, borderColor: "transparent", borderRadius: 4 }}>
          <Image
            style={{
              width: 55,
              height: 55,
              resizeMode: 'contain',
            }}
            source={{
              uri:
                `${image_url}`,
            }}
          />
          <View style={{ flex: 0, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ flex: 0, justifyContent: 'center', alignItems: 'center', marginLeft: 8, marginRight: 8, height: 15, width: 15, borderRadius: 100, backgroundColor: showSlidingUpPanel ? "red" : '#00FF00' }}
            >
            {
              showSlidingUpPanel ?
              <Icon name={'close'} size={14} color={'white'}/>
              :
              <Icon name={'done'} size={14} color={'white'}/>
            }
            </View>
          </View>
          <View style={{ padding: 8, flex: 1, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <Text>{product_name}</Text>
              <Text>{price}</Text>
          </View>
        </View>
      </View>
    );
    const array = [...this.state.itemList];
    if (array.length%2 !== 0) {
      array.push(
        <View key={array.length+1} style={{ position: 'relative', marginTop: -40, marginBottom: -40, left: 92, height: 70, backgroundColor: "#EE7600", width: 6, borderRadius: 100 }}/>)
    }
    array.push(item);
    this.setState({
      itemList: array
    })
  }


  render() {
    let warning = "This is $2 higher than the average price. "
    const warning2 = "This is 20% of your total grocery budget of $100. At this rate, you will exceed your monthly budget in 10 days."
    if (this.state.seeMore) {
      warning += warning2;
    }
    return (
      <View style={styles.container}>
        {
          this.state.showScanner &&
            <Scanner
              createListItem={this.createListItem}
            />
        }
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          {
            !this.state.showScanner &&
              <View style={styles.getStartedContainer}>
                <Text style={styles.getStartedText}>
                  { this.state.purchased ? 'E-RECEIPT' : 'ENVISION' }
                </Text>
                {
                  !this.state.purchased ?
                  <Image
                    style={{
                      width: 250,
                      height: 250,
                      backgroundColor: 'white',
                      resizeMode: 'contain',
                    }}
                    defaultSource={require('../assets/images/logo.png')}
                    source={require('../assets/images/logo.png')}
                  />
                  :
                  <Text style={styles.getStartedText2}>
                    {`$${this.state.total}`}
                  </Text>
                }
              </View>
        }
        {this.state.itemList}
        </ScrollView>
        {
          <Button
            onPress={() => this.onPrimaryBtnPress(!this.state.showScanner)}
          >
            <View style={styles.actionButton}>
                <Text style={styles.actionText}>{this.state.btnText}</Text>
            </View>
          </Button>
        }
        { this.state.showSlidingUpPanel &&
          <Image
            style={{
              position: 'absolute',
              left: WIDTH/3 + 36,
              top: HEIGHT/2 + 40,
              width: 80,
              height: 80,
              zIndex: 3,
              backgroundColor: 'transparent',
              resizeMode: 'contain',
              shadowColor: "#000000",
              shadowOpacity: 0.5,
              shadowRadius: 2,
              shadowOffset: {
                  height: 1,
                  width: 0
              },
            }}
            defaultSource={require('../assets/images/sad.png')}
            source={require('../assets/images/sad.png')}
          />
        }
        { this.state.showSpinner &&
        <ActivityIndicator
          style={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
          }}
          color={'#FB877F'} size={'large'}
        />
        }
        { this.state.showSlidingUpPanel &&
          <View style={styles.slidingUpContainer}>
              <SlidingUpPanel
                ref={c => (this._panel = c)}
                allowDragging={false}
                visible={this.state.showSlidingUpPanel}
                onRequestClose={() => this.setState({showSlidingUpPanel: false})}>
                    <View style={styles.slidingUpPanel}>
                      <TouchableHighlight style={{ height: 30, width: 30, position: 'absolute', right: 8, top: 8, borderRadius: 100, backgroundColor: 'grey' }} onPress={() => this.setState({showSlidingUpPanel: false})}>
                          <Icon name={'close'} size={30} color={'white'} style={{ opacity: 1 }} />
                      </TouchableHighlight>
                      <ScrollView style={{marginTop: 20, padding: 25}}>
                      <View style={{ flex: 1, alignSelf: 'flex-start', justifyContent: 'flex-start' }}>
                        <Text style={{ color: 'white', fontWeight: '500', fontSize: 24, marginBottom: 10 }}>
                        {warning}
                        </Text>
                        {
                          !this.state.seeMore &&
                          <TouchableHighlight onPress={() => this.setState({seeMore: true})}>
                            <Text style={{ textDecorationLine: 'underline', color: 'white', fontWeight: '500', fontSize: 24, marginTop: 45 }}>
                            See more
                            </Text>
                          </TouchableHighlight>
                        }
                      </View>
                      </ScrollView>
                    </View>
              </SlidingUpPanel>
        </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 45,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  scanner: {
    flex: 1,
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 56,
    color: "#FB877F",
    textAlign: 'center',
    alignSelf: 'center',
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 46,
  },
  getStartedText2: {
    fontSize: 44,
    textAlign: 'center',
    alignSelf: 'center',
    fontWeight: '500',
    letterSpacing: 1,
    marginTop: 46,
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  actionButton: {
    borderRadius: 28,
    elevation: 2,
    shadowColor: "#000000",
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
        height: 1,
        width: 0
    },
    position: 'absolute',
    justifyContent: 'center',
    height: 48,
    bottom: 20,
    left: WIDTH/4,
    width: WIDTH/2,
    backgroundColor: '#FB877F'
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '500'
  },
  slidingUpContainer: {
    flex: 1,
    elevation: 5,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000000",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
        height: 3,
        width: 0
    },
  },
  slidingUpPanel: {
    flex: 1,
    elevation: 5,
    backgroundColor: "#FB877F",
    alignItems: 'center',
    justifyContent: 'center',
  },
});
