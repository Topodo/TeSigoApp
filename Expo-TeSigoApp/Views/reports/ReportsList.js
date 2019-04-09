import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Image,
    BackHandler,
    ActivityIndicator
} from 'react-native';
import APIHandler from '../../Utils/APIHandler'
import NetworkError from '../error_components/NetworkError'
import { NavigationEvents } from 'react-navigation'

export default class ReportsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            idStudent: 1,
            studentName: '',
            course: '',
            showReport: [],
            reports: [],
            isLoading: true,
            errorOccurs: false
        }
        this.APIHandler = new APIHandler()
    }

    static navigationOptions = {
        title: 'Reportes',
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

    // Método que retorna la fecha en formato DD/MM/AA
    formatDate(date) {
        if (date === null)
            return '01/01/2012'
        let year = ''
        let month = ''
        let day = ''
        for (i = 0; i < 4; i++) {
            year = year + date[i]
        }
        for (j = 5; j < 7; j++) {
            month = month + date[j]
        }
        for (k = 8; k < 10; k++) {
            day = day + date[k]
        }
        return day + '/' + month + '/' + year
    }

    orderByDate(reports) {
        return reports.sort((prevReport, nextReport) => {
            let prevDate = new Date(prevReport.fecha)
            let nextDate = new Date(nextReport.fecha)
            return nextDate - prevDate
        })
    }

    // Método que accede a la data de la API
    fetchData() {
        this.setState({
            isLoading: true,
            errorOccurs: false
        })
        this.APIHandler.getFromAPI('http://206.189.195.214:8080/api/alumno/' + this.state.idStudent + '/reportes')
            .then(response => {
                let aux = []
                for (let i = 0; i < response.length; i++) {
                    aux.push(false)
                }
                this.setState({
                    reports: this.orderByDate(response),
                    showReport: aux,
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
        BackHandler.addEventListener('hardwareBackPress', this.goBack)
        const { params } = this.props.navigation.state
        this.setState({
            idStudent: params.idStudent,
            studentName: params.studentName,
            course: params.course
        })
    }

    goBack = () => {
        this.props.navigation.goBack()
        return true
    }

    componentDidFocus() {
        BackHandler.addEventListener('hardwareBackPress', this.goBack)
        this.fetchData()
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.goBack)
    }

    // Método que renderiza un indicador en caso de que no hayan reportes
    renderEmptyList() {
        return (
            <View style={styles.activityIndicator}>
                <Text style={styles.loadingText}>
                    No hay reportes para mostrar
                </Text>
            </View>
        )
    }

    // Método que renderiza un reporte
    renderReport(report, index) {
        let arrowRotation = this.state.showReport[index] ?
            [{ rotate: '-180deg' }] : [{ rotate: '0deg' }]
        let reportComponent = this.state.showReport[index] ?
            <View>
                <Text>
                    {this.state.reports[index]['descripcionReporte']}
                </Text>
            </View> : null
        return (
            <View key={index}>
                <TouchableOpacity style={styles.ColapsableTouchable}
                    onPress={() => {
                        let tmp = this.state.showReport
                        tmp[index] = !this.state.showReport[index]
                        this.setState({
                            showReport: tmp
                        });
                    }}>
                    <View style={[styles.flowRight]}>
                        <View style={styles.SubItemText}>
                            <Text>
                                {report['asunto']}
                            </Text>
                            <Text>
                                {this.formatDate(report['fecha'])}
                            </Text>
                        </View>
                        <Image source={require('../Images/expand-arrow.png')}
                            style={[styles.ArrowImage, { transform: arrowRotation }, { marginRight: '20%' }]} />
                    </View>
                </TouchableOpacity>
                <View style={styles.EvidenceContainer}>
                    {reportComponent}
                </View>
            </View>
        )
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.activityIndicator}>
                    <NavigationEvents
                        onDidFocus={payload => this.componentDidFocus()} />
                    <Text style={styles.loadingText}>
                        Cargando los reportes
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

        let reports = this.state.reports.length === 0 ? this.renderEmptyList() :
            this.state.reports.map((report, index) => {
                return (this.renderReport(report, index))
            })
        return (
            <ScrollView style={styles.backColor}>
                <Text style={styles.titleText}>
                    {this.state.studentName + ' - ' + this.state.course}
                </Text>
                {reports}
            </ScrollView>
        )
    }
}

const width = Dimensions.get('window').height * 0.8;
const height = Dimensions.get('window').height * 0.04;
const styles = StyleSheet.create({
    infoButton: {
        marginTop: 5
    },
    touchable: {
        marginBottom: 20,
    },
    backColor: {
        backgroundColor: '#FFFFFF'
    },
    titleText: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: '7%',
        marginBottom: '7%'
    },
    EvidenceContainer: {
        marginLeft: '10%',
        marginRight: '10%',
        borderWidth: 1.5,
        borderColor: '#429b00',
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10
    },
    ColapsableTouchable: {
        marginLeft: 4,
        marginRight: 4,
        width: width,
    },
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 10
    },
    Button: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: '5%',
        marginRight: 10
    },
    PreviewText: {
        alignItems: 'center',
        marginLeft: 10
    },
    ArrowImage: {
        width: '4%',
        height: height,
        marginTop: 8
    },
    SubItemText: {
        marginTop: 8,
        marginRight: '10%',
        width: '40%'
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
})