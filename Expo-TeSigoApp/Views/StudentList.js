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

export default class StudentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            students: null,
            course: null,
            idCourse: -1,
            expandableItems: [],
            subjects: []
        }
        this.APIHandler = new APIHandler();
    }

    // Método que redirige la navegación al perfil del alumno
    getStudentProfile(student) {
        this.props.navigation.navigate('StudentProfile', {
            idStudent: student.idAlumno,
            idCourse: this.state.idCourse,
            studentName: student.nombreAlumno + " " + student.apellidoPaternoAlumno + " " + student.apellidoMaternoAlumno,
            course: this.state.course,
            student: student
        })
    }

    componentWillMount() {
        const { params } = this.props.navigation.state;
        this.setState({
            course: params.course,
            idCourse: params.idCourse,
        });
    }

    componentDidMount() {
        this.APIHandler.getFromAPI('http://206.189.195.214:8080/api/curso/' + this.state.idCourse + '/alumnos').
            then(resultJSON => {
                let expandableItems = []
                for (i = 0; i < resultJSON.lenght; i++) {
                    expandableItems.push(false);
                }
                this.setState({
                    students: resultJSON,
                    isLoading: false,
                    expandableItems: expandableItems
                })
            })
    }

    static navigationOptions = {
        title: 'Lista de alumnos',
        headerStyle: {
            backgroundColor: 'green',
        },
        headerTitleStyle: {
            fontWeight: "bold",
            color: "#fff",
            fontSize: 18,
            zIndex: 1,
            lineHeight: 23
        },
    };

    // Método que redirige la navegación a la vista de avance general del curso
    getCourseSubjectProgress() {
        this.props.navigation.navigate('CourseSubjectProgress', {
            idCourse: this.state.idCourse,
            course: this.state.course
        })
    }

    // Método que renderiza la información de la lista de alumnos
    renderInfo(info, id) {
        return (
            <View key={id} style={styles.CourseContainer}>
                <Text key={id + 1} style={styles.StudentText}>
                    {(id + 1).toString() + '.- ' + info.nombreAlumno + " " + info.apellidoPaternoAlumno + " " + info.apellidoMaternoAlumno}
                </Text>
                <View key={id + 2} style={styles.flowRight}>
                    <View style={styles.button}>
                        <Button key={id + 3}
                            title='Ver Perfil'
                            color='#429b00'
                            onPress={this.getStudentProfile.bind(this, info)}>
                        </Button>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        let studentsList = this.state.isLoading === true ? null :
            this.state.students.map((student, index) => {
                return (this.renderInfo(student, index));
            });
        if (this.state.isLoading) {
            return (
                <View style={styles.activityIndicator}>
                    <Text style={styles.loadingText}>
                        Cargando listado de alumnos
                    </Text>
                    <ActivityIndicator size='large' />
                </View>
            );
        } else {
            return (
                <ScrollView style={styles.backColor}>
                    <Text style={styles.titleText}>
                        {'Curso: ' + this.state.course}
                    </Text>
                    <View style={styles.progressButton}>
                        <Button title="Ver avance del curso"
                            color='#429b00'
                            onPress={this.getCourseSubjectProgress.bind(this)}>
                        </Button>
                    </View>
                    {studentsList}
                </ScrollView>
            );
        }
    }
}

// Definición de estilos
const styles = StyleSheet.create({
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 10
    },
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
    titleText: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: '7%',
        marginBottom: '7%'
    },
    StudentText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: '3%',
        marginTop: '3%'
    },
    button: {
        marginRight: '0%'
    },
    progressButton: {
        width: '80%',
        marginBottom: 16,
        marginLeft: '10%'
    },
    CourseContainer: {
        marginLeft: '4%',
        marginRight: '4%',
        borderWidth: 1.5,
        borderColor: '#429b00',
        alignItems: 'center',
        marginBottom: 10,
    },
    backColor: {
        backgroundColor: '#FFFFFF'
    },
})