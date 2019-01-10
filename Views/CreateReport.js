import React, { Component } from 'react'
import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    Button
} from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import APIHandler from '../Utils/APIHandler'

export default class CreateReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            professorName: '',
            reportName: '',
            reportDescription: '',
            idStudent: -1,
            studentName: '',
            course: ''
        }
        this.APIHandler = new APIHandler()
    }

    static navigationOptions = {
        title: 'Crear reporte'
    }

    componentWillMount() {
        /* const { params } = this.props.navigation.state
        this.setState({
            idStudent: params.idStudent,
            studentName: params.studentName,
            course: params.course
        }) */
    }

    // Método que redirige la navegación a la vista del listado de reportes del alumno, luego de subir el reporte
    goReportsList() {
        
    }

    render() {
        return(
            <ScrollView style={styles.backColor}>
                <Text style={styles.titleText}>
                    {this.state.studentName + ' - ' + this.state.course}
                </Text>
                <FormLabel> Asunto del reporte </FormLabel>
                <FormInput onChangeText={text => {
                    this.setState({
                        reportName: text
                    })}}
                    containerStyle={styles.InputContainer}
                    multiline/>
                <FormLabel> Descripción del reporte </FormLabel>
                <FormInput onChangeText={text => {
                    this.setState({
                        reportDescription: text
                    })}}
                    containerStyle={styles.InputContainer}
                    multiline/>
                <View style={styles.button}>
                    <Button title="Crear reporte"
                        color='#429b00'
                        onPress={() => {}}/>
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

