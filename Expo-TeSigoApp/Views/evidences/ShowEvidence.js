import React from "react"
import { StyleSheet, Text, View, Dimensions, ActivityIndicator, Image } from "react-native"
import { Audio, Video } from 'expo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { ScrollView } from "react-native-gesture-handler";

export default class ShowEvidence extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            evidenceUri: null,
            evidenceDate: null,
            evidenceName: null,
            evidenceContext: null,
            evidenceType: null,
            isLoading: true
        }
    }

    static navigationOptions = {
        title: 'Evidencia cualitativa'
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

    // Método que renderiza el reproductor de video
    renderVideoPlayer() {
        return (
            <View>
                <Video source={{ uri: this.state.evidenceUri }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="cover"
                    shouldPlay
                    style={styles.evidence} />
            </View>
        )
    }

    // Método que renderiza la imagen
    renderImage() {
        return (
            <View>
                <Image source={{ uri: this.state.evidenceUri }}
                    style={styles.evidence} />
            </View>
        )
    }

    // Método que renderiza el reproductor de audio
    renderAudioPlayer() {
        return (
            <View style={styles.evidence}>
                <MaterialCommunityIcons name="microphone" style={styles.mic} />
            </View>
        )
    }

    componentWillMount() {
        const { params } = this.props.navigation.state
        this.setState({
            evidenceUri: params.evidence.firebaseID,
            evidenceDate: this.formatDate(params.evidence.fechaEvidencia),
            evidenceName: params.evidence.nombreEvidencia,
            evidenceContext: params.evidence.contextoEvidencia,
            evidenceType: params.evidence.tipoEvidencia,
        })
    }

    async componentDidMount() {
        await this.setState({
            isLoading: false
        })

        // Se verifica si es un audio
        if (this.state.evidenceType === "audio") {
            this.soundObject = new Audio.Sound();
            try {
                await this.soundObject.loadAsync({ uri: this.state.evidenceUri });
                await this.soundObject.playAsync();
            } catch (error) {
                console.error(error)
            }
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.activityIndicator}>
                    <Text style={styles.loadingText}>
                        Cargando el listado de evidencias cualitativas
                    </Text>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
        switch (this.state.evidenceType) {
            case "photo":
                this.player = this.renderImage()
                break
            case "video":
                this.player = this.renderVideoPlayer()
                break
            case "audio":
                this.player = this.renderAudioPlayer()
                break
        }
        return (
            <ScrollView style={styles.backColor}>
                <Text style={styles.titles}> Nombre de la evidencia: </Text>
                <View style={styles.subTitleContainer}>
                    <Text style={styles.subTitles}> { this.state.evidenceName } </Text>
                </View>
                <Text style={styles.titles}> Contexto de la evidencia: </Text>
                <View style={styles.subTitleContainer}>
                    <Text style={styles.subTitles}> { this.state.evidenceContext } </Text>
                </View>
                <Text style={styles.titles}> Fecha de la evidencia: </Text>
                <View style={styles.subTitleContainer}>
                    <Text style={styles.subTitles}> { this.state.evidenceDate } </Text>
                </View>
                {this.player}
            </ScrollView>
        )
    }
}

const height = Dimensions.get('screen').height
const width = Dimensions.get('screen').width
const styles = StyleSheet.create({
    backColor: {
        backgroundColor: 'white',
    },
    evidence: {
        width: width * 0.9,
        height: height * 0.6,
        alignSelf: 'center',
        marginTop: '4%',
        marginBottom: 20
    },
    audioControl: {
        height: height * 0.1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    sliderContainer: {
        alignItems: 'center',
        height: height * 0.1,
        backgroundColor: 'black'
    },
    slider: {
        width: width * 0.8
    },
    mic: {
        fontSize: height * 0.3,
        color: 'black'
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
    titles: {
        fontSize: 24,
        marginTop: '4%',
        marginBottom: '4%',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        marginLeft: '2%'
    },
    subTitles: {
        fontSize: 16
    },
    subTitleContainer: {
        alignItems: 'center',
        width: width * 0.9,
        marginLeft: width * 0.05
    }
})