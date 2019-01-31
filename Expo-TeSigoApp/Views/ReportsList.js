import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Image, 
    ActivityIndicator  
} from 'react-native';
import APIHandler from '../Utils/APIHandler'

export default class ReportsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            idLoading: true,
            idStudent: 1,
            studentName: '',
            course: '',
            showReport: [],
            reports: []
        }
        this.APIHandler = new APIHandler()
    }

    static navigationOptions = {
        title: 'Reportes'
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.APIHandler.getFromAPI('http://206.189.195.214:8080/api/alumno/' + this.state.idStudent + '/reportes')
            .then(response => {
                let aux = []
                for (let i = 0; i < response.length; i++) {
                    aux.push(false)
                }
                this.setState({
                    reports: response,
                    showReport: aux,
                    isLoading: false
                })
            })
            .catch(error => console.error(error))
    }

    // Método que renderiza un reporte
    renderReport(report, index) {
        let arrowRotation = this.state.showReport[index] ? 
            [{rotate: '-180deg'}] : [{rotate: '0deg'}]
        let reportComponent = this.state.showReport[index] ? 
            <View>
                <Text>
                    { this.state.reports[index]['descripcionReporte'] }
                </Text>
            </View> : null
        return(
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
                            <Text >
                                { (index + 1).toString() + '.- ' + report['asunto'] }
                            </Text>
                        </View>
                        <Image source={require('./Images/expand-arrow.png')} 
                            style={[styles.ArrowImage, {transform: arrowRotation}, {marginRight: '20%'}]}/>
                    </View>
                </TouchableOpacity>
                <View style={styles.EvidenceContainer}>
                    { reportComponent }
                </View>
            </View>
        )
    }

    render() {
        if(this.state.isLoading) {
            return(
                <View style={styles.activityIndicator}>
                    <Text style={styles.loadingText}>
                        Cargando el listado de evidencias cualitativas
                    </Text>
                    <ActivityIndicator size='large'/>
                </View>
            );
        } 
        let reports = this.state.reports.map((report, index) => {
            return(this.renderReport(report, index))
        })
        return(
            <ScrollView style={styles.backColor}>
                <Text style={styles.titleText}>
                    {this.state.studentName + ' - ' + this.state.course}
                </Text>
                { reports }
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
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10
    },
    ColapsableTouchable: {
        marginLeft: 4,
        marginRight: 4,
        width: width,
        backgroundColor: '#f7ffe6'
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