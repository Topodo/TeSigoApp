import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    Button,
    StyleSheet,
    ActivityIndicator,
    BackHandler,
    Alert
} from 'react-native';
import APIHandler from '../../Utils/APIHandler';
import { CheckBox } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation'

export default class EvaluationIndicator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            course: '',
            evalIndicators: [],
            OAName: '',
            checkedItems: [],
            isLoading: true,
            idStudent: '',
            student: {},
            idSubject: -1,
            alreadyMounted: false
        };
        this.APIHandler = new APIHandler();
    }

    static navigationOptions = {
        title: 'Indicadores de evaluación',
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
    };

    // Método que redirige la navegación a la vista de asignación de objetivos de aprendizaje
    setOAs() {
        this.setState({
            isLoading: true
        })
        this.props.navigation.navigate('SetObjectivesPerStudent')
    }

    goBack = () => {
        this.props.navigation.goBack()
        return true
    }

    // Para modificar el state al cambiar de un componente a otro
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.goBack)
        const { params } = this.props.navigation.state;
        this.setState({
            evalIndicators: params.indicators,
            name: params.studentName,
            course: params.course,
            OAName: params.OAName,
            idStudent: params.idStudent,
            student: params.student,
            idSubject: params.idSubject
        })
    }

    componentDidFocus() {
        if (this.state.alreadyMounted) {
            BackHandler.addEventListener('hardwareBackPress', this.goBack)
            const { params } = this.props.navigation.state;
            this.setState({
                evalIndicators: params.indicators,
                name: params.studentName,
                course: params.course,
                OAName: params.OAName,
                idStudent: params.idStudent,
                student: params.student,
                idSubject: params.idSubject,
                isLoading: false
            })
        }
    }

    async componentDidMount() {
        await this.setState({
            alreadyMounted: true
        })
        let checkedItems = []
        this.state.evalIndicators.forEach(IE => {
            let checkedItem = IE.isComplete ? {
                idIndicador: IE.id,
                status: true
            } : {
                    idIndicador: IE.id,
                    status: false
                }
            checkedItems.push(checkedItem)
        });
        this.setState({
            checkedItems: checkedItems,
            isLoading: false
        })
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.goBack)
        this.setState({
            alreadyMounted: false
        })
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.activityIndicator}>
                    <NavigationEvents
                        onDidFocus={payload => this.componentDidFocus()} />
                    <Text style={styles.loadingText}>
                        Cargando los indicadores de evaluación
                    </Text>
                    <ActivityIndicator size='large' />
                </View>
            );
        }

        // Se mapean los indicadores de evaluación para renderizar
        let evalInd = this.state.evalIndicators.map((indicator, index) => {
            return (
                <View key={index} style={styles.IEContainer}>
                    <View style={styles.flowRight}>
                        <View style={styles.IESubContainer}>
                            <Text style={styles.IEText}>
                                {(index + 1).toString() + '.- ' + indicator.description}
                            </Text>
                        </View>
                        <CheckBox key={index}
                            checked={this.state.checkedItems[index].status}
                            containerStyle={styles.CheckBoxStyle}
                            onPress={() => {
                                let tmp = this.state.checkedItems;
                                tmp[index].status = !this.state.checkedItems[index].status;
                                this.setState({
                                    checkedItems: tmp
                                })
                            }} />
                    </View>
                </View>
            );
        });

        return (
            <ScrollView style={styles.backColor}>
                <Text style={styles.titleText}>
                    {this.state.name + ' - ' + this.state.course}
                </Text>
                <View style={styles.OATitleContainer}>
                    <Text style={styles.OATitle}>
                        {this.state.OAName}
                    </Text>
                </View>
                {evalInd}
                <View style={styles.button}>
                    <Button
                        title={'Actualizar Indicadores'}
                        color='#429b00'
                        onPress={() => {
                            this.APIHandler.putToAPI('http://206.189.195.214:8080/api/acompletado/update/' + this.state.idStudent + '/indicadores', this.state.checkedItems)
                                .then(response => {
                                    // Una vez se haya realizado los cambios, se lanza una alerta indicando si hubo éxito o no
                                    let title = 'Actualización de objetivos'
                                    let subTitle = 'Cambios realizados exitosamente'
                                    if (response.status) {
                                        subTitle = 'Ocurrió un error interno, inténtelo nuevamente'
                                    }
                                    // Se lanza una alerta indicando el estado de la actualización
                                    Alert.alert(
                                        title,
                                        subTitle,
                                        [{ text: 'OK' }]
                                    )
                                })
                                .then(() => {
                                    this.setOAs()
                                })
                        }} />
                </View>
            </ScrollView>
        );
    }
}

// Definición de estilos
const styles = StyleSheet.create({
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
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
        backgroundColor: '#FFFFFF'
    },
    titleText: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: '7%',
        marginBottom: '3%',
    },
    IEContainer: {
        marginLeft: '1%',
        marginRight: '1%',
        borderWidth: 1.5,
        borderRadius: 8,
        borderColor: '#429b00',
        marginBottom: 10
    },
    IESubContainer: {
        width: '85%',
        marginBottom: '3%',
    },
    IEText: {
        marginTop: '3%',
        marginLeft: '5%',
        marginRight: '3%',
    },
    OATitle: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: '7%',
        marginBottom: '3%',
    },
    OATitleContainer: {
        marginLeft: '3%',
        marginRight: '3%',
        marginBottom: '4%'
    },
    CheckBoxStyle: {
        backgroundColor: 'white',
        borderColor: 'white',
        width: '12%',
        marginRight: '20%'
    },
    button: {
        marginLeft: '10%',
        marginRight: '10%',
        textAlign: 'center',
        marginTop: '2%',
        marginBottom: '3%',
        height: 40
    },
})