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
import GetEvidence from './Views/GetEvidence';
import ShowEvidence from './Views/ShowEvidence';
 

const App = createStackNavigator({
    Home: { screen: GetEvidence },
    SetEvalIndicator: { screen: SetEvaluationIndicator },
    GetEvalIndicator: { screen: GetEvaluationIndicator },
    ShowEvidence: { screen: ShowEvidence }
});

export default App;
