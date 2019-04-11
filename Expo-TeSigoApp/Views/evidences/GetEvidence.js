import React from 'react';
import {
    ScrollView,
    View,
    Text,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    BackHandler,
    Image,
    Button,
    ActivityIndicator
} from 'react-native';
import APIHandler from '../../Utils/APIHandler'
import NetworkError from '../error_components/NetworkError'
import { NavigationEvents } from 'react-navigation'

export default class GetEvidence extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            course: '',
            evidence: [],
            expandableItems: [false, false, false], // [0]: Fotografías, [1]: Videos, [2]: Audios
            isLoading: true,
            idStudent: '',
            errorOccurs: false
        }
        this.APIHandler = new APIHandler()
    }

    // Método que retorna la fecha en formato DD/MM/AA
    formatDate(date) {
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

    // Método que redirige a la vista previa de la evidencia
    showEvidence(evidence) {
        this.props.navigation.navigate('ShowEvidence', {
            evidence: evidence,
        })
    }
    // Método que renderiza la información de las evidencias
    renderInfo(info, id) {
        return (
            <View key={id} style={styles.infoButton}>
                <View style={[styles.EvidenceContainer, styles.flowRight]}>
                    <View style={styles.PreviewText}>
                        <Text>
                            {info.nombreEvidencia}
                        </Text>
                        <Text>
                            {this.formatDate(info.fechaEvidencia)}
                        </Text>
                    </View>
                    <View style={styles.Button}>
                        <Button title="Ver evidencia"
                            color='#429b00'
                            onPress={this.showEvidence.bind(this, info)}>
                        </Button>
                    </View>
                </View>
            </View>
        );
    }

    orderByDate(evidences) {
        return evidences.sort((prevEvidence, nextEvidence) => {
            let prevDate = new Date(prevEvidence.fechaEvidencia)
            let nextDate = new Date(nextEvidence.fechaEvidencia)
            return nextDate - prevDate
        })
    }

    // Método que accede a la data de la API
    fetchData() {
        this.setState({
            isLoading: true,
            errorOccurs: false
        })
        this.APIHandler.getFromAPI('http://206.189.195.214:8080/api/formularioEvidencia/alumno/' + this.state.idStudent)
            .then(response => {
                const evidence = {
                    pictures: this.orderByDate(response[1].evidencias),
                    videos: this.orderByDate(response[0].evidencias),
                    audios: this.orderByDate(response[2].evidencias)
                }
                this.setState({
                    evidence: evidence,
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
        this.props.navigation.navigate('StudentProfile')
        return true
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.goBack)
        const { params } = this.props.navigation.state;
        this.setState({
            name: params.studentName,
            course: params.course,
            expandableItems: [false, false, false],
            idStudent: params.idStudent,
        });
    }

    componentDidFocus() {
        BackHandler.addEventListener('hardwareBackPress', this.goBack)
        this.fetchData()
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.goBack)
    }

    static navigationOptions = {
        title: 'Evidencia cualitativa',
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

    // Método que renderiza un indicador en caso de que no hayan evidencias
    renderEmptyList(type) {
        return (
            <View style={styles.activityIndicator}>
                <Text style={styles.loadingText}>
                    {'No hay ' + type + ' para mostrar'}
                </Text>
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
                        Cargando el listado de evidencias cualitativas
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

        // Fotografías
        let photos = this.state.expandableItems[0] === true ?
            (this.state.evidence.pictures.length === 0 ? this.renderEmptyList("fotografías") :
                this.state.evidence.pictures.map((info, id) => {
                    return (this.renderInfo(info, id))
                }))
            : null;
        let photosArrow = this.state.expandableItems[0] === true ?
            [{ rotate: '-180deg' }] : [{ rotate: '0deg' }];

        // Videos
        let videos = this.state.expandableItems[1] === true ?
            (this.state.evidence.videos.length === 0 ? this.renderEmptyList("videos") :
                this.state.evidence.videos.map((info, id) => {
                    return (this.renderInfo(info, id))
                }))
            : null;
        let videosArrow = this.state.expandableItems[1] === true ?
            [{ rotate: '-180deg' }] : [{ rotate: '0deg' }];

        // Audios
        let audios = this.state.expandableItems[2] === true ?
            (this.state.evidence.audios.length === 0 ? this.renderEmptyList("archivos de sonido") :
                this.state.evidence.audios.map((info, id) => {
                    return (this.renderInfo(info, id))
                }))
            : null;
        let audiosArrow = this.state.expandableItems[2] === true ?
            [{ rotate: '-180deg' }] : [{ rotate: '0deg' }];

        return (
            <ScrollView style={styles.backColor}>
                <Text style={styles.titleText}>
                    {this.state.name + ' - ' + this.state.course}
                </Text>
                <View>
                    <TouchableOpacity style={styles.ColapsableTouchable}
                        onPress={() => {
                            let tmp = this.state.expandableItems;
                            tmp[0] = !this.state.expandableItems[0];
                            this.setState({
                                expandableItems: tmp
                            });
                        }}>
                        <View style={[styles.flowRight]}>
                            <Text style={styles.SubItemText}>
                                Fotografías
                            </Text>
                            <Image source={require('../Images/expand-arrow.png')}
                                style={[styles.ArrowImage, { transform: photosArrow }, { marginLeft: '19%' }]} />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.sectionContainer}>
                        {photos}
                    </View>
                </View>
                <View>
                    <TouchableOpacity style={styles.ColapsableTouchable}
                        onPress={() => {
                            let tmp = this.state.expandableItems;
                            tmp[1] = !this.state.expandableItems[1];
                            this.setState({
                                expandableItems: tmp
                            });
                        }}>
                        <View style={[styles.flowRight]}>
                            <Text style={styles.SubItemText}>
                                Videos
                            </Text>
                            <Image source={require('../Images/expand-arrow.png')}
                                style={[styles.ArrowImage, { transform: videosArrow }, { marginLeft: '25%' }]} />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.sectionContainer}>
                        {videos}
                    </View>
                </View>
                <View>
                    <TouchableOpacity style={styles.ColapsableTouchable}
                        onPress={() => {
                            let tmp = this.state.expandableItems;
                            tmp[2] = !this.state.expandableItems[2];
                            this.setState({
                                expandableItems: tmp
                            });
                        }}>
                        <View style={[styles.flowRight]}>
                            <Text style={styles.SubItemText}>
                                Audios
                            </Text>
                            <Image source={require('../Images/expand-arrow.png')}
                                style={[styles.ArrowImage, { transform: audiosArrow }, { marginLeft: '25%' }]} />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.sectionContainer}>
                        {audios}
                    </View>
                </View>
            </ScrollView >
        );
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
    sectionContainer: {
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10
    },
    ColapsableTouchable: {
        marginLeft: 4,
        marginRight: 4,
        width: width,
        backgroundColor: 'white'
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
        marginLeft: 10,
        width: '60%'
    },
    ArrowImage: {
        width: '4%',
        height: height,
        marginTop: 8
    },
    SubItemText: {
        marginTop: 8,
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
});