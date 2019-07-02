import React, { Component } from 'react'
import {
    BackHandler,
    TouchableOpacity,
    StyleSheet,
    Image,
    View,
    Dimensions,
    Button,
    Alert,
    ActivityIndicator,
    Text
} from 'react-native';
import { FormLabel, FormInput } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
    Calendar,
    LocaleConfig
} from 'react-native-calendars'
import * as firebase from 'firebase';
import APIHandler from '../../Utils/APIHandler'
import { NavigationEvents } from 'react-navigation'
import { ImageManipulator } from 'expo'
// Configuración del calendario en español
LocaleConfig.locales['cl'] = {
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['En', 'Feb', 'Mar', 'Ab', 'Ma', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic'],
    dayNames: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    dayNamesShort: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']
}
LocaleConfig.defaultLocale = 'cl'

console.disableYellowBox = true;

export default class EvidenceForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            file: null,
            evidenceName: '',
            evidenceContext: '',
            evidenceDate: '',
            fileType: '',
            showCalendar: false,
            idStudent: -1,
            studentName: null,
            idCourse: -1,
            courseName: null,
            isUploading: false,
            progress: 0
        }
        this.APIHandler = new APIHandler()
    }

    static navigationOptions = {
        title: 'Formulario de evidencia',
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

    // Método encargado de subir el archivo a Firebase, para luego subir el formulario hacia la base de datos
    async uploadFileToFirebase(uri) {
        // Se verifica que los campos hayan sido completados
        if (this.state.evidenceName === '' || this.state.evidenceContext === '' || this.state.evidenceDate === '') {
            Alert.alert(
                'Los campos y fecha son obligatorios',
                'Alguno de los campos no han sido completados, inténtelo nuevamente',
                [{ text: 'OK' }]
            )
            return;
        }
        else if (this.checkIfExists(this.state.evidenceName)) // Se verifica que la evidencia no exista
            return;
        else { // Se procede a subir el archivo
            await this.setState({
                isUploading: true
            })
            // si es una imagen, se cambia el formato de esta a PNG
            if (this.state.fileType === 'photo') {
                const imagePNG = await ImageManipulator.manipulateAsync(
                    uri,
                    [],
                    { compress: 1, format: 'png', base64: false }
                )
                uri = imagePNG.uri
            }
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                    console.log(e);
                    reject(new TypeError('Network request failed'));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', uri, true);
                xhr.send(null);
            });

            const ref = firebase
                .storage()
                .ref()
                .child(this.state.evidenceName.replace(' ', ''));

            const snapshot = ref.put(blob)

            // Se maneja el progreso de subida del archivo
            snapshot.on(firebase.storage.TaskEvent.STATE_CHANGED, uploadTask => {
                let progress = (uploadTask.bytesTransferred / uploadTask.totalBytes)
                this.setState({
                    progress: progress
                })
            }, error => console.error(error)
                , () => {
                    snapshot.snapshot.ref.getDownloadURL().then(downloadURL => {
                        // Se sube el formulario a la base de datos
                        this.APIHandler.postToAPI('http://206.189.195.214:8080/api/formularioEvidencia/alumno/' + this.state.idStudent, {
                            nombreEvidencia: this.state.evidenceName,
                            contextoEvidencia: this.state.evidenceContext,
                            fechaEvidencia: this.state.evidenceDate,
                            firebaseID: downloadURL,
                            tipoEvidencia: this.state.fileType
                        }).then(response => {
                            this.setState({
                                isUploading: false
                            }) // Una vez se haya realizado los cambios, se lanza una alerta indicando si hubo éxito o no
                            let title = 'Formulario creado'
                            let subTitle = 'Formulario creado y evidencia subida correctamente'
                            if (response.status) {
                                title = "Error al cargar los datos"
                                subTitle = 'Ocurrió un error interno, inténtelo nuevamente'
                            }
                            // Se lanza una alerta indicando el estado de la actualización
                            Alert.alert(
                                title,
                                subTitle,
                                [{ text: 'OK' }]
                            )
                            this.props.navigation.navigate('GetEvidence', {
                                idStudent: this.state.idStudent,
                                studentName: this.state.studentName,
                                course: this.state.courseName
                            })
                        })
                        blob.close();
                    })
                })
        }
    }

    // Método que verifica si una evidencia ya existe en la base de datos
    checkIfExists(evidenceName) {
        this.APIHandler.getFromAPI('http://206.189.195.214:8080/api/formularioEvidencia/alumno/' + this.state.idStudent)
            .then(response => {
                response.forEach(evidences => {
                    evidences.evidencias.forEach(evidence => {
                        if (evidence.nombreEvidencia === evidenceName) {
                            // Se lanza una alerta indicando que se debe cambiar el nombre de la evidencia
                            Alert.alert(
                                'Evidencia existente',
                                'Ya existe una evidencia con este nombre, por favor ingrese uno nuevo',
                                [{ text: 'OK' }]
                            )
                            return true
                        }
                    })
                })
            })
        return false
    }

    getFileType(typeID) {
        switch (typeID) {
            case 1:
                return 'photo'
            case 2:
                return 'video'
            case 3:
                return 'audio'
        }
    }

    renderActivityIndicator() {
        return (
            <View style={styles.uploadStatusContainer}>
                <Text style={styles.uploadText}>
                    {`Subiendo la evidencia ${Math.round(this.state.progress * 100).toString()}%`}
                </Text>
                <ActivityIndicator size='small' />
            </View>
        )
    }

    renderUploadButton() {
        return (
            <View style={styles.button}>
                <Button title="Subir archivo"
                    color='#429b00'
                    onPress={() => { this.uploadFileToFirebase(this.state.file) }} />
            </View>
        )
    }

    goBack = () => {
        this.props.navigation.goBack()
        return true
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.goBack)
        const { params } = this.props.navigation.state
        this.setState({
            file: params.file,
            fileType: this.getFileType(params.fileType),
            idStudent: params.idStudent,
            studentName: params.studentName,
            idCourse: params.idCourse,
            courseName: params.courseName,
        })
    }

    componentDidFocus() {
        BackHandler.addEventListener('hardwareBackPress', this.goBack)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.goBack)
    }

    render() {
        let calendar = this.state.showCalendar ?
            <Calendar onDayPress={day => {
                this.setState({
                    evidenceDate: day.dateString,
                    showCalendar: false
                })
            }} /> : null
        let calendarArrow = this.state.showCalendar ?
            [{ rotate: '-180deg' }] : [{ rotate: '0deg' }]

        let uploadStatus = this.state.isUploading ? this.renderActivityIndicator() : this.renderUploadButton()
        return (
            <KeyboardAwareScrollView style={styles.backColor}
                enableOnAndroid={true}>
                <NavigationEvents
                    onDidFocus={payload => this.componentDidFocus()} />
                <FormLabel>
                    Nombre de la evidencia
                </FormLabel>
                <FormInput onChangeText={text => {
                    this.setState({
                        evidenceName: text
                    })
                }}
                    containerStyle={styles.InputContainer} />
                <FormLabel>
                    Contexto de la evidencia
                </FormLabel>
                <FormInput onChangeText={text => {
                    this.setState({
                        evidenceContext: text
                    })
                }}
                    containerStyle={styles.InputContainer} />
                <TouchableOpacity onPress={() => this.setState({ showCalendar: !this.state.showCalendar })}>
                    <View style={[styles.flowRight, { marginBottom: '12%' }]}>
                        <FormLabel>
                            Fecha de la evidencia
                        </FormLabel>
                        <Image source={require('../Images/expand-arrow.png')}
                            style={[styles.ArrowImage, { transform: calendarArrow }]} />
                    </View>
                </TouchableOpacity>
                <Text style={styles.dateText}>
                    {this.state.evidenceDate}
                </Text>
                {calendar}
                {uploadStatus}
            </KeyboardAwareScrollView>
        )
    }
}

const height = Dimensions.get('window').height * 0.03;

// Definición de estilos
const styles = StyleSheet.create({
    dateText: {
        marginLeft: '5%',
        fontSize: 12
    },
    uploadStatusContainer: {
        height: 80,
        marginTop: 10,
        marginBottom: 10
    },
    uploadText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 7
    },
    loadingText: {
        fontSize: 22,
        textAlign: 'center',
        marginBottom: '8%',
        marginTop: '5%'
    },
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    activityIndicator: {
        margin: 'auto',
        marginTop: '4%'
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