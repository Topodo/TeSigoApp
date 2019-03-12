import React, { Component } from 'react'
import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    Button,
    ActivityIndicator
} from 'react-native';
import APIHandler from '../../Utils/APIHandler'
import PureChart from 'react-native-pure-chart'

export default class OACourseProgress extends Component {
    constructor(props) {
        super(props)
        this.state = {
            idCourse: 3,
            course: '',
            idOA: 6,
            IEs: [],
            isLoading: true
        }
        this.APIHandler = new APIHandler()
    }

    componentWillMount() {
        const { params } = this.props.navigation.state
        this.setState({
            idCourse: params.idCourse,
            course: params.course,
            idOA: params.idOA
        })
    }

    componentDidMount() {
        // Se obtiene la data de los IEs del OA
        this.APIHandler.getFromAPI('http://206.189.195.214:8080/api/objetivoAprendizaje/' + this.state.idOA
            + '/curso/' + this.state.idCourse + '/avance')
            .then(response => {
                this.setState({
                    IEs: response,
                    isLoading: false
                })
            })
            .catch(error => console.error(error))
    }

    // Método que redirige la navegación hacia el listado de alumnos ordenados por IE Completo/Incompleto
    goIEStudentProgress(info) {
        this.props.navigation.navigate('IEStudentsProgress', {
            idIE: info.idIE,
            idCourse: this.state.idCourse,
            course: this.state.course
        })
    }

    // Método que renderiza la información de un IE
    renderIE(IE, index) {
        return (
            <View key={index} style={[styles.flowRight, styles.IEContainer]}>
                <View style={styles.IETitleContainer}>
                    <Text>
                        {'IE' + (index + 1).toString() + ': ' + IE.IEName}
                    </Text>
                </View>
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
            <View style={[styles.graphContainer]}>
                <Text style={styles.titleText}>Gráfico</Text>
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
                <View style={{ width: '93%' }}>
                    <PureChart data={data} type='bar' />
                </View>
                <View style={{ alignItems: 'center', marginBottom: 12 }}>
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
                    <Text style={styles.loadingText}>
                        Cargando los indicadores de evaluación
                    </Text>
                    <ActivityIndicator size='large' />
                </View>
            );
        }
        let IEs = this.state.IEs.map((IE, index) => {
            return (this.renderIE(IE, index))
        })
        return (
            <ScrollView style={styles.backColor}>
                <Text style={styles.titleText}> {this.state.course} </Text>
                {IEs}
                {this.renderGraph(this.state.IEs)}
            </ScrollView>
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
        height: '12%',
        marginLeft: '50%',
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
        marginRight: '3%',
        marginLeft: '3%',
        alignItems: 'center',
        marginBottom: 12
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
        backgroundColor: '#FFFFFF'
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
        marginBottom: 10
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
        width: '60%'
    }
})