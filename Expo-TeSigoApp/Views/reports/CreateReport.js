import React, { Component } from 'react'
import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    Button,
    Alert
} from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import APIHandler from '../../Utils/APIHandler'

export default class CreateReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            professorName: '',
            reportName: '',
            reportDescription: '',
            idStudent: 1,
            studentName: '',
            course: ''
        }
        this.APIHandler = new APIHandler()
    }

    static navigationOptions = {
        title: 'Crear reporte',
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

    componentWillMount() {
        const { params } = this.props.navigation.state
        this.setState({
            idStudent: params.idStudent,
            studentName: params.studentName,
            course: params.course
        })
    }

    // Método que redirige la navegación a la vista del listado de reportes del alumno, luego de subir el reporte
    goReportsList() {
        if (this.state.reportName === '' || this.state.reportDescription === '') {
            Alert.alert(
                'Creación de reporte',
                'Todos los campos son obligatorios',
                [{ text: 'OK' }]
            )
            return;
        }
        this.APIHandler.postToAPI('http://206.189.195.214:8080/api/alumno/' + this.state.idStudent + '/reporte/nuevo',
            {
                nombreProfesor: this.state.professorName,
                descripcionReporte: this.state.reportDescription,
                asunto: this.state.reportName
            })
            .then(response => {
                // Una vez se haya realizado los cambios, se lanza una alerta indicando si hubo éxito o no
                let title = 'Creación de reporte'
                let subTitle = 'Reporte creado correctamente'
                if (response.status) {
                    subTitle = 'Ocurrió un error interno, inténtelo nuevamente'
                }
                // Se lanza una alerta indicando el estado de la actualización
                Alert.alert(
                    title,
                    subTitle,
                    [{ text: 'OK' }]
                )
            })
            .then(() => {
                this.props.navigation.navigate('ReportsList', {
                    idStudent: this.state.idStudent,
                    studentName: this.state.studentName,
                    course: this.state.course
                })
            })
    }

    render() {
        return (
            <ScrollView style={styles.backColor}>
                <Text style={styles.titleText}>
                    {this.state.studentName + ' - ' + this.state.course}
                </Text>
                <FormLabel> Asunto del reporte </FormLabel>
                <FormInput onChangeText={text => {
                    this.setState({
                        reportName: text
                    })
                }}
                    containerStyle={styles.InputContainer}
                    multiline />
                <FormLabel> Descripción del reporte </FormLabel>
                <FormInput onChangeText={text => {
                    this.setState({
                        reportDescription: text
                    })
                }}
                    containerStyle={styles.InputContainer}
                    multiline />
                <View style={styles.button}>
                    <Button title="Crear reporte"
                        color='#429b00'
                        onPress={() => {
                            this.goReportsList()
                        }} />
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    backColor: {
        backgroundColor: 'white'
    },
    InputContainer: {
        marginLeft: '5%',
        marginRight: '5%',
        borderWidth: 1.5,
        borderRadius: 8,
        borderColor: '#429b00',
        marginBottom: 10,
        marginTop: 10,
    },
    button: {
        marginLeft: '5%',
        marginRight: '5%',
        textAlign: 'center',
        marginTop: '5%',
        marginBottom: '3%',
        height: 40
    },
    titleText: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: '7%',
        marginBottom: '7%'
    },
})

