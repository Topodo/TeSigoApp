import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { Camera, Permissions } from 'expo'

export default class ShowCamera extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hasCameraPermission: null,
            type: Camera.Constants.Type.back
        }
    }

    async componentWillMount() {
        //Getting Permission result from app details.
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
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
            return (
                <View>
                    <Camera type={this.state.type} />
                </View>
            )
        }
    }
}