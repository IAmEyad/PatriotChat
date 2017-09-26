import React, { Component } from 'react';
import { Text, View, Button, AsyncStorage, WebView } from 'react-native';
import { StackNavigator } from 'react-navigation';

export default class SignIn extends Component {
  // static navigationOptions = {
  //     title: 'SignIn',
  // }
  render() {
    // let user = { SAMPLE
    //   username: 'zoz',
    //   firstName: 'John',
    //   lastName: 'Doe',
    //   email: 'jdoe5@gmu.edu',
    //   netid: 'zoz',
    //   Gnumber: '00000000',
      // chats: {
      //   'zoz-eyad': {
      //     id: 1, //Represents the ChatId
      //     name: 'Patriot Chat Development',
      //     participants: ['zoz', 'eyad']
      //   },
      //   'zoz-dhaynes': {
      //     id: 2,
      //     name: 'some other thing',
      //     participants: ['zoz', 'dhaynes']
      //   },
      //   'eyad-dhaynes': {
      //     id: 3,
      //     name: 'some third thing',
      //     participants: ['eyad', 'dhaynes']
      //   }
      // }
    // }
    let sampleusr1 = {
      netid: 'zoz',
      // chats: {
      //   'zoz-eyad': {
      //     id: 1,
      //     name: 'Patriot Chat Development',
      //     participants: ['zoz', 'eyad']
      //   },
      //   'zoz-dhaynes': {
      //     id: 2,
      //     name: 'some other thing',
      //     participants: ['zoz', 'dhaynes']
      //   }
      // }
    };

    let sampleusr2 = {
      netid: 'eyad',
      // chats: {
      //   'zoz-eyad': {
      //     id: 1,
      //     name: 'Patriot Chat Development',
      //     participants: ['zoz', 'eyad']
      //   },
      //   'eyad-dhaynes': {
      //     id: 3,
      //     name: 'some third thing',
      //     participants: ['eyad', 'dhaynes']
      //   }
      // }
    };
    let sampleusr3 = {
      netid: 'dhaynes',
      // chats: {
      //   'zoz-dhaynes': {
      //     id: 2,
      //     name: 'some other thing',
      //     participants: ['zoz', 'dhaynes']
      //   },
      //   'eyad-dhaynes': {
      //     id: 3,
      //     name: 'some third thing',
      //     participants: ['eyad', 'dhaynes']
      //   }
      // }
    };
    return(
      <View>
        <Text>Signin</Text>
        <Button
        title='Set Placeholder Values for user 1 '
        onPress={() => {
          AsyncStorage.setItem('user', JSON.stringify(sampleusr1));
        }}
        />
        <Button
        title='Set Placeholder Values for user 2 '
        onPress={() => {
          AsyncStorage.setItem('user', JSON.stringify(sampleusr2));
        }}
        />
        <Button
        title='Set Placeholder Values for user 3'
        onPress={() => {
          AsyncStorage.setItem('user', JSON.stringify(sampleusr3));
        }}
        />
      </View>
    )
  }
}