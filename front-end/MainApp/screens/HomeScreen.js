import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Dimensions
} from 'react-native';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import Scanner from '../components/Scanner';
import SadEmoji from '../components/Scanner';
// import {GradientButton} from '../components/gradientButton';
import Button from '../components/Button';
import SlidingUpPanel from 'rn-sliding-up-panel';
import Icon from 'react-native-vector-icons/MaterialIcons';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class HomeScreen extends React.Component {

  state = {
    showScanner: false,
    btnText: 'Shop',
    showSlidingUpPanel: true,
    itemList: []
  };

  static navigationOptions = {
    header: null,
  };

  onPrimaryBtnPress = (flag) => {
    if (this.state.showScanner) {
      Alert.alert(
        'Purchase Success'
      );
    }
    this.setState({
        showScanner: flag,
        btnText: flag ? 'Visa Checkout' : 'Shop'
    });
  }

  createListItem = (image_url, product_name, price, store_name) => {
    const item = (
    <View key={this.state.itemList.length} style={{ margin: 4 }}>
        { this.state.itemList.length === 0 &&
          <View style={{ marginTop: 8, backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'center', height: 100 }}>
            <Image
              style={{
                width: 200,
                height: 55,
                backgroundColor: 'white',
                resizeMode: 'cover',
                bottom: -10
              }}
              defaultSource={require('../assets/images/walmart.png')}
              source={require('../assets/images/walmart.png')}
            />
          </View>
        }
        <View style={{ padding: 8, backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'space-between', height: 76, borderWidth: 1, borderColor: "#FB877F", borderRadius: 4 }}>
          <Image
            style={{
              width: 55,
              height: 55,
              marginRight: 24,
              resizeMode: 'contain',
            }}
            source={{
              uri:
                `${image_url}`,
            }}
          />
          <View style={{ padding: 8, flex: 1, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <Text>{product_name}</Text>
              <Text>{price}</Text>
          </View>
        </View>
      </View>
    );
    const array = [...this.state.itemList];
    array.push(item);
    this.setState({
      itemList: array
    })
  }


  render() {
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
                  ENVISION
                </Text>
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
          <View style={styles.slidingUpContainer}>
              <SlidingUpPanel
                ref={c => (this._panel = c)}
                allowDragging={false}
                visible={this.state.showSlidingUpPanel}
                onRequestClose={() => this.setState({showSlidingUpPanel: false})}>
                    <View style={styles.slidingUpPanel}>
                      <TouchableOpacity style={{ position: 'absolute', right: 8, top: 8 }} onPress={() => this.setState({showSlidingUpPanel: false})}>
                          <Icon name={'close'} size={36} color={'white'} />
                      </TouchableOpacity>
                      <View style={{ flex: 1, alignSelf: 'flex-start', justifyContent: 'flex-start' }}>
                        <Text style={{ color: 'white', fontWeight: '500', fontSize: 24, marginLeft: 36, marginTop: 36 }}>
                        You're going to overspend your budget for this month.
                        </Text>
                      </View>
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
    fontWeight: '900',
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
