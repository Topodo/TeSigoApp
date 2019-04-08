import React, { Component } from 'react'
import {
    BackHandler,
    StyleSheet,
    View,
    Text,
    Button,
    Alert,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { FormLabel, FormInput } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
    Calendar,
    LocaleConfig
} from 'react-native-calendars'
import APIHandler from '../../Utils/APIHandler'
import { NavigationEvents } from 'react-navigation'

// Configuración del calendario en español
LocaleConfig.locales['cl'] = {
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['En', 'Feb', 'Mar', 'Ab', 'Ma', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic'],
    dayNames: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    dayNamesShort: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']
}
LocaleConfig.defaultLocale = 'cl'

export default class CreateReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            professorName: '',
            reportName: '',
            reportDescription: '',
            reportDate: '',
            idStudent: 1,
            studentName: '',
            course: '',
            showCalendar: false,
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
        BackHandler.addEventListener('hardwareBackPress', this.goBack)
        const { params } = this.props.navigation.state
        this.setState({
            idStudent: params.idStudent,
            studentName: params.studentName,
            course: params.course
        })
    }

    goBack = () => {
        this.props.navigation.goBack()
        return true
    }

    componentDidFocus() {
        BackHandler.addEventListener('hardwareBackPress', this.goBack)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.goBack)
    }

    // Método que redirige la navegación a la vista del listado de reportes del alumno, luego de subir el reporte
    goReportsList() {
        if (this.state.reportName === '' || this.state.reportDescription === '' || this.state.reportDate === '') {
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
                asunto: this.state.reportName,
                fecha: this.state.reportDate
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
            .catch(error => {
                Alert.alert(
                    'Creación de reporte',
                    'Ocurrió un error interno, inténtelo nuevamente',
                    [{ text: 'OK' }]
                )
            })
    }

    render() {
        let calendar = this.state.showCalendar ?
            <Calendar onDayPress={day => {
                this.setState({
                    reportDate: day.dateString,
                    showCalendar: false
                })
            }} /> : null
        let calendarArrow = this.state.showCalendar ?
            [{ rotate: '-180deg' }] : [{ rotate: '0deg' }]
        return (
            <KeyboardAwareScrollView style={styles.backColor}>
                <NavigationEvents
                    onDidFocus={payload => this.componentDidFocus()} />
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
                <FormInput onChangeText={text => this.setState({ reportDescription: text })}
                    containerStyle={styles.InputContainer}
                    multiline />
                <TouchableOpacity onPress={() => this.setState({ showCalendar: !this.state.showCalendar })}>
                    <View style={[styles.flowRight, { marginBottom: '12%' }]}>
                        <FormLabel>
                            Fecha del reporte
                        </FormLabel>
                        <Image source={require('../Images/expand-arrow.png')}
                            style={[styles.ArrowImage, { transform: calendarArrow }]} />
                    </View>
                </TouchableOpacity>
                <Text style={styles.dateText}>
                    {this.state.reportDate}
                </Text>
                {calendar}
                <View style={styles.button}>
                    <Button title="Crear reporte"
                        color='#429b00'
                        onPress={() => {
                            this.goReportsList()
                        }} />
                </View>
            </KeyboardAwareScrollView>
        )
    }
}

const height = Dimensions.get('window').height * 0.03;

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
    dateText: {
        marginLeft: '5%',
        fontSize: 12
    },
    ArrowImage: {
        width: '3%',
        height: height,
        marginTop: 12
    },
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
})

