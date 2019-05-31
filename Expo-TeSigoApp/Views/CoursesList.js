import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    Button,
    StyleSheet,
    TouchableOpacity,
    Picker,
    ActivityIndicator,
    BackHandler,
    Alert
} from 'react-native';
import { NavigationEvents } from 'react-navigation'
import APIHandler from '../Utils/APIHandler'
import NetworkError from './error_components/NetworkError'

export default class GetCourses extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            idProfessorFirebase: null,
            courses: null,
            errorOccurs: false
        }
        this.apiHandler = new APIHandler();
    }

    // Método que accede a la data de la API
    fetchData() {
        this.setState({
            isLoading: true,
            errorOccurs: false
        })
        this.backhandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
        this.apiHandler.getFromAPI('http://206.189.195.214:8080/api/profesor/' + this.state.idProfessorFirebase + '/cursos').
            then(resultJSON => {
                this.setState({
                    courses: resultJSON,
                    isLoading: false
                })
            })
            .catch(error => {
                this.setState({
                    isLoading: false,
                    errorOccurs: true
                })
            })
    }

    componentWillMount() {
        const { params } = this.props.navigation.state;
        this.setState({
            idProfessorFirebase: params.idProfessor
        });
    }

    componentWillUnmount() {
        this.backhandler.remove()
    }

    componentDidMount() {
        this.fetchData()
    }

    componentDidFocus() {
        this.backhandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
    }

    goToStudentsList(infoCourse) {
        this.backhandler.remove()
        this.props.navigation.navigate("StudentList", {
            course: infoCourse.gradoCurso,
            idCourse: infoCourse.idCurso,
        });
    }

    // Método que renderiza la información de la lista de cursos
    renderInfo(info, id) {
        return (
            <View key={id} style={styles.CourseContainer}>
                <Button title={info.gradoCurso}
                    onPress={this.goToStudentsList.bind(this, info)}
                    color='#429b00'>
                </Button>
            </View>
        );
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

    static navigationOptions = {
        title: 'Mis cursos',
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

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.activityIndicator}>
                    <Text style={styles.loadingText}>
                        Cargando mis cursos
                    </Text>
                    <ActivityIndicator size='large' />
                </View>
            );
        }

        // Si ocurrió un error al hacer fetch
        if(this.state.errorOccurs) {
            return (
                <NetworkError parentFetchData={this.fetchData.bind(this)}/>
            )
        }

        let courses = this.state.courses ? this.state.courses.map((info, id) => {
            return (this.renderInfo(info, id));
        }) : null;

        return (
            <ScrollView style={styles.backColor}>
                <NavigationEvents
                    onDidFocus={payload => this.componentDidFocus()} />
                <Text style={styles.loadingText}>
                    Cursos
                </Text>
                {courses}
            </ScrollView>
        );
    }
}

// Definición de estilos
const styles = StyleSheet.create({
    activityIndicator: {
        margin: 'auto',
        marginTop: '4%'
    },
    loadingText: {
        fontSize: 22,
        textAlign: 'center',
        marginBottom: '8%',
        marginTop: '5%'
    },
    backColor: {
        backgroundColor: 'white'
    },
    CourseContainer: {
        marginLeft: '4%',
        marginRight: '4%',
        marginBottom: 10,
    },
    CourseText: {
        marginTop: '2%',
        marginBottom: '2%',
        fontSize: 16,
        color: 'white',
    }
})