import React from 'react';
import {
    ScrollView,
    View,
    Text,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Picker,
    ProgressBarAndroid,
    Image, 
    Button,
    ActivityIndicator  
} from 'react-native';
import ShowCamera from './camera_utils/Camera'

export default class GetEvidence extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            course: '',
            evidence: [],
            expandableItems: [false, false, false], // [0]: Fotografías, [1]: Videos, [2]: Audios
            isLoading: true,
            idStudent: ''
        }
    }

    // Método que recupera la información de las evidencias del alumno
    getEvidence() {
        // GET
        // El nombre y el curso del alumno viene desde la vista anterior
        let evidence = {
            pictures: [
                {
                    id: 1,
                    name: 'Foto 1',
                    date: 'DD/MM/AA',
                    uri: 'https://k30.kn3.net/taringa/7/7/9/8/3/D/guitar_gero/2B1.jpg',
                    type: 'picture'
                },
                {
                    id: 2,
                    name: 'Foto 2',
                    date: 'DD/MM/AA',
                    uri: 'https://k30.kn3.net/taringa/7/7/9/8/3/D/guitar_gero/2B1.jpg',
                    type: 'picture'
                },
            ],
            videos: [
                {
                    id: 3,
                    name: 'Video 1',
                    date: 'DD/MM/AA',
                    uri: null,
                    type: 'video'
                },
                {
                    id: 4,
                    name: 'Video 2',
                    date: 'DD/MM/AA',
                    uri: null,
                    type: 'video'
                }
            ],
            audios: [
                {
                    id: 5,
                    name: 'Audio 1',
                    date: 'DD/MM/AA',
                    uri: null,
                    type: 'picture'
                },
                {
                    id: 6,
                    name: 'Audio 2',
                    date: 'DD/MM/AA',
                    uri: null,
                    type: 'picture'
                }
            ]
        }
        return evidence;
    }

    // Método que redirige a la vista previa de la evidencia
    showEvidence(evidence) {
        this.props.navigation.navigate('ShowEvidence', {
            evidence: evidence
        })
    }
    // Método que renderiza la información de las evidencias
    renderInfo(info, id) {
        return (
            <View key={id} style={styles.infoButton}>
                <TouchableOpacity
                    onPress={this.showEvidence.bind(this, info)}>
                    <View style={[styles.EvidenceContainer, styles.flowRight]}>
                        <View style={styles.PreviewText}>
                            <Text>
                                {info.name}
                            </Text>
                            <Text>
                                {info.date}
                            </Text>
                        </View>
                        <View style={styles.Button}>
                            <Button title="Ver evidencia"
                                    color='#429b00'>
                            </Button>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    componentWillMount() {
        const evidence = this.getEvidence()
        const { params } = this.props.navigation.state;
        this.setState({
            name: params.studentName,
            course: params.course,
            expandableItems: [false, false, false],
            idStudent: params.idStudent,
            evidence: evidence
        });
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                isLoading: false
            })
        }, 1000);
    }

    static navigationOptions = {
        title: 'Evidencia cualitativa'
    };
    
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
        // Fotografías
        let photos = this.state.expandableItems[0] === true ?
            this.state.evidence.pictures.map((info, id) => {
                return (this.renderInfo(info, id))
            }) : null;
        let photosArrow = this.state.expandableItems[0] === true ?
            [{rotate: '-180deg'}] : [{rotate: '0deg'}];
        // Videos
        let videos = this.state.expandableItems[1] === true ?
            this.state.evidence.videos.map((info, id) => {
                return (this.renderInfo(info, id))
            }) : null;
        let videosArrow = this.state.expandableItems[1] === true ?
            [{rotate: '-180deg'}] : [{rotate: '0deg'}];
        // Audios
        let audios = this.state.expandableItems[2] === true ?
            this.state.evidence.audios.map((info, id) => {
                return (this.renderInfo(info, id))
            }) : null;
        let audiosArrow = this.state.expandableItems[2] === true ?
            [{rotate: '-180deg'}] : [{rotate: '0deg'}];

        return (
            <ScrollView style={styles.backColor}>
                <ShowCamera/>
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
                                style={[styles.ArrowImage, {transform: photosArrow}, {marginLeft: '19%'}]}/>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.EvidenceContainer}>
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
                                style={[styles.ArrowImage, {transform: videosArrow}, {marginLeft: '25%'}]}/>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.EvidenceContainer}>
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
                                style={[styles.ArrowImage, {transform: audiosArrow}, {marginLeft: '25%'}]}/>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.EvidenceContainer}>
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