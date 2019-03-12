import React from 'react';
import {
    ScrollView,
    View,
    Text,
    Button,
    Picker,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import * as firebase from 'firebase';
import Firebase from '../Utils/firebase'

export default class MainPage extends React.Component {
    constructor(props) {
        Firebase.init()
        super(props)
    }

    componentDidMount() {
        // Se da un tiempo para mostrar la intro de la app
        setTimeout(() => {
            // Se verifica si el usuario está logeado en la aplicación
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    this.props.navigation.navigate('GetCourses', {
                        idProfessor: user.uid
                    })
                } else {
                    this.props.navigation.navigate('Login')
                }
            })
        }, 4000)
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={[styles.textContainer, { marginTop: '30%' }]}>
                    <Text style={styles.text}> Bienvenido/a a TeSigoApp,</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}> la app que te apoyará a llevar el seguimientos de tus estudiantes! </Text>
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
        backgroundColor: 'white'
    },
    textContainer: {
        marginLeft: '10%',
        marginRight: '10%',
    },
    text: {
        textAlign: 'center',
        fontSize: 24
    },
    activityIndicator: {
        margin: 'auto',
        marginTop: '4%'
    }
})