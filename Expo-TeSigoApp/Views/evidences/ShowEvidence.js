import React from "react"
import { StyleSheet, Text, View, Dimensions, ActivityIndicator, Image, Slider, ScrollView } from "react-native"
import { Audio, Video } from 'expo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default class ShowEvidence extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            evidenceUri: null,
            evidenceDate: null,
            evidenceName: null,
            evidenceContext: null,
            evidenceType: null,
            isLoading: true,
            isPaused: true,
            durationMillis: 0,
            positionMillis: 0,
            playedTime: 0
        }
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
                    useNativeControls={true}
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

    renderPlayButton() {
        return (
            <View style={{ alignItems: "center" }}>
                <MaterialCommunityIcons name="play" style={styles.sendIcon}
                    onPress={() => { this.playAudio() }} />
                <Text>Reproducir</Text>
            </View>
        )
    }

    renderPauseButton() {
        return (
            <View style={{ alignItems: "center" }}>
                <MaterialCommunityIcons name="pause" style={styles.sendIcon}
                    onPress={() => { this.pauseAudio() }} />
                <Text>Pausar</Text>
            </View>
        )
    }

    // Método que renderiza el reproductor de audio
    renderAudioPlayer() {
        let controlButton = this.state.isPaused ? this.renderPlayButton() : this.renderPauseButton()
        return (
            <View style={styles.evidence}>
                <View style={styles.audioControl}>
                    {controlButton}
                </View>
            </View>
        )
    }

    // Método que se encarga de reproducir un audio
    async playAudio() {
        try {
            this.timer = setInterval(() => {
                // Se verifica si se terminó la reproducción
                if (this.state.playedTime * 1000 >= this.state.durationMillis && this.state.playedTime > 0) {
                    this.setState({
                        playedTime: 0,
                        durationMillis: 0,
                        isPaused: true
                    })
                    this.soundObject = new Audio.Sound()
                    clearInterval(this.timer)
                }
                // Se verifica que se haya cargado el audio, para ello basta con ver si la duración es mayor a 0
                else if (this.state.durationMillis > 0)
                    // Cada un segundo se aumenta el contador
                    this.setState({
                        playedTime: (this.state.playedTime + 1)
                    })
            }, 1000)
            if (this.state.durationMillis === 0) {
                await this.soundObject.loadAsync({ uri: this.state.evidenceUri });
                const status = await this.soundObject.getStatusAsync()
                this.setState({
                    durationMillis: status.durationMillis
                })
            }
            await this.soundObject.playAsync();
            this.setState({
                isPaused: false
            })
        } catch (error) {
            console.error(error)
        }
    }

    // Método que se encarga de pausar el audio
    async pauseAudio() {
        clearInterval(this.timer)
        await this.setState({
            isPaused: true
        })
        await this.soundObject.pauseAsync()
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
        this.soundObject = new Audio.Sound()
    }

    componentDidMount() {
        this.setState({
            isLoading: false
        })
    }

    render() {
        if (this.state.isLoading) {
            let loadingText = ""
            switch (this.state.evidenceType) {
                case "photo":
                    loadingText = "Cargando la evidencia fotográfica"
                    break
                case "video":
                    loadingText = "Cargando la evidencia audiovisual"
                    break
                case "audio":
                    loadingText = "Cargando la evidencia de audio"
                    break
            }
            return (
                <View style={styles.activityIndicator}>
                    <Text style={styles.loadingText}>
                        {loadingText}
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
                    <Text style={styles.subTitles}> {this.state.evidenceName} </Text>
                </View>
                <Text style={styles.titles}> Contexto de la evidencia: </Text>
                <View style={styles.subTitleContainer}>
                    <Text style={styles.subTitles}> {this.state.evidenceContext} </Text>
                </View>
                <Text style={styles.titles}> Fecha de la evidencia: </Text>
                <View style={styles.subTitleContainer}>
                    <Text style={styles.subTitles}> {this.state.evidenceDate} </Text>
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
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    sendIcon: {
        fontSize: height * 0.1,
        color: 'black',
        marginTop: height * 0.05
    },
    sliderContainer: {
        alignItems: 'center',
        height: height * 0.1,
        backgroundColor: 'white'
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