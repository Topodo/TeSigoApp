import React from "react"
import { StyleSheet, Text, View, Dimensions, Slider, Image } from "react-native"
import { Camera, Permissions, Video } from 'expo'
import { Icon } from 'native-base'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
var TimeFormat = require('hh-mm-ss')

export default class ShowCamera extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hasCameraPermission: null,
            type: Camera.Constants.Type.back,
            flashOn: false,
            zoomValue: 0,
            video: null,
            onRecord: false,
            recordTime: 0
        }
    }

    async componentWillMount() {
        //Getting Permission result from app details.
        const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.AUDIO_RECORDING);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    // Método que envía la data de la fotografía tomada al componente padre
    sendFileData() {
        this.props.fileData(this.state.video.uri)
    }

    // Método que cierra la cámara
    closeCamera() {
        this.props.closeCamera()
    }

    // Método que se encarga de comenzar la grabación
    async recordVideo() {
        if (this.camera) {
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
            let video = await this.camera.recordAsync({
                quality: Camera.Constants.VideoQuality['720p']
            })
            await this.setState({
                video: video
            })
        }
    }

    // Método que se encarga de detener la grabación
    stopVideoRecord() {
        this.camera.stopRecording()
        clearInterval(this.timer)
        this.setState({
            onRecord: false,
        })
    }

    render() {
        // Se verifican los permisos de la cámara
        if (this.state.hasCameraPermission === null) {
            return (
                <View />
            )
        } else if (this.state.hasCameraPermission === false) {
            return (
                <View>
                    <Text> No hay permisos para usar la cámara </Text>
                </View>
            )
        } else {
            if (this.state.video === null) { // Si la imagen no ha sido tomada o ha sido descartada

                let flashIcon = this.state.flashOn ? 'ios-flash' : 'ios-flash-off'
                let flashState = this.state.flashOn ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off
                let videoButton = !this.state.onRecord ?
                    <Entypo name="controller-record" style={styles.snap}
                        onPress={() => {
                            this.recordVideo()
                        }} /> :
                    <Entypo name="controller-stop" style={[styles.snap, { color: 'red' }]}
                        onPress={() => {
                            this.stopVideoRecord()
                        }} />

                return (
                    <View>
                        <View style={styles.timerContainer}>
                            <Text style={styles.timerText}>{TimeFormat.fromS(this.state.recordTime, 'hh:mm:ss')}</Text>
                        </View>
                        <View style={styles.cameraview}>
                            <Camera style={styles.camera} type={this.state.type}
                                ref={ref => {
                                    this.camera = ref
                                }}
                                flashMode={flashState}
                                zoom={this.state.zoomValue} />
                        </View>
                        <View style={{ backgroundColor: 'black' }}>
                            <View style={styles.zoomSlider}>
                                <MaterialIcons name='zoom-out' style={styles.zoomIcon}
                                    onPress={() => {
                                        let { zoomValue } = this.state
                                        if (zoomValue >= 0) {
                                            zoomValue -= 0.1
                                        }
                                        this.setState({
                                            zoomValue: zoomValue
                                        })
                                    }} />
                                <Slider onValueChange={value => {
                                        this.setState({
                                            zoomValue: value
                                        })
                                    }}
                                    style={{ width: width * 0.4 }} />
                                <MaterialIcons name='zoom-in' style={styles.zoomIcon}
                                    onPress={() => {
                                        let { zoomValue } = this.state
                                        if (zoomValue <= 1) {
                                            zoomValue += 0.1
                                        }
                                        this.setState({
                                            zoomValue: zoomValue
                                        })
                                    }} />
                            </View>
                            <View style={styles.toolbar}>
                                <MaterialIcons name="close" style={styles.closeCamera}
                                    onPress={this.closeCamera.bind(this)} />
                                {videoButton}
                                <Icon name={flashIcon} style={{ color: 'white' }}
                                    onPress={() => {
                                        this.setState({
                                            flashOn: !this.state.flashOn
                                        })
                                    }} />
                            </View>
                        </View>
                    </View>
                )
            } else {
                return (
                    <View>
                        <View style={styles.timerContainer} />
                        <Video source={{ uri: this.state.video.uri }}
                            rate={1.0}
                            volume={1.0}
                            isMuted={false}
                            resizeMode="cover"
                            shouldPlay
                            style={styles.image} />
                        <View style={styles.imageToolbar}>
                            <MaterialIcons name="delete" style={styles.deleteIcon}
                                onPress={() => {
                                    this.setState({
                                        video: null,
                                        recordTime: 0
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
    timerContainer: {
        backgroundColor: 'black',
        width: width,
        height: height * 0.05,
        alignItems: 'center'
    },
    timerText: {
        color: 'white',
        fontSize: 16,
    },
    sendIcon: {
        fontSize: height * 0.05,
        color: 'white',
        marginTop: height * 0.05
    },
    closeCamera: {
        color: 'white',
        fontSize: height * 0.05
    },
    deleteIcon: {
        fontSize: height * 0.05,
        color: 'white',
        marginLeft: width * 0.1,
        marginRight: width * 0.6,
        marginTop: height * 0.05
    },
    image: {
        width: width,
        height: height * 0.6,
    },
    imageToolbar: {
        width: width,
        height: height * 0.15,
        backgroundColor: 'black',
        flexDirection: 'row'
    },
    zoomSlider: {
        backgroundColor: 'black',
        width: width * 0.6,
        height: height * 0.05,
        marginLeft: width * 0.2,
        flexDirection: 'row'
    },
    zoomIcon: {
        color: 'white',
        fontSize: height * 0.05,
    },
    snap: {
        color: 'white',
        fontSize: height * 0.1,
        marginRight: width * 0.25,
        marginLeft: width * 0.225
    },
    toolbar: {
        width: width,
        height: height * 0.1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: 'row'
    },
    camera: {
        height: "100%",
        width: "100%",
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center"
    },
    cameraview: {
        height: height * 0.6,
        width: width,
        justifyContent: "center",
        alignItems: "center"
    },
})