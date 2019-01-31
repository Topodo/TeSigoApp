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
import StudentList from './Views/StudentList';
import GetCourses from './Views/GetCourses';
import StudentProfile from './Views/StudentProfile';
import EvidenceForm from './Views/EvidenceForm' 
import CreateReport from './Views/CreateReport'
import ReportsList from './Views/ReportsList'
import CourseSubjectProgress from './Views/CourseSubjectProgress'
import OACourseProgress from './Views/OACourseProgress'
import IEStudentsProgress from './Views/IEStudentsProgress'

const AppNavigator = createStackNavigator({
    Home: { screen: CourseSubjectProgress },
    SetEvalIndicator: { screen: SetEvaluationIndicator },
    GetEvalIndicator: { screen: GetEvaluationIndicator },
    GetEvidence: { screen: GetEvidence },
    StudentList: { screen: StudentList },
    GetCourses: { screen: GetCourses },
    GetObjectivesPerStudent: { screen: GetObjectivesPerStudent },
    SetObjectivesPerStudent: { screen: SetObjectivesPerStudent },
    CreateReport: { screen: CreateReport },
    ReportsList: { screen: ReportsList },
    CourseSubjectProgress: { screen: CourseSubjectProgress },
    OACourseProgress: { screen: OACourseProgress },
    IEStudentsProgress: { screen: IEStudentsProgress },
    StudentProfile: { screen: StudentProfile },
});

const Drawer = createDrawerNavigator({
    Home: {
        screen: AppNavigator
    },
    GetCourses: { screen: GetCourses },
})

export default Drawer;
