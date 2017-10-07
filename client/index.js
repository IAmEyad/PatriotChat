import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  ScrollView,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Button from 'react-native-button';
import SocketIOClient from 'socket.io-client';


// Import other pages:
import Chat from './chat'
import SignIn from './signIn'


const SERVER_IP = `10.0.0.6`;


export default class Main extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      user: null,
      chats: null
    }
    this.socket = SocketIOClient(`http://${SERVER_IP}:3030`);    
  }

  static navigationOptions = {
    title: 'Groups',
  };  


  // before first dom render check if user is set; if not: navigate to login page
  componentWillMount() {
    // AsyncStorage.clear();

    AsyncStorage.getItem('user').then((user) => { 
      if (user == null) {
        this.props.navigation.navigate('SignIn');
      }
      else {
        this.setState({user: JSON.parse(user)});
        // console.warn(this.state.user);
      }
    });
    AsyncStorage.getItem('chats').then((chats) => { 
        this.setState({chats: JSON.parse(chats)});
      });

      //fetch chats from server
      this.socket.emit('fetch-chats');
      this.socket.on('fetch-chats', (chats) => {
        AsyncStorage.setItem('chats', JSON.stringify(chats));
        this.setState({chats: chats});
      })
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <ScrollView style={styles.container}>
        {
          (this.state.user != null) > 0 &&
          Object.keys(this.state.chats).map((key, index) => {
            let chat = this.state.chats[key];
            return (
                <Button
                  onPress={() => {
                    navigate('Chat', {user:this.state.user, chat: chat, socket: this.socket})
                  }}
                  style={{color: 'white'}}
                  containerStyle={{margin: 1, padding:10, height:70, overflow:'hidden', backgroundColor: '#006633'}}
                >
                
                <Text style={styles.chatTag}> {chat.name} ❯ </Text>
                
                </Button>
            );
          })
        }
      </ScrollView>
    );
  }
}

const App = StackNavigator({
  Home: { screen: Main },
  Chat: { screen: Chat },
  SignIn: { screen: SignIn }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#006633'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  chat: {
    backgroundColor: '#006633',
    // margin: 10,
    height: 70,
    margin: 0.5,
    // justifyContent: 'flex-end',
  },
  chatTag: {
    color: 'white',
  }
});

AppRegistry.registerComponent('PatriotChat', () => App);
