import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Image
} from 'react-native'

export default class NetworkError extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false
        }
    }

    // Método que cambia el estado del componente padre para solicitarle cargar nuevamente la data
    parentFetchData() {
        this.props.parentFetchData()
    }

    renderButtonOrLoader() {
        if (this.state.isLoading)
            return (
                <ActivityIndicator size='large' />
            )
        else
            return (
                <TouchableOpacity
                    style={styles.reloadButton}
                    onPress={this.parentFetchData.bind(this)}>
                    <Image
                        style={styles.reloadImage}
                        source={require('../Images/reload.png')} />
                </TouchableOpacity>
            )
    }

    render() {
        return (
            <View style={styles.background}>
                <View style={styles.activityIndicator}>
                    <Text style={styles.loadingText}>
                        Error al cargar los datos, inténtelo nuevamente.
                </Text>
                    {this.renderButtonOrLoader()}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        alignItems: 'center'
    },
    activityIndicator: {
        margin: 'auto',
        marginTop: '50%'
    },
    loadingText: {
        fontSize: 22,
        textAlign: 'center',
        marginBottom: '8%',
        marginTop: '5%'
    },
    reloadButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        alignSelf: 'center'
    },
    reloadImage: {
        width: 40,
        height: 40,
    }
})