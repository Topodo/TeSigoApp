import React, { Component } from 'react'
import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    Button,
    Alert,
    Picker,
    ActivityIndicator
} from 'react-native';
import APIHandler from '../Utils/APIHandler'
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
        /* const { params } = this.props.navigation.state
        this.setState({
            idCourse: params.idCourse,
            course: params.course,
            idOA: params.idOA
        }) */
    }

    componentDidMount() {
        // Se obtiene la data de los IEs del OA
        this.APIHandler.getFromAPI('http://206.189.195.214:8080/api/objetivoAprendizaje/' + this.state.idOA
                                    + '/curso/' + this.state.idCourse + '/avance')
            .then(response => {
                console.log(response)
                this.setState({
                    IEs: response,
                    isLoading: false
                })
            })
            .catch(error => console.error(error))
    }

    // Método que renderiza la información de un IE
    renderIE(IE, index) {
        return(
            <View key={index} style={[styles.flowRight, styles.IEContainer]}>
                <View style={styles.IETitleContainer}>
                    <Text>
                        { 'IE' + (index + 1).toString() + ': ' + IE.IEName}
                    </Text>
                </View>
                <View style={styles.button}>
                    <Button onPress={() => {}}
                            color='#429b00'
                            title="Lista de alumnos"/>
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

        return(
            <View key={1} style={styles.graphContainer}>
                <PureChart data={data} type='bar'/>
            </View>
        )
    }

    static navigationOptions = {
        title: 'Detalles del objetivo de aprendizaje'
    }

    render() {
        if(this.state.isLoading) {
            return(
                <View style={styles.activityIndicator}>
                    <Text style={styles.loadingText}>
                        Cargando los Indicadores de evalución
                    </Text>
                    <ActivityIndicator size='large'/>
                </View>
            );
        } 
        let IEs = this.state.IEs.map((IE, index) => {
            return(this.renderIE(IE, index))
        })
        return(
            <ScrollView style={styles.backColor}>
                <Text style={styles.titleText}>
                    Indicadores de evaluación
                </Text>
                {IEs}
                {this.renderGraph(this.state.IEs)}
            </ScrollView>
        )
    }
}

// Definición de estilos
const styles = StyleSheet.create({
    button: {
        marginRight: '5%',
        textAlign: 'center',
        marginTop: '5%',
        marginBottom: '3%',
        width: '30%'
    },
    loadingText: {
        fontSize: 22,
        textAlign: 'center',
        marginBottom: '8%'
    },
    activityIndicator: {
        margin: 'auto',
        marginTop: '4%',
    },
    graphContainer: {
        width: '95%',
        marginRight: '5%'
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