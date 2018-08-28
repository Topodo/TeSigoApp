import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import MainPage from './Views/MainPage';
import SignUp from './Views/SignUp';

const App = StackNavigator({
    Home: {screen: SignUp}
});

export default App;
