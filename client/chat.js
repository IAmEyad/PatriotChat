import React from 'react';
import { View, Text, AsyncStorage, StyleSheet } from 'react-native';
import SocketIOClient from 'socket.io-client';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';


const styles = StyleSheet.create({
  nameTag: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default class Chat extends React.Component {
  // Nav options can be defined as a function of the screen's props:
  static navigationOptions = ({ navigation }) => ({
    title: `ChatId: ${navigation.state.params.chat.id}`,
  });
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      user: this.props.navigation.state.params.user
    };

    // this.determineUser = this.determineUser.bind(this);
    this.onReceivedMessage = this.onReceivedMessage.bind(this);
    this.onSend = this.onSend.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this._storeMessages = this._storeMessages.bind(this);

    // replace the ip with your servers local ip
    this.socket = this.props.navigation.state.params.socket;
    this.socket.on('add-message', (message) => this.onReceivedMessage(message));
    // this.determineUser();
  }
  componentWillMount() {
    this.socket.emit("add-user", {"netid": this.state.user.netid});
    // this.socket.on('fetch-chats', (chats) => {};
  }


  // defines the bubble
  renderBubble(props) {

    currentMessage = props.currentMessage
    let showUsername = true;

    if (currentMessage.previousMessage.user != null){
      if (currentMessage.previousMessage.user._id == currentMessage.user._id){
        showUsername = false;
      }
    }
    if (currentMessage.user._id == this.state.user.netid){
       showUsername = false;
    }
      
    return (
      <View>
       {showUsername > 0 && <Text style={styles.nameTag}>{currentMessage.user.name}</Text>}

      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#D8D8C1'
          },
          right: {
            backgroundColor: '#006633'
          }
        }}
      />
      </View>
    );
  }

  // Event listeners
  /**
   * When the server sends a message to this.
   */
  onReceivedMessage(messages) {

    // console.warn('recived message:')
    // console.warn(messages);

    this._storeMessages(messages);
  }

  /**
   * When a message is sent, send the message to the server
   * and store it in this component's state.
   */
  onSend(messages=[]) {
    // console.warn(messages[0]);
    messages[0].sender = this.props.navigation.state.params.user.netid;
    messages[0].destinations = this.props.navigation.state.params.chat.participants;
    // console.warn("destination: " + this.props.navigation.state.params.chat.participants);
    this.socket.emit('private-message', messages[0], this.props.navigation.state.params.user);
    this._storeMessages(messages);
  }
  
  render() {
    let user = { 
      _id: this.state.user.netid || -1,
       name: this.state.user.username || `${this.state.user.firstName} ${this.state.user.lastName}`
      };

    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        user={user}
        renderBubble={this.renderBubble}
      />
    );
  }

  // Helper functions
  _storeMessages(messages) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }
}