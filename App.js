import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { 
    StackNavigator,
    createStackNavigator,
    createDrawerNavigator
} from 'react-navigation';
import Login from './Views/Login';
import MainPage from './Views/MainPage';
import SignUp from './Views/SignUp';
import SetEvaluationIndicator from './Views/SetEvaluationIndicator';
import SetObjectivesPerStudent from './Views/SetObjectivesPerStudent';
import GetObjectivesPerStudent from './Views/GetObjectivesPerStudent';
import GetEvaluationIndicator from './Views/GetEvaluationIndicator';
import GetEvidence from './Views/GetEvidence';
import ShowEvidence from './Views/ShowEvidence';
import StudentList from './Views/StudentList';
import GetCourses from './Views/GetCourses';
 

const AppNavigator = createStackNavigator({
    Home: { screen: Login },
    SetEvalIndicator: { screen: SetEvaluationIndicator },
    GetEvalIndicator: { screen: GetEvaluationIndicator },
    ShowEvidence: { screen: ShowEvidence },
    StudentList: { screen: StudentList },
    GetCourses: { screen: GetCourses },
    GetObjectivesPerStudent: { screen: GetObjectivesPerStudent }
});

const Drawer = createDrawerNavigator({
    Home: {
        screen: AppNavigator
    },
    GetCourses: { screen: GetCourses },
})

export default Drawer;
