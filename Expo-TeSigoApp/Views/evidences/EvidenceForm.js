import React, { Component } from 'react'
import {
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Image,
    View,
    Dimensions,
    Button
} from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import {
    Calendar,
    LocaleConfig
} from 'react-native-calendars'

import APIHandler from '../../Utils/APIHandler'

// Configuración del calendario en español
LocaleConfig.locales['cl'] = {
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['En', 'Feb', 'Mar', 'Ab', 'Ma', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic'],
    dayNames: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    dayNamesShort: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']
}
LocaleConfig.defaultLocale = 'cl'

export default class EvidenceForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            file: null,
            evidenceName: '',
            evidenceContext: '',
            evidenceDate: '',
            fileType: '',
            showCalendar: false
        }
        this.APIHandler = new APIHandler()
    }

    componentWillMount() {
        /* const { params } = this.props.navigation.state
        this.setState({
            file: params.file,
            fileType: params.fileType
        }) */
    }

    render() {
        let calendar = this.state.showCalendar ? 
            <Calendar onDayPress={day => {
                this.setState({ evidenceDate: day.dateString })
            }}/> : null
        let calendarArrow = this.state.showCalendar ? 
            [{rotate: '-180deg'}] : [{rotate: '0deg'}] 
            
        return(
            <ScrollView style={styles.backColor}>
                <FormLabel>
                    Nombre de la evidencia
                </FormLabel>
                <FormInput onChangeText={text => {
                    this.setState({
                        evidenceName: text
                    })}}
                    containerStyle={styles.InputContainer}/>
                <FormLabel>
                    Contexto de la evidencia
                </FormLabel>
                <FormInput onChangeText={text => {
                    this.setState({
                        evidenceContext: text
                    })}}
                    containerStyle={styles.InputContainer}/>
                <TouchableOpacity onPress={() => this.setState({ showCalendar: !this.state.showCalendar })}>
                    <View style={[styles.flowRight, {marginBottom: '12%'}]}>
                        <FormLabel>
                            Fecha de la evidencia
                        </FormLabel>
                        <Image source={require('../Images/expand-arrow.png')}
                            style={[styles.ArrowImage, {transform: calendarArrow}]}/>
                    </View>
                </TouchableOpacity>
                { calendar }
                <View style={styles.button}>
                    <Button title="Subir archivo"
                            color='#429b00'
                            onPress={() => {}}/>
                </View>
            </ScrollView>
        )
    }
}

const height = Dimensions.get('window').height * 0.03;

// Definición de estilos
const styles = StyleSheet.create({
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
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
        backgroundColor: 'white'
    },
    picker: {
        marginLeft: '20%',
        marginRight: '20%',
        marginBottom: '7%',
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#429b00'
    },
    loadingText: {
        fontSize: 22,
        textAlign: 'center',
        marginBottom: '8%'
    },
    activityIndicator: {
        margin: 'auto',
        marginTop: '4%',
    },
    titleText: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: '7%',
        marginBottom: '7%'
    },
    InputContainer: {
        marginLeft: '5%',
        marginRight: '5%',
        borderWidth: 1.5,
        borderRadius: 8,
        borderColor: '#429b00',
        marginBottom: 10,
        marginTop: 10
    },
    percentage: {
        marginLeft: '5%',
        marginRight: '5%'
    },
    OAText: {
        marginTop: '3%',
        marginLeft: '5%',
        marginRight: '5%',
        width: '60%',
        marginBottom: '3%'
    },
    button: {
        marginLeft: '10%',
        marginRight: '10%',
        textAlign: 'center',
        marginTop: '2%',
        marginBottom: '3%',
        height: 40
    },
    textButton: {
        marginTop: '2%',
        color: '#FFFFFF',
        fontSize: 18,
    },
    CheckBoxStyle: {
        backgroundColor: 'white',
        borderColor: 'white',
        width: '15%',
        marginRight: '10%'
    },
    ArrowImage: {
        width: '3%',
        height: height,
        marginTop: 12
    },
})