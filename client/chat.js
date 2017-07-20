import React from 'react';
import { View, Text, AsyncStorage, StyleSheet } from 'react-native';
import SocketIOClient from 'socket.io-client';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

const USER_ID = '@userId';
const SERVER_IP = `localhost`;



const styles = StyleSheet.create({
  nameTag: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default class Chat extends React.Component {
  // Nav options can be defined as a function of the screen's props:
  static navigationOptions = ({ navigation }) => ({
    title: `ChatId: ${navigation.state.params.chatId}`,
  });
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      userId: null
    };

    this.determineUser = this.determineUser.bind(this);
    this.onReceivedMessage = this.onReceivedMessage.bind(this);
    this.onSend = this.onSend.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this._storeMessages = this._storeMessages.bind(this);

    // replace the ip with your servers local ip
    this.socket = SocketIOClient(`http://${SERVER_IP}:3030`);
    this.socket.on('message', this.onReceivedMessage);
    this.determineUser();
  }

  /**
   * When a user joins the chatroom, check if they are an existing user.
   * If they aren't, then ask the server for a userId.
   * Set the userId to the component's state.
   */
  determineUser() {
    this.socket.emit('defChatId', this.props.navigation.state.params.chatId)
    AsyncStorage.getItem(USER_ID)
      .then((userId) => {
        // If there isn't a stored userId, then fetch one from the server.
        if (!userId) {
          this.socket.emit('userJoined', null);
          this.socket.on('userJoined', (userId) => {
            AsyncStorage.setItem(USER_ID, userId);
            this.setState({ userId });
          });
        } else {
          this.socket.emit('userJoined', userId);
          this.setState({ userId });
        }
      })
      .catch((e) => alert(e));
  }
  // defines the bubble
  renderBubble(props) {
    // console.warn("BREAK ");
    // console.warn(props);
    // console.warn("BREAK ");
    // console.warn(props.currentMessage.user.name);
    return (
      <View>
      <Text style={styles.nameTag}>{props.currentMessage.user.name}</Text>
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
    this._storeMessages(messages);
  }

  /**
   * When a message is sent, send the message to the server
   * and store it in this component's state.
   */
  onSend(messages=[]) {
    // console.warn(messages).
    messages[0].user.name = this.props.navigation.state.params.username;
    this.socket.emit('defChatId', this.props.navigation.state.params.chatId)
    // console.warn(this.props)
    this.socket.emit('message', messages[0]);
    this._storeMessages(messages);
  }

  render() {
    var user = { _id: this.state.userId || -1 };

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