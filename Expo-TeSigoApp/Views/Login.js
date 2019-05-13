/*
    Página utilizada para logear en la aplicación
 */

import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    BackHandler,
    AsyncStorage
} from 'react-native';
import { SecureStore } from 'expo'
import * as firebase from 'firebase';
import APIHandler from '../Utils/APIHandler'
import { NavigationEvents } from 'react-navigation'

// Definición del componente para el Login
export default class Login extends React.Component {
    // state del componente
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMessage: null,
            isLoading: false,
            isLogged: false,
        };
        this.APIHandler = new APIHandler()
    }

    // Método asíncrono para logear utilizando firebase
    async login() {
        try {
            // Se verifica si el usuario está logeado en la aplicación
            await this.setState({
                isLogged: true
            })
            await firebase.auth().signOut()
            await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
        } catch (error) {
            this.setState({
                errorMessage: 'Correo o contraseña incorrectas. Inténtelo nuevamente.',
                isLogged: false
            })
        }
    }

    /* 
        goToMainView(): Método que redirige la navegación hacia la vista principal de la aplicación
        Entradas: Ninguna
        Salida: Ninguna
     */
    goToMainView = () => {
        if (this.state.email === '' || this.state.password === '') {
            this.setState({
                errorMessage: 'Es necesario completar los campos.'
            })
        } else {
            this.setState({
                isLoading: true
            });
            this.login()
                .then(this.setState({
                    isLoading: false
                }))

            // Se verifica si se autentificó correctamente el usuario
            if (this.state.isLogged) {
                this.backhandler.remove()
                firebase.auth().onAuthStateChanged(user => {
                    if (user) {
                        this.APIHandler.getToken(user.uid)
                            .then(response => {
                                SecureStore.setItemAsync('api_tesigoapp_token', response.token)
                                    .then(() => {
                                        this.props.navigation.navigate('GetCourses', {
                                            idProfessor: user.uid
                                        })
                                    })
                            })
                    }
                })
            }
        }
    };

    // Se define el nombre de la vista y se agrega a las opciones de navegación
    static navigationOptions = {
        title: 'Autentificación',
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
        headerLeft: null
    };

    componentDidFocus() {
        this.backhandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
        try {
            firebase.auth().signOut()
        } catch (error) { console.error(error) }

        // Se reinicia el state
        this.setState({
            errorMessage: null,
            isLoading: false,
            isLogged: false
        })
    }

    async handleBackButton() {
        Alert.alert(
            'Cerrar la aplicación',
            '¿Desea cerrar la aplicación?', [{
                text: 'Cancelar',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: 'OK',
                onPress: () => BackHandler.exitApp()
            },], {
                cancelable: false
            }
        )
        return true;
    }

    componentWillUnmount() {
        this.backhandler.remove()
    }

    render() {
        // Se define una variable que contiene un texto que muestra si hay un error al autentificarse
        let errorText = this.state.errorMessage ?
            <Text style={style.errorText}>
                {this.state.errorMessage}
            </Text> : null;
        // Se define una variable que muestra un botón o un activity indicator
        let loginButton = !this.state.isLoading ?
            <TouchableOpacity style={style.button}
                onPress={this.goToMainView}>
                <Text style={style.textButton}>
                    Ingresar
                </Text>
            </TouchableOpacity> :
            <ActivityIndicator size='large' />;

        return (
            <View style={style.container}>
                <NavigationEvents
                    onDidFocus={payload => this.componentDidFocus()} />
                <Text style={style.textTitle}>
                    Identificación de usuario
                </Text>
                {errorText}
                <TextInput style={style.textInput}
                    placeholder='Correo Electrónico'
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                />
                <TextInput secureTextEntry
                    style={style.textInput}
                    placeholder='Contraseña'
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                />
                {loginButton}
            </View>
        );
    }
}

// Definición de los estilos de la vista
const style = StyleSheet.create({
    textTitle: {
        marginTop: '7%',
        marginBottom: '10%',
        fontSize: 20,
        textAlign: 'center',
        color: '#000000'
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: '#429b00',
        borderWidth: 1,
        marginTop: 8,
        marginBottom: 8,
    },
    button: {
        textAlign: 'center',
        marginTop: 8,
        backgroundColor: '#429b00',
        alignItems: 'center',
        width: '90%',
        height: 40
    },
    textButton: {
        color: '#FFFFFF',
        fontSize: 18,
        marginTop: 2
    },
    errorText: {
        color: '#9B1200',
        fontSize: 20,
        justifyContent: 'center',
        textAlign: 'center',
    }
});