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
    Image
} from 'react-native';

export default class GetEvidence extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            course: '',
            evidence: [],
            expandableItems: [false, false, false], // [0]: Fotografías, [1]: Videos, [2]: Audios
            isLoading: true
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
                    <Text>
                        {info.name}
                    </Text>
                    <Text>
                        {info.date}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    componentWillMount() {
        let evidence = this.getEvidence();
        this.setState({
            name: 'Pedrito',
            course: 'Cuarto básico',
            evidence: evidence,
            expandableItems: [false, false, false]
        });
    }

    static navigationOptions = {
        title: 'Evidencia cualitativa'
    };
    
    render() {
        // Fotografías
        let photos = this.state.expandableItems[0] === true ?
            this.state.evidence.pictures.map((info, id) => {
                return (this.renderInfo(info, id))
            }) : null;
        // Videos
        let videos = this.state.expandableItems[1] === true ?
            this.state.evidence.videos.map((info, id) => {
                return (this.renderInfo(info, id))
            }) : null;
        // Audios
        let audios = this.state.expandableItems[2] === true ?
            this.state.evidence.audios.map((info, id) => {
                return (this.renderInfo(info, id))
            }) : null;

        return (
            <ScrollView>
                <Text>
                    {this.state.name + ' - ' + this.state.course}
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        let tmp = this.state.expandableItems;
                        tmp[0] = !this.state.expandableItems[0];
                        this.setState({
                            expandableItems: tmp
                        });
                    }}>
                    <Text>
                        Fotografías
                    </Text>
                </TouchableOpacity>
                {photos}
                <TouchableOpacity
                    onPress={() => {
                        let tmp = this.state.expandableItems;
                        tmp[1] = !this.state.expandableItems[1];
                        this.setState({
                            expandableItems: tmp
                        });
                    }}>
                    <Text>
                        Videos
                    </Text>
                </TouchableOpacity>
                {videos}
                <TouchableOpacity
                    onPress={() => {
                        let tmp = this.state.expandableItems;
                        tmp[2] = !this.state.expandableItems[2];
                        this.setState({
                            expandableItems: tmp
                        });
                    }}>
                    <Text>
                        Audios
                    </Text>
                </TouchableOpacity>
                {audios}
            </ScrollView >
        );
    }
}

const styles = StyleSheet.create({
    infoButton: {
        marginLeft: 30,
        marginTop: 10
    },
    touchable: {
        marginBottom: 20,
    }
});