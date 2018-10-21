import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated
} from 'react-native';
import { WebBrowser } from 'expo';
import { Button } from 'react-native-material-ui';
import { MonoText } from '../components/StyledText';
import Scanner from '../components/Scanner';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class HomeScreen extends React.Component {

  state = {
    showScanner: false,
    btnText: 'Scan',
    item: null,
  };

  static navigationOptions = {
    header: null,
  };

  onPrimaryBtnPress = (flag) => {
    this.setState({
        showScanner: flag,
        btnText: flag ? 'Done' : 'Scan'
    });
  }

  createListItem = (image_url, product_name, price) => {
    const item = (
    <View style={{ margin: 16 }}>
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
    this.setState({
      item: item
    })
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Image
            source={
              __DEV__
                ? require('../assets/images/robot-dev.png')
                : require('../assets/images/robot-prod.png')
            }
            style={styles.welcomeImage}
          />
        </View>
        { !this.state.showScanner &&
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>
              Welcome to Plan Ready
            </Text>
            <Button raised primary text={this.state.btnText} onPress={() => this.onPrimaryBtnPress(true)}/> // raised button with primary color
          </View>
        </ScrollView>
      }
      { this.state.showScanner &&
        <View style={styles.scanner}>
          <View style={{ marginBottom: 24 }}>
            <Scanner
              createListItem={this.createListItem}
            />
          </View>
          <Button raised primary text={this.state.btnText} onPress={() => this.onPrimaryBtnPress(false)}/> // raised button with primary color
        </View>
      }
      <View/>
          {this.state.item}
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 25
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
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 8,
    resizeMode: 'contain'
    // backgroundColor: 'white'
  }
});
