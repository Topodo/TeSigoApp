import React, { Component } from 'react'
import { ScrollView, Text, Button, StyleSheet, Dimensions, View, Alert, TouchableOpacity } from 'react-native'
import { ImagePicker, DocumentPicker } from 'expo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ShowCamera from './evidence_utils/Camera'
import VideoRecorder from './evidence_utils/VideoRecorder'
import AudioRecorder from './evidence_utils/AudioRecorder'
import Modal from 'react-native-modal'

export default class SelectEvidence extends Component {
    constructor(props) {
        super(props)
        this.state = {
            idStudent: -1,
            studentName: null,
            idCourse: -1,
            courseName: null,
            fileType: 0, // 0: Menu, 1: Foto, 2: Video, 3: Audio
            mode: 0,
            file: null,
            onDevice: false, // false si el archivo se grabará en tiempo real, true si el archivo está en la memoria del dispositivo
            showModal: false,
            modalOptionsTitles: null
        }
    }

    static navigationOptions = {
        title: "Evidencia cualitativa"
    }

    // Método que redirige la navegación hacia la vista con el formulario de la evidencia
    goToForm() {
        if (this.state.file === null) {
            // Si no se ha seleccionado un archivo se envía una alerta al usuario
            Alert.alert(
                "No hay evidencia",
                "No se ha seleccionado un archivo como evidencia. Inténtelo nuevamente.",
                [{ text: "OK" }]
            )
        } else {
            this.props.navigation.navigate('EvidenceForm', {
                file: this.state.file,
                fileType: this.state.fileType,
                idStudent: this.state.idStudent,
                studentName: this.state.studentName,
                idCourse: this.state.idCourse,
                courseName: this.state.courseName
            })
        }
    }

    // Método que recibe la data del archivo desde los componentes hijos
    receiveData(data) {
        this.setState({
            file: data,
            mode: 0
        })
    }

    // Método que recibe un cambio en el modo de la vista desde los componentes hijos
    setMenuMode() {
        this.setState({
            mode: 0
        })
    }

