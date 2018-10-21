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
import {GradientButton} from '../components/gradientButton';
import Button from '../components/Button';
import SlidingUpPanel from 'rn-sliding-up-panel';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class HomeScreen extends React.Component {

  state = {
    showScanner: false,
    btnText: 'Shop',
    showSlidingUpPanel: true
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

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          {
            !this.state.showScanner &&
              <View style={styles.getStartedContainer}>
                <Text style={styles.getStartedText}>
                  Welcome back, Felicia
                </Text>
              </View>
        }
        {
          this.state.showScanner &&
            <View style={styles.container}>
                <Scanner/>
            </View>
        }
        </ScrollView>
        {
          <View>
              <SlidingUpPanel
                ref={c => (this._panel = c)}
                visible={this.state.showSlidingUpPanel}
                allowDragging={this.state.allowDragging}
                onRequestClose={() => this.setState({showSlidingUpPanel: false})}>
                    <View style={styles.slidingUpContainer}>
                      <TouchableOpacity onPress={() => this.setState({showSlidingUpPanel: false})}>
                        <View>
                          <Text>Hide</Text>
                        </View>
                      </TouchableOpacity>
                      <ScrollView
                        onTouchEnd={() => this.setState({allowDragging: true})}
                        onTouchCancel={() => this.setState({allowDragging: true})}
                        onTouchStart={() => this.setState({allowDragging: false})}>
                        <Text>Here is the content inside panel</Text>
                        <Text>Here is the content inside panel</Text>
                        <Text>Here is the content inside panel</Text>
                        <Text>Here is the content inside panel</Text>
                        <Text>Here is the content inside panel</Text>
                        <Text>Here is the content inside panel</Text>
                      </ScrollView>
                    </View>
              </SlidingUpPanel>
        </View>
        }
        {
          <Button
            onPress={() => this.onPrimaryBtnPress(!this.state.showScanner)}
          >
            <View style={styles.actionButton}>
                <Text style={styles.actionText}>{this.state.btnText}</Text>
            </View>
          </Button>
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
    fontSize: 32,
    color: 'rgba(0,0,0,0.87)',
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 32
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
    marginTop: 48,
    borderRadius: 28,
    elevation: 2,
    shadowColor: "#000000",
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
        height: 1,
        width: 0
    },
    justifyContent: 'center',
    alignSelf: 'center',
    marginLeft: 16,
    marginRight: 16,
    height: 48,
    bottom: 20,
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
    backgroundColor: '#FB877F',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
