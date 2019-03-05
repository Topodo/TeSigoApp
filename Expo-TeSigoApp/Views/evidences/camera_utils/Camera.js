import React from "react"
import { StyleSheet, Text, View, Dimensions, Slider, Image } from "react-native"
import { Camera, Permissions, Audio } from 'expo'
import { Icon } from 'native-base'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export default class ShowCamera extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hasCameraPermission: null,
            type: Camera.Constants.Type.back,
            flashOn: false,
            zoomValue: 0,
            image: null
        }
    }

    async componentWillMount() {
        //Getting Permission result from app details.
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    // Método que se encarga de tomar la foto
    async snap() {
        if (this.camera) {
            let photo = await this.camera.takePictureAsync()
            const soundObject = new Audio.Sound();
            try {
                await soundObject.loadAsync(require('../../../audio/camera-shutter-click-08.mp3'));
                await soundObject.playAsync();
                await this.setState({
                    image: photo
                })
            } catch (error) {
                console.error(error)
            }

            console.log(photo) // Enviar foto a formulario
        }
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
            if (this.state.image === null) { // Si la imagen no ha sido tomada o ha sido descartada

                let flashIcon = this.state.flashOn ? 'ios-flash' : 'ios-flash-off'
                let flashState = this.state.flashOn ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off
                
                return (
                    <View>
                        <View style={styles.cameraview}>
                            <Camera style={styles.camera} type={this.state.type} 
                                ref={ref => {
                                    this.camera = ref
                                }}
                                flashMode={flashState}
                                zoom={this.state.zoomValue}/>
                        </View>
                        <View style={{backgroundColor: 'black'}}>
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
                                    }}/>
                                <Slider onValueChange={value => {
                                    this.setState({
                                        zoomValue: value
                                    })}}
                                    value={this.state.zoomValue}
                                    style={{width: width * 0.4}}/>
                                <MaterialIcons name='zoom-in' style={styles.zoomIcon} 
                                    onPress={() => {
                                        let { zoomValue } = this.state
                                        if (zoomValue <= 1) {
                                            zoomValue += 0.1
                                        }
                                        this.setState({
                                            zoomValue: zoomValue
                                        })
                                    }}/>
                            </View>
                            <View style={styles.toolbar}>
                                <MaterialCommunityIcons name="circle-outline" style={styles.snap}
                                    onPress={() => {
                                        this.snap()
                                    }}/>
                                <Icon name={flashIcon} style={{ color : 'white' }}
                                    onPress={() => {
                                        this.setState({
                                            flashOn: !this.state.flashOn
                                        })}}/>
                            </View>
                        </View>
                    </View>
                )
            } else {
                return (
                    <View>
                        <Image source={{ uri: this.state.image.uri }} 
                            style={styles.image}/>
                        <View style={styles.imageToolbar}>
                            <MaterialIcons name="delete" style={styles.deleteIcon}
                                onPress={() => {
                                    this.setState({
                                        image: null
                                    })
                                }} />
                            <MaterialIcons name="send" style={styles.sendIcon}
                                onPress={() => {}} />
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
    image: {
        width: width,
        height: height * 0.65,
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
        marginLeft: width * 0.3
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
        height: height * 0.65,
        width: width,
        justifyContent: "center",
        alignItems: "center"
    },
})