    // Método que renderiza un modal para seleccionar el origen de los archivos
    renderOptionsModal() {
        return (
            <Modal style={styles.modal}
                onBackdropPress={() => this.setState({ showModal: false })}
                onSwipeComplete={() => this.setState({ showModal: false })}
                swipeDirection="down"
                isVisible={this.state.showModal}>
                <TouchableOpacity style={styles.touchable}
                    onPress={() => {
                        this.setState({
                            showModal: false,
                            onDevice: true,
                            fileType: 1,
                        })
                        this.renderCameraRoll(ImagePicker.MediaTypeOptions.Images, 1)
                    }}>
                    <Text style={styles.touchableText}> Seleccionar fotografía </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touchable}
                    onPress={() => {
                        this.setState({
                            showModal: false,
                            onDevice: true,
                            fileType: 2,
                        })
                        this.renderCameraRoll(ImagePicker.MediaTypeOptions.Videos, 2)
                    }}>
                    <Text style={styles.touchableText}> Seleccionar video </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touchable}
                    onPress={() => {
                        this.setState({
                            showModal: false,
                            onDevice: true,
                            fileType: 3,
                        })
                        this.renderAudioPicker()
                    }}>
                    <Text style={styles.touchableText}> Seleccionar audio </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touchable}
                    onPress={() => {
                        this.setState({
                            showModal: false,
                        })
                    }}>
                    <Text style={[styles.touchableText, { color: 'red' }]}> Cancelar </Text>
                </TouchableOpacity>
            </Modal>
        )
    }

    // Método que renderiza el menú principal
    renderMenu() {
        let selectedFile = this.state.file ?
            <View style={[styles.iconContainer, { marginTop: 30 }]}>
                <MaterialIcons name="check-circle" style={[styles.icon, { fontSize: Dimensions.get('screen').height * 0.05 }]} />
                <Text style={styles.iconText}> Evidencia seleccionada </Text>
            </View> : null

        return (
            <ScrollView style={styles.backColor}>
                <Text style={styles.titleText}>
                    {this.state.studentName + ' - ' + this.state.courseName}
                </Text>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name="camera" style={styles.icon}
                        onPress={() => {
                            this.setState({
                                mode: 1,
                                fileType: 1
                            })
                        }} />
                    <Text style={styles.iconText}> Fotografía </Text>
                </View>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name="video" style={styles.icon}
                        onPress={() => {
                            this.setState({
                                mode: 2,
                                fileType: 2
                            })
                        }} />
                    <Text style={styles.iconText}> Video </Text>
                </View>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name="volume-high" style={styles.icon}
                        onPress={() => {
                            this.setState({
                                mode: 3,
                                fileType: 3
                            })
                        }} />
                    <Text style={styles.iconText}> Audio </Text>
                </View>
                {selectedFile}
                <View style={styles.button}>
                    <Button color='green' title="Buscar archivo en el dispositivo"
                        onPress={() => { this.setState({ showModal: true }) }} />
                </View>
                <View style={styles.button}>
                    <Button color='green' title="Subir evidencia"
                        onPress={() => { this.goToForm() }} />
                </View>
                {this.renderOptionsModal()}
            </ScrollView>
        )
    }

    // Método que renderiza la cámara
    renderCamera() {
        return (
            <View>
                <ShowCamera fileData={this.receiveData.bind(this)} closeCamera={this.setMenuMode.bind(this)} />
            </View>
        )
    }

    // Método que renderiza la cámara
    renderVideoRecorder() {
        return (
            <View>
                <VideoRecorder fileData={this.receiveData.bind(this)} closeCamera={this.setMenuMode.bind(this)} />
            </View>
        )
    }

    // Método que renderiza el audio recorder
    renderAudioRecorder() {
        return (
            <View>
                <AudioRecorder fileData={this.receiveData.bind(this)} closeAudioRecorder={this.setMenuMode.bind(this)} />
            </View>
        )
    }

    // Método que abre la galería de imágenes
    async renderCameraRoll(mediaType, fileType) {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
            mediaTypes: mediaType
        })
        if (!result.cancelled) {
            this.setState({
                file: result.uri,
                fileType: fileType,
                mode: 0,
                onDevice: false
            })
        } else {
            this.setState({
                mode: 0,
                onDevice: false
            })
        }
    }

    // Método que abre la galería de archivos de audio
    async renderAudioPicker() {
        let result = await DocumentPicker.getDocumentAsync({
            type: 'audio/*'
        })
        if (!result.cancelled) {
            this.setState({
                file: result.uri,
                fileType: 3,
                mode: 0,
                onDevice: false
            })
        } else {
            this.setState({
                mode: 0,
                onDevice: false
            })
        }
    }

    async componentWillMount() {
        const { params } = this.props.navigation.state
        await this.setState({
            idStudent: params.idStudent,
            studentName: params.studentName,
            idCourse: params.idCourse,
            courseName: params.courseName
        })
    }

    render() {
        // Switch-case para verificar el modo de la vista, según el tipo de archivo
        switch (this.state.mode) {
            case 0: // Menú
                return (
                    this.renderMenu()
                )
            case 1: // Fotografías
                if (!this.state.onDevice)
                    return (this.renderCamera())

            case 2: // Videos
                if (!this.state.onDevice)
                    return (this.renderVideoRecorder())

            case 3: // Audio
                if (!this.state.onDevice)
                    return (this.renderAudioRecorder())
        }
    }
}

const styles = StyleSheet.create({
    titleText: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: '7%',
        marginBottom: '7%'
    },
    backColor: {
        backgroundColor: '#FFFFFF'
    },
    icon: {
        fontSize: Dimensions.get('screen').height * 0.1,
        color: 'green'
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    iconText: {
        fontSize: 16,
        textAlign: 'center',
    },
    button: {
        marginLeft: '25%',
        textAlign: 'center',
        marginTop: 20,
        width: '50%'
    },
    touchable: {
        height: '20%',
        width: Dimensions.get('screen').width * 0.8,
        alignItems: 'center',
    },
    touchableText: {
        fontSize: 20,
        color: 'black'
    },
    modal: {
        borderRadius: 8,
        marginTop: Dimensions.get('screen').height * 0.55,
        marginLeft: Dimensions.get('screen').width * 0.1,
        width: Dimensions.get('screen').width * 0.8,
        alignItems: 'center',
        backgroundColor: 'white'
    }
})