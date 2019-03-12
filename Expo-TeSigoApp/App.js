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
import SetEvaluationIndicator from './Views/student_progress/SetEvaluationIndicator';
import SetObjectivesPerStudent from './Views/student_progress/SetObjectivesPerStudent';
import GetObjectivesPerStudent from './Views/student_progress/GetObjectivesPerStudent';
import GetEvaluationIndicator from './Views/student_progress/GetEvaluationIndicator';
import GetEvidence from './Views/evidences/GetEvidence';
import StudentList from './Views/StudentList';
import GetCourses from './Views/GetCourses';
import StudentProfile from './Views/StudentProfile';
import EvidenceForm from './Views/evidences/EvidenceForm'
import CreateReport from './Views/reports/CreateReport'
import ReportsList from './Views/reports/ReportsList'
import CourseSubjectProgress from './Views/course_progress/CourseSubjectProgress'
import OACourseProgress from './Views/course_progress/OACourseProgress'
import IEStudentsProgress from './Views/course_progress/IEStudentsProgress'
import SelectEvidence from './Views/evidences/SelectEvidence'
import ShowEvidence from './Views/evidences/ShowEvidence'
import Logout from './Views/Logout'

const headerStyle = {
    headerStyle: {
        backgroundColor: '#008000',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
        fontWeight: 'bold',
        color: '#fff'
    },
}

const AppNavigator = createStackNavigator({
    Home: {
        screen: MainPage,
        navigationOptions: {
            header: null,
        }
    },
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
    EvidenceForm: { screen: EvidenceForm },
    SelectEvidence: { screen: SelectEvidence },
    ShowEvidence: { screen: ShowEvidence },
    Login: { screen: Login },
    Logout: { screen: Logout }
});

const Drawer = createDrawerNavigator({
    Home: {
        screen: AppNavigator
    },
    GetCourses: { screen: GetCourses },
    Logout: { screen: Logout }
})

export default Drawer;
