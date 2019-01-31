import React from 'react';
import {
    View,
    TextInput,
    Text,
    ActivityIndicator,
    StyleSheet,
    Button
} from 'react-native';
import * as firebase from 'firebase';

// Definición del componente para el SignUp
export default class SignUp extends React.Component {

    // state del componente
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            repeatPassword: '',
            name: '',
            lastname: '',
            errorMessage: null,
            isCreated: false,
            isLoading: false
        }
    }

    // Método que registra a un usuario
    async signup () {
        const {email, password, name, lastname} = this.state;
        firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => this.setState({ isCreated: true }))
            .then(() => this.setState({ errorMessage: null }))
            .catch(error => this.setState({ errorMessage: error.toString(),
                isLoading: false}));
        // Se verifica el estado del registro y se procede a almacenar los otros datos del usuario
        if(this.state.isCreated){
            firebase.auth()
                .signInWithEmailAndPassword(email, password)
                .then(() => this.setState({ errorMessage: null }))
                .catch(error => this.setState({ errorMessage: error.toString() }));
            // Se obtiene el usuario y se agrega su nombre
            let user = firebase.auth().currentUser;
            user.updateProfile({
                displayName: name + ' ' + lastname
            }).then(() => this.setState({ isLoading: false }))
                .catch(error => this.setState({ errorMessage:  error.toString() }))
        }
    };

    static navigationOptions = {
        title: 'Registrarse',
    };

    render(){
        // Se define una variable que contiene un texto que muestra si hay un error al autentificarse
        let errorText = this.state.errorMessage ?
            <Text style={style.errorText}>
                Error al crear la cuenta, inténtelo nuevamente
            </Text> : null;
            
        // Se define una variable que muestra un botón o un activity indicator
        let signUpButon = !this.state.isLoading ?
            <Button onPress={this.signup} title="Registrarse" color='#429b00' raised/> :
            <ActivityIndicator size='large'/>;

        return (
            <View style={style.container}>
                <Text style={style.textTitle}>
                    Creación de cuenta
                </Text>
                {errorText}
                <TextInput style={style.textInput}
                           placeholder='Nombre'
                           onChangeText={name => this.setState({ name })}
                           value={this.state.name}
                />
                <TextInput style={style.textInput}
                           placeholder='Apellidos'
                           onChangeText={lastname => this.setState({ lastname })}
                           value={this.state.lastname}
                />
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
                <View style={style.button}>
                    {signUpButon}
                </View>
            </View>
        );
    }
}

// Definición de los estilos de la vista
const style = StyleSheet.create({
    textTitle: {
        marginBottom: '30%',
        fontSize: 20,
        textAlign: 'center',
        color: '#000000'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        marginTop: 8,
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