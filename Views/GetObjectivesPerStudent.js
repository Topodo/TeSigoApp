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
    ActivityIndicator
} from 'react-native';

import APIHandler from '../Utils/APIHandler';

const heightDevice = Dimensions.get('window').width * 0.08;

export default class GetObjectivesPerStudent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            course: '',
            subjects: [],    
            defaultSubject: '',
            subjectsNames: null,
            idStudent: -1,
            isLoading: true,
            idCourse: -1,
            idSubject: -1
        }
        this.APIHandler = new APIHandler();
    }

    // Método que obtiene los objetivos de aprendizaje para la unidad seleccionada
    getLearningObjectives(subject) {
        const { subjects } = this.state;
        for (i = 0; i < subjects.length; i++) {
            if (subjects[i].name === subject) {
                return subjects[i];
            }
        }
    }

    // Método que redirige la navegación a la vista de los indicadores de evaluación
    goEvaluationIndicators = (indicators) => {
        this.props.navigation.navigate('GetEvalIndicator',
            {
                OAName: indicators.name,
                indicators: indicators.evalIndicators,
                studentName: this.state.name,
                course: this.state.course
            }
        );
    }

    // Método que obtiene los nombres de las unidades
    getSubjectsNames(subjects) {
        let names = []
        subjects.forEach(subject => {
            names.push(subject.nombreUnidad)
        })
        return names
    }

    // Método que obtiene el avance de un alumno en una unidad en específico
    getCurrentPerformance(idSubject) {
        // Se obtiene el avance del alumno en la unidad seleccionada
        this.APIHandler.getFromAPI('http://206.189.195.214:8080/api/unidad/' + idSubject + 
            '/alumno/' + this.state.idStudent)
            .then(response => {
                console.log(response)
                this.setState({
                    subjects: response,
                })
            }
        )
    }

    // Método que obtiene la ID de una unidad
    getSubjectID(subjectName) {
        this.state.subjects.forEach(subject => {
            if(subject.nombreUnidad === subjectName) {
                return subject.idUnidad
            }
        })
    }

    static navigationOptions = {
        title: 'Objetivos por alumno'
    };

    // Método que agrega al state los datos provenientes de la lista de alumnos 
    componentWillMount() {
        const { params } = this.props.navigation.state
        this.setState({
            idStudent: params.idStudent,
            idCourse: params.idCourse,
            name: params.studentName,
            course: params.course
        });
    }

    componentDidMount() {
        // Se obtienen las unidades
        this.APIHandler.getFromAPI('http://206.189.195.214:8080/api/curso/' + this.state.idCourse + '/unidades')
            .then(response => {
                const names = this.getSubjectsNames(response)
                this.setState({
                    subjectsNames: names,
                    defaultSubject: names[0],
                    idSubject: response[0].idUnidad,
                })  
            })
            .then(() => {
                // Se obtiene el avance del alumno en todas las unidades
                this.APIHandler.getFromAPI('http://206.189.195.214:8080/api/unidad/all/alumno/' + this.state.idStudent)
                    .then(response => {
                        this.setState({
                            subjects: response,
                            isLoading: false
                        })
                    }
                )
            })
            .catch(error => {
                console.error(error)
            }
        )
    }

    render() {
        if(this.state.isLoading) {
            return(
                <View style={styles.activityIndicator}>
                    <Text style={styles.loadingText}>
                        Cargando los objetivos de aprendizaje
                    </Text>
                    <ActivityIndicator size='large'/>
                </View>
            );
        } 
        // Picker que contiene los cursos
        let subjectsItems = !this.state.isLoading ? this.state.subjectsNames.map((val, ind) => { 
            return <Picker.Item key={ind} value={val} label={val} />
        }) : null;
        // Se renderizan los objetivos de aprendizaje
        let learningProgressBars = this.getLearningObjectives(this.state.defaultSubject).OAs.map((OA, id) => {
            let isComplete = OA.percentage === 1 ? require('./Images/check.png') : require('./Images/uncheck.png');
            return (
                // Se verifica si el objetivo está cumplido o no
                <View key={id} style={styles.OAContainer}>
                    <View style={styles.flowRight}>
                        <Text style={styles.OAText}>
                            {OA.name}
                        </Text>
                    </View>
                    <View style={styles.flowRight}>
                        <ProgressBarAndroid
                            style={styles.progressBar}
                            progress={OA.percentage}
                            styleAttr="Horizontal"
                            indeterminate={false}
                        />
                        <Text style={styles.percentage}>
                            {(Math.round(OA.percentage * 100)).toString() + '%'}
                        </Text>
                        <Image
                            resizeMode='cover'
                            style={styles.image}
                            source={isComplete}
                        />
                    </View>
                    <TouchableOpacity onPress={this.goEvaluationIndicators.bind(this, OA)}
                        style={styles.button}>
                        <Text style={styles.textButton}>
                            Ver indicadores de evaluación
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        });
        return (
            <ScrollView style={styles.backColor}>
                <Text style={styles.titleText}>
                    {this.state.name + ' - ' + this.state.course}
                </Text>
                <View style={styles.picker}> 
                    <Picker selectedValue={this.state.defaultSubject}
                            onValueChange={(subject) => {
                                this.setState({ 
                                    defaultSubject: subject,
                                })
                            }}>
                        {subjectsItems}
                    </Picker>
                </View>
                {learningProgressBars}
            </ScrollView>
        );
    }
}

// Definición de estilos
const styles = StyleSheet.create({
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    progressBar: {
        width: '60%',
        marginLeft: '5%',
    },
    image: {
        width: '8%',
        height: heightDevice,
        marginRight: '3%'
    },
    backColor: {
        backgroundColor: '#FFFFFF'
    },
    picker: {
        marginLeft: '20%',
        marginRight: '20%',
        marginBottom: '3%',
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#429b00'
    },
    loadingText: {
        fontSize: 22,
        textAlign: 'center',
        marginBottom: '8%'
    },
    activityIndicator: {
        margin: 'auto',
        marginTop: '4%'
    },
    titleText: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: '7%',
        marginBottom: '3%'
    },
    OAContainer: {
        marginLeft: '1%',
        marginRight: '1%',
        borderWidth: 1.5,
        borderRadius: 8,
        borderColor: '#429b00',
    },
    percentage: {
        marginLeft: '5%',
        marginRight: '5%'
    },
    OAText: {
        marginTop: '3%',
        marginLeft: '5%',
        marginRight: '5%'
    },
    button: {
        marginLeft: '10%',
        marginRight: '10%',
        textAlign: 'center',
        marginTop: '3%',
        marginBottom: '3%',
        backgroundColor: '#429b00',
        alignItems: 'center',
        height: 40
    },
    textButton: {
        marginTop: '2%',
        color: '#FFFFFF',
        fontSize: 18,
    },
})