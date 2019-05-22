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
import { SecureStore } from 'expo'
import Firebase from '../Utils/firebase'

export default class MainPage extends React.Component {
    constructor(props) {
        Firebase.init()
        super(props)
    }

    componentDidMount() {
        /**
         * El flujo de la página principal de la aplicación consiste de tres casos:
         * 
         * 1.- El primer caso ocurre cuando hay un usuario autentificado en la aplicación
         * y además posee su respectivo JWT (JSON Web Token) almacenado de forma encriptada
         * en el Storage de la aplicación. En este caso, solo se redirige al menú de cursos
         * del usuario.
         * 
         * 2.- El segundo caso ocurre cuando hay un usuario autentificado (Esto ocurre solo
         * con propósitos de desarrollo) pero no tiene un JWT (@var token null). En dicho caso,
         * antes de redirigir la navegación hacia la vista Login, se procede a desautentificar
         * al usuario actual y luego se realiza el cambio de componente.
         * 
         * 3.- El tercer caso ocurre cuando no hay un usuario autentificado ni un JWT en el storage.
         * En dicho caso solo es necesario redirigir la navegación hacia la vista de Login.
         * 
         * Finalmente, se da un total de 2 segundos para mostrar el componente de bienvenida.
         */
        setTimeout(() => {
            SecureStore.getItemAsync('api_tesigoapp_token')
                .then(token =>
                    // Se verifica si el usuario está logeado en la aplicación y si tiene un JWT asociado
                    firebase.auth().onAuthStateChanged(user => {
                        if (user && token) {
                            this.props.navigation.navigate('GetCourses', {
                                idProfessor: user.uid
                            })
                        } else if (user && !token) {
                            firebase.auth().signOut()
                            this.props.navigation.navigate('Login')
                        } else {
                            this.props.navigation.navigate('Login')
                        }
                    })
                )
        }, 2000)
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={[styles.textContainer, { marginTop: '40%' }]}>
                    <Text style={styles.text}> Bienvenido/a a TeSigoApp,</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}> la app que te apoyará a llevar el seguimientos de tus estudiantes! </Text>
                </View>
                <View style={styles.activityIndicator}>
                    <ActivityIndicator size='large' color='blue' />
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
        fontWeight: 'bold',
        color: 'white'
    },
    activityIndicator: {
        margin: 'auto',
        marginTop: '7%'
    }
})