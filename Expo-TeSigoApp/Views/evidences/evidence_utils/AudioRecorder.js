import React, { Component } from 'react'
import { Permissions, Audio } from 'expo'
import { StyleSheet, Text, View, Dimensions, Slider, Image } from "react-native"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
var TimeFormat = require('hh-mm-ss')

export default class AudioRecorder extends Component {

    constructor(props) {
        super(props)
        this.state = {
            hasAudioPermission: null,
            audio: null,
            onRecord: false,
            recordTime: 0,
            isPaused: false,
            playedTime: 0,
            audioDuration: 0
        }
    }

    // Método que se encarga de comenzar la grabación
    async recordAudio() {
        this.recording = new Audio.Recording() // Instancia de la grabación
        try {
            await this.setState({
                onRecord: true,
                recordTime: 0
            })
            this.timer = setInterval(() => {
                // Cada un segundo se aumenta el contador
                this.setState({
                    recordTime: this.state.recordTime + 1
                })
            }, 1000)
            await this.recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY)
            await this.recording.startAsync()
        } catch (error) {
            console.error(error)
        }
    }

    // Método que se encarga de detener la grabación
    async stopAudioRecord() {
        await this.recording.stopAndUnloadAsync()
        clearInterval(this.timer)
        const audioUri = await this.recording.getURI()
                
        await this.setState({
            audio: audioUri,
            onRecord: false,
            audioDuration: this.state.recordTime
        })
        console.log(this.state)
    }

    // Método que se encarga de reproducir un preview del audio
    async playAudio() {
        this.soundObject = new Audio.Sound();
        try {
            if (!this.state.isPaused)
                await this.setState({
                    playedTime: 0
                })
            this.timer = setInterval(() => {
                // Se verifica si se terminó la reproducción
                if (this.state.playedTime >= this.state.recordTime)
                    clearInterval(this.timer)
                // Cada un segundo se aumenta el contador
                this.setState({
                    playedTime: this.state.playedTime + 1
                })
            }, 1000)
            await this.soundObject.loadAsync({ uri: this.state.audio });
            await this.soundObject.playAsync();
        } catch (error) {
            console.error(error)
        }
    }

    // Método que se encarga de pausar el audio
    async pauseAudio() {
        clearInterval(this.timer)
        await this.setState({
            isPaused: true
        })
        await this.soundObject.pauseAsync()
    }

    // Método que cierra el audio recorder
    closeAudioRecorder() {
        this.props.closeAudioRecorder()
    }

    // Método que envía la data del audio grabado al componente padre
    sendFileData() {
        this.props.fileData(this.state.audio)
    }

    async componentWillMount() {
        //Getting Permission result from app details.
        const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        this.setState({ hasAudioPermission: status === 'granted' });
    }

    render() {
        // Se verifican los permisos del audio
        if (this.state.hasAudioPermission === null) {
            return (
                <View />
            )
        } else if (this.state.hasAudioPermission === false) {
            return (
                <View>
                    <Text> No hay permisos para usar el audio </Text>
                </View>
            )
        } else {
            if (this.state.audio === null) {
                let audioButton = !this.state.onRecord ?
                    <MaterialCommunityIcons name="microphone" style={styles.recordIcon}
                        onPress={() => {
                            this.recordAudio()
                        }} /> :
                    <Entypo name="controller-stop" style={[styles.recordIcon, { color: 'red' }]}
                        onPress={() => {
                            this.stopAudioRecord()
                        }} />

                return (
                    <View>
                        <View style={styles.timerContainer}>
                            <MaterialIcons name="close" style={styles.closeAudioRecorder}
                                onPress={this.closeAudioRecorder.bind(this)} />
                            <Text style={styles.timerText}> {TimeFormat.fromS(this.state.recordTime, 'hh:mm:ss')} </Text>
                        </View>
                        <View style={styles.toolbar}>
                            {audioButton}
                        </View>
                    </View>
                )
            } else {
                return (
                    <View>
                        <View style={styles.timerContainer}>
                            <Text style={styles.timerText}> {TimeFormat.fromS(this.state.playedTime, 'hh:mm:ss')} </Text>
                        </View>
                        <View style={styles.sliderContainer}>
                            <Slider style={styles.slider}
                                maximumValue={this.state.audioDuration}
                                value={this.state.playedTime}
                                disabled={false} />
                        </View>
                        <View style={styles.audioControl}>
                            <MaterialCommunityIcons name="play" style={styles.sendIcon}
                                onPress={() => {
                                    this.playAudio()
                                }} />
                        </View>
                        <View style={styles.optionsToolbar}>
                            <MaterialIcons name="delete" style={styles.deleteIcon}
                                onPress={() => {
                                    this.setState({
                                        audio: null,
                                        recordTime: 0,
                                        playedTime: 0
                                    })
                                }} />
                            <MaterialIcons name="send" style={styles.sendIcon}
                                onPress={this.sendFileData.bind(this)} />
                        </View>
                    </View>
                )
            }
        }
    }
}

const height = Dimensions.get('screen').height
const width = Dimensions.get('screen').width

const styles = StyleSheet.create({
    audioControl: {
        height: height * 0.1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    sliderContainer: {
        alignItems: 'center',
        height: height * 0.1,
        backgroundColor: 'black'
    },
    slider: {
        width: width * 0.8
    },
    sendIcon: {
        fontSize: height * 0.05,
        color: 'white',
        marginTop: height * 0.05
    },
    deleteIcon: {
        fontSize: height * 0.05,
        color: 'white',
        marginLeft: width * 0.1,
        marginRight: width * 0.6,
        marginTop: height * 0.05
    },
    closeAudioRecorder: {
        color: 'white',
        fontSize: height * 0.05,
        marginTop: height * 0.1
    },
    recordIcon: {
        fontSize: height * 0.3,
        color: 'white'
    },
    timerContainer: {
        backgroundColor: 'black',
        width: width,
        height: height * 0.5,
        alignItems: 'center'
    },
    timerText: {
        color: 'white',
        fontSize: 46,
        marginTop: height * 0.1
    },
    toolbar: {
        width: width,
        height: height * 0.3,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: 'row',
        backgroundColor: 'black'
    },
    optionsToolbar: {
        width: width,
        height: height * 0.15,
        backgroundColor: 'black',
        flexDirection: 'row'
    },
})