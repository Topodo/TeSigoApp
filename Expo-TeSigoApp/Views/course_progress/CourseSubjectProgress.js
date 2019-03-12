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
import APIHandler from '../../Utils/APIHandler'

export default class CourseSubjectProgress extends Component {
    constructor(props) {
        super(props)
        this.state = {
            course: '',
            idCourse: 3,
            subjectsNames: [],
            defaultSubject: '',
            idSubject: 2,
            progress: [],
            isLoading: true,
            idsSubjects: []
        }
        this.APIHandler = new APIHandler()
    }

    // Método que obtiene los nombres de las unidades
    getSubjectsNames(subjects) {
        let names = [];
        subjects.forEach(subject => {
            names.push({
                name: subject.nombreUnidad,
                id: subject.idUnidad
            })
        })
        return names
    }

    // Método que obtiene la data de la unidad seleccionada 
    getSubjectData(selectedSubject) {
        const { progress } = this.state
        for (i = 0; i < progress.length; i++) {
            if (progress[i].idSubject === selectedSubject) {
                return progress[i].progress
            }
        }
    }

    // Método que redirige la navegación hacia la vista de visualización de avance de OA
    goOAView(idOA) {
        this.props.navigation.navigate('OACourseProgress', {
            idCourse: this.state.idCourse,
            course: this.state.course,
            idOA: idOA
        })
    }

    componentWillMount() {
        const { params } = this.props.navigation.state
        this.setState({
            idCourse: params.idCourse,
            course: params.course,
        })
    }

    componentDidMount() {
        // Se obtienen las unidades
        this.APIHandler.getFromAPI('http://206.189.195.214:8080/api/curso/' + this.state.idCourse + '/unidades')
            .then(response => {
                const names = this.getSubjectsNames(response)
                let aux = []
                response.forEach(subject => {
                    aux.push(subject.idUnidad)
                })
                this.setState({
                    subjectsNames: names,
                    defaultSubject: names[0].id,
                    idSubject: response[0].idUnidad,
                    idsSubjects: aux
                })
            })
            .then(() => {
                // Se obtiene el avance del curso en todas las unidades 
                let progressAux = []
                let count = 0
                this.state.idsSubjects.forEach(id => {
                    this.APIHandler.getFromAPI('http://206.189.195.214:8080/api/unidad/' +
                        id.toString() + '/curso/' + this.state.idCourse + '/avance')
                        .then(response => {
                            progressAux.push({
                                idSubject: id,
                                progress: response
                            })
                            count++
                            if (count === this.state.idsSubjects.length) {
                                this.setState({
                                    progress: progressAux,
                                    isLoading: false
                                })
                            }
                        })
                })
            })
            .catch(error => console.error(error))
    }

    static navigationOptions = {
        title: 'Objetivos de aprendizaje (Curso)',
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
                        Cargando los objetivos de aprendizaje
                    </Text>
                    <ActivityIndicator size='large' />
                </View>
            );
        }

        // Se renderiza el picker con las unidades
        let picker = this.state.subjectsNames.map((subjectName, index) => {
            return <Picker.Item key={index} value={subjectName.id} label={subjectName.name} />
        })
        // Se renderiza los avances en cada uno de los objetivos de aprendizaje
        let progress = this.getSubjectData(this.state.defaultSubject).map((OA, index) => {
            return (
                <View key={index} style={styles.OAContainer}>
                    <View style={[styles.flowRight]}>
                        <View style={styles.OATitleContainer}>
                            <Text>
                                {(index + 1).toString() + '.- ' + OA.OAName}
                            </Text>
                        </View>
                        <View>
                            <Text>
                                {(Math.round(OA.percentage * 100)).toString() + '%'}
                            </Text>
                        </View>
                    </View>
                    <View>
                        <Button onPress={() => {
                            this.goOAView(OA.idOA)
                        }}
                            color='#429b00'
                            title="Ver indicadores de evaluación">
                        </Button>
                    </View>
                </View>
            )
        })

        return (
            <ScrollView style={styles.backColor}>
                <Text style={styles.titleText}>
                    {this.state.course}
                </Text>
                <View style={styles.picker}>
                    <Picker selectedValue={this.state.defaultSubject}
                        onValueChange={(subject) => {
                            this.setState({
                                defaultSubject: subject,
                            })
                        }}>
                        {picker}
                    </Picker>
                </View>
                {progress}
            </ScrollView>
        )
    }
}

// Definición de estilos
const styles = StyleSheet.create({
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
        marginBottom: '3%',
    },
    OAContainer: {
        marginLeft: '3%',
        marginRight: '3%',
        borderWidth: 1.5,
        borderRadius: 8,
        borderColor: '#429b00',
        marginBottom: 10
    },
    OATitle: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: '7%',
        marginBottom: '3%',
    },
    OATitleContainer: {
        marginTop: '3%',
        marginLeft: '3%',
        marginBottom: '4%',
        marginRight: '4%',
        width: '80%'
    }
})