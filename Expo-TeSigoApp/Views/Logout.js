import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import * as firebase from 'firebase';

export default class Logout extends React.Component {
    constructor(props) {
        super(props)
    }
    async componentDidMount() {
        try {
            await firebase.auth().signOut()
            this.props.navigation.navigate('Login')
        } catch (error) {
            console.error(error)
        }
    }

    static navigationOptions = {
        title: 'Cerrar sesión',
        header: null
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={[styles.textContainer, { marginTop: '30%' }]}>
                    <Text style={styles.text}> Cerrando sesión</Text>
                </View>
                <View style={styles.activityIndicator}>
                    <ActivityIndicator size='large' />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'green'
    },
    textContainer: {
        marginLeft: '10%',
        marginRight: '10%',
    },
    text: {
        textAlign: 'center',
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
    },
    activityIndicator: {
        margin: 'auto',
        marginTop: '4%'
    }
})