import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    Button,
    StyleSheet,
    TouchableOpacity,
    Picker,
    ActivityIndicator
} from 'react-native';
import APIHandler from '../Utils/APIHandler';

export default class GetCourses extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            idProfessorFirebase: null,
            courses: null
        }
        this.apiHandler = new APIHandler();
    }

    componentWillMount() {
        //const { params } = this.props.navigation.state;
        this.setState({
            idProfessorFirebase: "Qt5i8i3Mk2U3P1fbo1djhV8bHB73"
        });
    }

    componentDidMount() {
        this.apiHandler.getFromAPI('http://206.189.195.214:8080/api/profesor/' + this.state.idProfessorFirebase + '/cursos').
            then(resultJSON => {
                this.setState({
                    courses: resultJSON,
                    isLoading: false
                })        
            }
        )
    }

    goToStudentsList(infoCourse) {
        this.props.navigation.navigate("StudentList", {
            course: infoCourse.gradoCurso,
            idCourse: infoCourse.idCurso
        });
    }

    // Método que renderiza la información de la lista de cursos
    renderInfo(info, id) {
        return (
            <View key={id}>
                <TouchableOpacity
                    onPress = {this.goToStudentsList.bind(this, info)}>
                    <Text>
                        {info.gradoCurso}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    static navigationOptions = {
        title: 'Lista de cursos'
    };

    render() {
        let courses = this.state.courses ? this.state.courses.map((info, id) => {
            return (this.renderInfo(info, id));
        }) : null;

        if(this.state.isLoading) {
            return(
                <View>
                    <ActivityIndicator/>
                </View>
            );
        }
        return(
            <ScrollView>
                <Text>
                    Cursos
                </Text>
                {courses}
            </ScrollView>
        );
    }
}