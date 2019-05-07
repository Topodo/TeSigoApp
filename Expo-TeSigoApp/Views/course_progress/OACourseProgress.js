import React, { Component } from 'react'
import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    Button,
    BackHandler,
    ActivityIndicator,
    FlatList
} from 'react-native';
import APIHandler from '../../Utils/APIHandler'
import PureChart from 'react-native-pure-chart'
import NetworkError from '../error_components/NetworkError'
import { NavigationEvents } from 'react-navigation'

export default class OACourseProgress extends Component {
    constructor(props) {
        super(props)
        this.state = {
            idCourse: 3,
            course: '',
            idOA: 6,
            IEs: [],
            isLoading: true,
            errorOccurs: false
        }
        this.APIHandler = new APIHandler()
    }

    // Método que accede a la data de la API
    fetchData() {
        this.setState({
            isLoading: true,
            errorOccurs: false
        })
        // Se obtiene la data de los IEs del OA
        this.APIHandler.getFromAPI('http://206.189.195.214:8080/api/objetivoAprendizaje/' + this.state.idOA
            + '/curso/' + this.state.idCourse + '/avance')
            .then(response => {
                this.setState({
                    IEs: response,
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

    goBack = () => {
        this.props.navigation.goBack()
        return true
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.goBack)
        const { params } = this.props.navigation.state
        this.setState({
            idCourse: params.idCourse,
            course: params.course,
            idOA: params.idOA
        })
    }

    componentDidFocus() {
        BackHandler.addEventListener('hardwareBackPress', this.goBack)
        this.fetchData()
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.goBack)
    }

    // Método que redirige la navegación hacia el listado de alumnos ordenados por IE Completo/Incompleto
    goIEStudentProgress(info) {
        this.props.navigation.navigate('IEStudentsProgress', {
            idIE: info.idIE,
            idCourse: this.state.idCourse,
            course: this.state.course
        })
    }

    // Métodos utilizados en el Flatlist
    _keyExtractor = (item, index) => index.toString()

    // Método que renderiza la información de un IE
    renderIE = ({ item: IE, index }) => {
        return (
            <View key={index} style={[styles.flowRight, styles.IEContainer]}>
                <ScrollView nestedScrollEnabled={true}
                    style={styles.IETitleContainer}>
                    <Text>
                        {'IE' + (index + 1).toString() + ': ' + IE.IEName}
                    </Text>
                </ScrollView>
                <View style={styles.button}>
                    <Button onPress={() => {
                        this.goIEStudentProgress(IE)
                    }}
                        color='#429b00'
                        title="Lista de alumnos" />
                </View>
            </View>
        )
    }

    // Método que renderiza el gráfico
    renderGraph(IEs) {
        let count = 1
        let data = []
        let incomplete = []
        let complete = []
        IEs.forEach(IE => {
            incomplete.push({
                x: 'IE' + count.toString(),
                y: IE.incompleteCount
            })
            complete.push({
                x: 'IE' + count.toString(),
                y: IE.completeCount
            })
            count++
        })
        data = [
            {
                seriesName: 'serie1',
                data: complete,
                color: 'green'
            },
            {
                seriesName: 'serie2',
                data: incomplete,
                color: 'red'
            }
        ]

        return (
            <View style={styles.graphContainer}>
                <View style={styles.legendContainer}>
                    <Text style={{ fontSize: 10 }}> Completos </Text>
                    <View style={[styles.legendTag, { backgroundColor: 'green' }]} />
                    <Text style={{ fontSize: 10 }}> Incompletos </Text>
                    <View style={[styles.legendTag, { backgroundColor: 'red' }]} />
                </View>
                <View style={styles.yLabel}>
                    <Text style={[styles.labelText]}> Cantidad de </Text>
                    <Text style={styles.labelText}> alumnos </Text>
                </View>
                <View style={{ width: '80%' }}>
                    <PureChart data={data} type='bar' />
                </View>
                <View style={{ alignItems: 'center', marginBottom: 10}}>
                    <Text style={styles.labelText}> Indicadores de Evaluación </Text>
                </View>
            </View>
        )
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

        // Si ocurrió un error al hacer fetch
        if (this.state.errorOccurs) {
            return (
                <NetworkError parentFetchData={this.fetchData.bind(this)} />
            )
        }

        return (
            <FlatList
                nestedScrollEnabled={true}
                style={styles.backColor}
                data={this.state.IEs}
                keyExtractor={this._keyExtractor}
                ListHeaderComponent={() => <Text style={styles.titleText}> {this.state.course} </Text>}
                renderItem={this.renderIE}
                ListFooterComponent={() => this.renderGraph(this.state.IEs)} />
        )
    }
}

// Definición de estilos
const styles = StyleSheet.create({
    legendTag: {
        width: '10%',
        height: '10%',
    },
    legendContainer: {
        borderWidth: 1.5,
        borderRadius: 8,
        borderColor: '#429b00',
        width: '35%',
        height: 50,
        marginLeft: '50%',
        marginTop: 10,
        alignItems: 'center',
    },
    yLabel: {
        alignItems: 'center',
        width: '35%',
        marginRight: '65%'
    },
    xLabel: {
        marginBottom: '7%',
        alignItems: 'center',
        width: '35%',
        marginRight: '65%'
    },
    labelText: {
        color: 'black',
        fontSize: 12
    },
    button: {
        marginRight: '5%',
        textAlign: 'center',
        marginTop: '5%',
        marginBottom: '3%',
        width: '30%'
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
    graphContainer: {
        borderWidth: 1.5,
        borderRadius: 8,
        borderColor: '#429b00',
        width: '94%',
        marginLeft: '3%',
        marginBottom: 10,
        alignItems: 'center',
    },
    progressBar: {
        width: '60%',
        marginLeft: '5%',
    },
    picker: {
        marginLeft: '20%',
        marginRight: '20%',
        marginBottom: '7%',
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#429b00'
    },
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    progressBar: {
        width: '80%'
    },
    backColor: {
        backgroundColor: '#FFFFFF',
    },
    titleText: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: '7%',
        marginBottom: '7%',
    },
    IEContainer: {
        marginLeft: '3%',
        marginRight: '3%',
        borderWidth: 1.5,
        borderRadius: 8,
        borderColor: '#429b00',
        marginBottom: 10,
        height: 150
    },
    IETitle: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: '7%',
        marginBottom: '3%',
    },
    IETitleContainer: {
        marginTop: '3%',
        marginLeft: '3%',
        marginBottom: '4%',
        marginRight: '4%',
        width: '60%',
        height: 130
    }
})