import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    Button,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
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
            student: {}
        }
        this.APIHandler = new APIHandler();
    }

    static navigationOptions = {
        title: 'Perfil del alumno'
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
                <View style={styles.button}>
                    <Button key={id + 3}
                            title='Ver avance'
                            color='#429b00'
                            onPress={this.getOAs.bind(this, info)}>
                    </Button>
                </View>
                <View style={styles.button}>
                    <Button key={id + 4}
                            title="Asignar avance"
                            color='#429b00'
                            onPress={this.setOAs.bind(this, info)}>
                    </Button>
                </View>
                <View style={styles.button}>
                    <Button key={id + 3}
                            title='Ver evidencias'
                            color='#429b00'
                            onPress={this.getEvidences.bind(this, info)}>
                    </Button>
                </View>
                <View style={styles.button}>
                    <Button key={id + 4}
                            title="Asignar evidencias"
                            color='#429b00'
                            onPress={this.getOAs.bind(this, info)}>
                    </Button>
                </View>
                <View style={styles.button}>
                    <Button key={id + 4}
                            title="Ver reportes"
                            color='#429b00'
                            onPress={this.getReports.bind(this, info)}>
                    </Button>
                </View>
                <View style={styles.button}>
                    <Button key={id + 4}
                            title="Asignar reportes"
                            color='#429b00'
                            onPress={this.setReports.bind(this, info)}>
                    </Button>
                </View>
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
        this.setState({
            isLoading: false
        })
    }

    render() {
        if(this.state.isLoading) {
            return(
                <View style={styles.activityIndicator}>
                    <Text style={styles.loadingText}>
                        Cargando la lista del curso
                    </Text>
                    <ActivityIndicator size='large'/>
                </View>
            );
        } 
        const studentComp = this.renderInfo(this.state.student, 0)
        return(
            <ScrollView style={styles.backColor}>
                { studentComp }
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
        borderWidth: 1.5,
        borderColor: '#429b00',
        alignItems: 'center',
        marginBottom: 10,
    },
    backColor: {
        backgroundColor: '#FFFFFF'
    },
})