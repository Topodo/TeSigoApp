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
import APIHandler from '../../Utils/APIHandler';
import NetworkError from '../error_components/NetworkError'

export default class GetCourses extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            idProfessorFirebase: null,
            courses: null,
            errorOccurs: false
        }
        this.apiHandler = new APIHandler();
    }

    // Método que accede a la data de la API
    fetchData() {
        this.setState({
            isLoading: true,
            errorOccurs: false
        })
        this.apiHandler.getFromAPI('http://206.189.195.214:8080/api/profesor/' + this.state.idProfessorFirebase + '/cursos').
            then(resultJSON => {
                this.setState({
                    courses: resultJSON,
                    isLoading: false
                })
            })
            .catch(error => {
                this.setState({
                    isLoading: false,
                    errorOccurs: true
                })
            })
    }

    componentWillMount() {
        const { params } = this.props.navigation.state;
        this.setState({
            idProfessorFirebase: params.idProfessor
        });
    }

    componentDidMount() {
        this.fetchData()
    }

    goToStudentsList(infoCourse) {
        this.props.navigation.navigate("StudentList", {
            course: infoCourse.gradoCurso,
            idCourse: infoCourse.idCurso,
        });
    }

    // Método que renderiza la información de la lista de cursos
    renderInfo(info, id) {
        return (
            <View key={id} style={styles.CourseContainer}>
                <Button title={(id + 1).toString() + '.- ' + info.gradoCurso}
                    onPress={this.goToStudentsList.bind(this, info)}
                    color='#429b00'>
                </Button>
            </View>
        );
    }

    static navigationOptions = {
        title: 'Mis cursos'
    };

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.activityIndicator}>
                    <Text style={styles.loadingText}>
                        Cargando mis cursos
                    </Text>
                    <ActivityIndicator size='large' />
                </View>
            );
        }

        // Si ocurrió un error al hacer fetch
        if(this.state.errorOccurs) {
            return (
                <NetworkError parentFetchData={this.fetchData.bind(this)}/>
            )
        }

        let courses = this.state.courses ? this.state.courses.map((info, id) => {
            return (this.renderInfo(info, id));
        }) : null;

        if (this.state.isLoading) {
            return (
                <View style={styles.backColor}>
                    <ActivityIndicator />
                </View>
            );
        }
        return (
            <ScrollView style={styles.backColor}>
                <Text style={styles.loadingText}>
                    Cursos
                </Text>
                {courses}
            </ScrollView>
        );
    }
}

// Definición de estilos
const styles = StyleSheet.create({
    activityIndicator: {
        margin: 'auto',
        marginTop: '4%'
    },
    loadingText: {
        fontSize: 22,
        textAlign: 'center',
        marginBottom: '8%',
        marginTop: '5%'
    },
    backColor: {
        backgroundColor: 'white'
    },
    CourseContainer: {
        marginLeft: '4%',
        marginRight: '4%',
        marginBottom: 10,
    },
    CourseText: {
        marginTop: '2%',
        marginBottom: '2%',
        fontSize: 16,
        color: 'white',
    }
})