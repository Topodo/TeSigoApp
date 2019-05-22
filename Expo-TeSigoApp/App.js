import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {
    createStackNavigator,
    createDrawerNavigator
} from 'react-navigation';
import Login from './Views/Login';
import MainPage from './Views/WelcomePage';
import SetEvaluationIndicator from './Views/student_progress/UpdateIEStudentProgress';
import SetObjectivesPerStudent from './Views/student_progress/UpdateOAStudentProgress';
import GetObjectivesPerStudent from './Views/student_progress/OAStudentProgress';
import GetEvaluationIndicator from './Views/student_progress/IEStudentProgress';
import GetEvidence from './Views/evidences/EvidencesList';
import StudentList from './Views/StudentsList';
import GetCourses from './Views/CoursesList';
import StudentProfile from './Views/StudentProfile';
import EvidenceForm from './Views/evidences/EvidenceForm'
import CreateReport from './Views/reports/CreateReport'
import ReportsList from './Views/reports/ReportsList'
import CourseSubjectProgress from './Views/course_progress/SubjectCourseProgress'
import OACourseProgress from './Views/course_progress/OACourseProgress'
import IEStudentsProgress from './Views/course_progress/IECourseProgress'
import SelectEvidence from './Views/evidences/SelectEvidence'
import ShowEvidence from './Views/evidences/EvidencePlayer'
import Logout from './Views/Logout'

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
