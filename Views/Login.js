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
} from 'react-native';
import firebase from 'react-native-firebase';

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
            isLogged: false
        };
    }

    // Método asíncrono para registrar usuario
  /*  async signUp() {
        try {
            await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password);
            this.setState({
                errorMessage: 'Cuenta creada correctamente'
            });

        } catch (error) {
            this.setState({
                errorMessage: error.toString()
            });
        }
    }

    // Método asíncrono para logear utilizando firebase
    async login() {
        try{
            await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
            this.setState({
                isLogged: true
            })
            setTimeout(() => {
                console.log("ye")
            }, 1500);
        } catch (error) {
            this.setState({
                errorMessage: error.toString(),
                isLogged: false
            })
        }
    }

    /* goToMainView(): Método que redirige la navegación hacia la vista principal de la aplicación
       Entradas: Ninguna
       Salida: Ninguna
     */
    goToMainView = () => {
        this.setState({
            isLoading: true
        });
        //this.login();
        // Se verifica si se autentificó correctamente el usuario
        if(this.state.isLogged) {
            this.setState({
                isLoading: false
            })

        }
    };

    // Se define el nombre de la vista y se agrega a las opciones de navegación
    static navigationOptions = {
        title: 'Autentificación',
    };

    render(){
        // Se define una variable que contiene un texto que muestra si hay un error al autentificarse
        let errorText = this.state.errorMessage ?
            <Text style={style.errorText}>
                Usuario o contraseña errónea, inténtelo nuevamente
            </Text> : null;
        // Se define una variable que muestra un botón o un activity indicator
        let loginButton = !this.state.isLoading ?
            <TouchableOpacity style={style.button}
                              onPress={this.goToMainView}>
                <Text style={style.textButton}>
                    Ingresar
                </Text>
            </TouchableOpacity> :
            <ActivityIndicator size='large'/>;

        return (
            <View style={style.container}>
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
        marginBottom: '40%',
        fontSize: 20,
        textAlign: 'center',
        color: '#000000'
    },
    container: {
        flex: 1,
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
    },
    errorText: {
        color: '#9B1200',
        fontSize: 20,
        justifyContent: 'center',
        textAlign: 'center',
    }
});