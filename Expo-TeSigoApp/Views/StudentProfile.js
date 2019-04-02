import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    Button,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import * as firebase from 'firebase';
import APIHandler from '../Utils/APIHandler';

export default class StudentProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            studentName: null,
            idStudent: -1,
            course: null,
            idCourse: -1,
            expandableItems: [],
            subjects: [],
            student: {},
            professorType: '',
        }
        this.APIHandler = new APIHandler();
    }

    static navigationOptions = {
        title: 'Perfil del alumno',
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
    }

    // Método que redirige la navegación a la vista de visualización de objetivos de aprendizaje
    getOAs(student) {
        this.props.navigation.navigate('GetObjectivesPerStudent', {
            idStudent: student.idAlumno,
            idCourse: this.state.idCourse,
            studentName: student.nombreAlumno + " " + student.apellidoPaternoAlumno + " " + student.apellidoMaternoAlumno,
            course: this.state.course,
        })
    }

    // Método que redirige la navegación a la vista de asignación de objetivos de aprendizaje
    setOAs(student) {
        this.props.navigation.navigate('SetObjectivesPerStudent', {
            idStudent: student.idAlumno,
            idCourse: this.state.idCourse,
            studentName: student.nombreAlumno + " " + student.apellidoPaternoAlumno + " " + student.apellidoMaternoAlumno,
            course: this.state.course,
            student: this.state.student
        })
    }

    // Método que redirige la navegación a la vista de visualización de reportes
    getReports(student) {
        this.props.navigation.navigate('ReportsList', {
            idStudent: student.idAlumno,
            studentName: student.nombreAlumno + " " + student.apellidoPaternoAlumno + " " + student.apellidoMaternoAlumno,
            course: this.state.course
        })
    }

    // Método que redirige la navegación a la vista de asignación de reportes
    setReports(student) {
        this.props.navigation.navigate('CreateReport', {
            idStudent: student.idAlumno,
            studentName: student.nombreAlumno + " " + student.apellidoPaternoAlumno + " " + student.apellidoMaternoAlumno,
            course: this.state.course
        })
    }

    // Método que redirige la navegación a la vista de visualización de evidencia
    getEvidences(student) {
        this.props.navigation.navigate('GetEvidence', {
            idStudent: student.idAlumno,
            studentName: student.nombreAlumno + " " + student.apellidoPaternoAlumno + " " + student.apellidoMaternoAlumno,
            course: this.state.course
        })
    }

    // Método que redirige la navegación a la vista de asignación de evidencias
    setEvidences(student) {
        this.props.navigation.navigate('SelectEvidence', {
            idStudent: student.idAlumno,
            studentName: student.nombreAlumno + " " + student.apellidoPaternoAlumno + " " + student.apellidoMaternoAlumno,
            idCourse: this.state.idCourse,
            courseName: this.state.course
        })
    }

    // Método que renderiza el botón para mostrar avance
    renderShowProgress(info) {
        return (
            <View style={styles.button}>
                <Button
                    title='Ver avance'
                    color='#429b00'
                    onPress={this.getOAs.bind(this, info)}>
                </Button>
            </View>
        )
    }

    // Método que renderiza el botón para asignar avance
    renderSetProgress(info) {
        if (this.state.professorType === 'profesor')
            return (
                <View style={styles.button}>
                    <Button
                        title="Asignar avance"
                        color='#429b00'
                        onPress={this.setOAs.bind(this, info)}>
                    </Button>
                </View>
            )
        else
            return null
    }

    // Método que renderiza el botón para mostrar evidencias
    renderShowEvidences(info) {
        return (
            <View style={styles.button}>
                <Button
                    title='Ver evidencias'
                    color='#429b00'
                    onPress={this.getEvidences.bind(this, info)}>
                </Button>
            </View>
        )
    }

    // Método que renderiza el botón para asignar evidencias
    renderSetEvidences(info) {
        if (this.state.professorType === 'profesor' || this.state.professorType === 'paradocente')
            return (
                <View style={styles.button}>
                    <Button
                        title="Asignar evidencias"
                        color='#429b00'
                        onPress={this.setEvidences.bind(this, info)}>
                    </Button>
                </View>
            )
        else
            return null
    }

    // Método que renderiza el botón para visualizar reportes
    renderShowReports(info) {
        return (
            <View style={styles.button}>
                <Button
                    title="Ver reportes"
                    color='#429b00'
                    onPress={this.getReports.bind(this, info)}>
                </Button>
            </View>
        )
    }

    // Método que renderiza el botón para asignar reportes
    renderSetReports(info) {
        if (this.state.professorType === 'profesor' || this.state.professorType === 'paradocente')
            return (
                <View style={styles.button}>
                    <Button
                        title="Asignar reporte"
                        color='#429b00'
                        onPress={this.setReports.bind(this, info)}>
                    </Button>
                </View>
            )
        else
            return null
    }

    // Método que renderiza la información del alumno
    renderInfo(info, id) {
        return (
            <View key={id} style={styles.CourseContainer}>
                <Text key={id + 1} style={styles.StudentText}>
                    {info.nombreAlumno + " " + info.apellidoPaternoAlumno + " " + info.apellidoMaternoAlumno}
                </Text>
                <Text style={styles.CourseText}>
                    {this.state.course}
                </Text>
                {this.renderShowProgress(info)}
                {this.renderSetProgress(info)}
                {this.renderShowReports(info)}
                {this.renderSetReports(info)}
                {this.renderShowEvidences(info)}
                {this.renderSetEvidences(info)}
            </View>
        );
    }

    componentWillMount() {
        const { params } = this.props.navigation.state
        this.setState({
            studentName: params.studentName,
            idStudent: params.idStudent,
            idCourse: params.idCourse,
            course: params.course,
            student: params.student
        })
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            // Se obtienen los datos del profesor
            this.APIHandler.getFromAPI('http://206.189.195.214:8080/api/profesor/' + user.uid)
                .then(response => {
                    if (response.tipo === null)
                        this.setState({
                            professorType: 'profesor',
                            isLoading: false
                        })
                    else
                        this.setState({
                            professorType: response.tipo,
                            isLoading: false
                        })
                })
        })
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.activityIndicator}>
                    <Text style={styles.loadingText}>
                        Cargando la lista del curso
                    </Text>
                    <ActivityIndicator size='large' />
                </View>
            );
        }
        return (
            <ScrollView style={styles.backColor}>
                {this.renderInfo(this.state.student, 0)}
            </ScrollView>
        )
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
    CourseText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: '3%',
    },
    button: {
        width: '70%',
        marginRight: '5%',
        marginBottom: 10,
        marginLeft: '5%'
    },
    CourseContainer: {
        marginTop: 15,
        marginLeft: '4%',
        marginRight: '4%',
        alignItems: 'center',
        marginBottom: 10,
    },
    backColor: {
        backgroundColor: '#FFFFFF'
    },
})