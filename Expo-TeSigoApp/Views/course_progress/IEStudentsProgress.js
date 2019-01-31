import React, { Component } from 'react'
import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    Button,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';
import APIHandler from '../../Utils/APIHandler'

export default class IEStudentsProgress extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            idCourse: -1,
            course: '',
            idIE: -1,
            IEName: '',
            students: [],
            completeList: [],
            incompleteList: [],
            selectedItems: [false, false] // Para desplegar los listados colapsables
        }
        this.APIHandler = new APIHandler()
    }

    componentWillMount() {
        const { params } = this.props.navigation.state
        this.setState({
            idCourse: params.idCourse,
            idIE: params.idIE,
            course: params.course
        })
    }

    componentDidMount() {
        this.APIHandler.getFromAPI('http://206.189.195.214:8080/api/indicadorEvaluacion/' + this.state.idIE + '/curso/' + this.state.idCourse + '/ordenar')
            .then(response => {
                this.setState({
                    IEName: response.IEName,
                    completeList: response.completeList,
                    incompleteList: response.incompleteList,
                    isLoading: false
                })
            })
            .then(() => {
                // Se obtienen los alumnos del curso
                this.APIHandler.getFromAPI('http://206.189.195.214:8080/api/curso/' + this.state.idCourse + '/alumnos')
                    .then(response => {
                        this.setState({
                            students: response
                        })
                    })
            })
            .catch(error => console.error(error))
    }

    // Método que obtiene los datos de un alumno
    getStudent(idStudent) {
        let studentAux = null
        this.state.students.forEach(student => {
            if(student['idAlumno'] === idStudent) {
                studentAux = student
            }
        })     
        return studentAux
    }

    // Método que redirige la navegación hacia el perfil del alumno
    goStudentProfile(idStudent, studentName) {
        let currentStudent = this.getStudent(idStudent)
        this.props.navigation.navigate('StudentProfile', {
            studentName: studentName,
            idStudent: idStudent,
            idCourse: this.state.idCourse,
            course: this.state.course,
            student: currentStudent
        })
    }

    // Método que renderiza un elemento de la lista de alumnos
    renderStudentElement(student, index) {
        return(
            <View key={index} style={[styles.flowRight, styles.profileContainer]}>
                <View style={styles.textProfileContainer}>
                    <Text> { student.name } </Text>
                </View>
                <View style={styles.button} key={index + 1}>
                    <Button onPress={() => {
                        this.goStudentProfile(student.idStudent, student.name)
                    }}
                        color='#429b00'
                        title="Perfil"/>
                </View>
            </View>
        )
    }

    // Método que renderiza el listado alumnos
    renderStudentsList(students, IEStatus, index) {
        let arrowRotation = this.state.selectedItems[index] ? 
            [{rotate: '-180deg'}] : [{rotate: '0deg'}]
        let studentsElements = this.state.selectedItems[index] ? students.map((student, index) => {
            return(this.renderStudentElement(student, index)) 
        }) : null
        return(
            <View key={index}>
                <TouchableOpacity style={styles.ColapsableTouchable}
                    onPress={() => {
                        let tmp = this.state.selectedItems
                        tmp[index] = !this.state.selectedItems[index]
                        this.setState({
                            selectedItems: tmp
                        });
                    }}>
                    <View style={[styles.flowRight]}>
                        <View style={styles.SubItemText}>
                            <Text style={styles.touchableText}> { IEStatus } </Text>
                        </View>
                        <Image source={require('../Images/expand-arrow.png')} 
                            style={[styles.ArrowImage, {transform: arrowRotation}, {marginRight: '20%'}]}/>
                    </View>
                </TouchableOpacity>
                { studentsElements }
            </View>
        )
    }

    static navigationOptions = {
        title: 'Lista del curso'
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
        let completeListComponent = this.renderStudentsList(this.state.completeList, "Indicador completado", 0)
        let incompleteListComponent = this.renderStudentsList(this.state.incompleteList, "Indicador no completado", 1)
        
        return(
            <ScrollView style={styles.backColor}>
                <Text style={styles.titleText}> {this.state.course} </Text>
                { completeListComponent }
                { incompleteListComponent }
            </ScrollView>
        )
    }
}
const height = Dimensions.get('window').height * 0.04;
const width = Dimensions.get('window').height * 0.8;
const styles = StyleSheet.create({
    touchableText: {
        fontSize: 16,
        color: 'black'  
    },
    textProfileContainer: {
        width: '66%',
        alignItems: 'center'
    },
    profileContainer: {
        borderWidth: 1.5,
        borderRadius: 8,
        borderColor: '#429b00',
        marginLeft: '10%',
        marginRight: '10%',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10
    },
    titleText: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: '7%',
        marginBottom: '7%',
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
    backColor: {
        backgroundColor: '#FFFFFF'
    },
    button: {
        marginRight: '5%',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        width: '30%'
    },
    titleText: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: '7%',
        marginBottom: '7%',
    },
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    ColapsableTouchable: {
        marginLeft: 4,
        marginRight: 4,
        width: width,
        backgroundColor: '#f7ffe6'
    },
    ArrowImage: {
        width: '4%',
        height: height,
        marginTop: 8
    },
    SubItemText: {
        marginTop: 8,
        marginRight: '10%',
        width: '55%',
        alignItems: 'center'
    },
})