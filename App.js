import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { 
    StackNavigator,
    createStackNavigator
} from 'react-navigation';
import MainPage from './Views/MainPage';
import SignUp from './Views/SignUp';
import SetEvaluationIndicator from './Views/SetEvaluationIndicator';
import SetObjectivesPerStudent from './Views/SetObjectivesPerStudent';
import GetObjectivesPerStudent from './Views/GetObjectivesPerStudent';
import GetEvaluationIndicator from './Views/GetEvaluationIndicator';
 

const App = createStackNavigator({
    Home: { screen: SetObjectivesPerStudent },
    SetEvalIndicator: { screen: SetEvaluationIndicator },
    GetEvalIndicator: { screen: GetEvaluationIndicator }
});

export default App;
