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
        // MÉTODO GET
        OAs = [
            {
                id: 1,
                name: 'OA1',
                percentage: 0.8,
                indicators: {
                    evalIndicators: [
                        {
                            id: 1,
                            description: 'Primer indicador',
                            percentage: 0.8
                        },
                        {
                            id: 2,
                            description: 'Segundo indicador',
                            percentage: 0.8
                        },
                        {
                            id: 3,
                            description: 'Tercer indicador',
                            percentage: 0.8
                        },
                    ]
                }
            },
            {
                id: 2,
                name: 'OA2',
                percentage: 0.4,
                indicators: {
                    evalIndicators: [
                        {
                            id: 1,
                            description: 'Primer indicador',
                            percentage: 0.8
                        },
                        {
                            id: 2,
                            description: 'Segundo indicador',
                            percentage: 0.8
                        },
                        {
                            id: 3,
                            description: 'Tercer indicador',
                            percentage: 0.8
                        },
                    ]
                }
            }
        ]
        let unidades = [
            {
                id: 1,
                name: 'Unidad 1',
                OAs: OAs
            },
            {
                id: 2,
                name: 'Unidad 2',
                OAs: [
                    {
                        id: 1,
                        name: 'OA3',
                        percentage: 0.8,
                        indicators: {
                            evalIndicators: [
                                {
                                    id: 1,
                                    description: 'Primer indicador',
                                    percentage: 0.8
                                },
                                {
                                    id: 2,
                                    description: 'Segundo indicador',
                                    percentage: 0.8
                                },
                                {
                                    id: 3,
                                    description: 'Tercer indicador',
                                    percentage: 0.8
                                },
                            ]
                        }
                    },
                    {
                        id: 2,
                        name: 'OA4',
                        percentage: 0.4,
                        indicators: {
                            evalIndicators: [
                                {
                                    id: 1,
                                    description: 'Primer indicador',
                                    percentage: 0.8
                                },
                                {
                                    id: 2,
                                    description: 'Segundo indicador',
                                    percentage: 0.8
                                },
                                {
                                    id: 3,
                                    description: 'Tercer indicador',
                                    percentage: 0.8
                                },
                            ]
                        }
                    }
                ]
            }
        ];
        for (i = 0; i < unidades.length; i++) {
            if (unidades[i].name === subject) {
                return unidades[i];
            }
        }
    }

    // Método que redirige la navegación a la vista de los indicadores de evaluación
    goEvaluationIndicators = (indicators) => {
        let aux = {
            OA: indicators.name,
            evalIndicators: indicators.evalIndicators
        }
        this.props.navigation.navigate('GetEvalIndicator',
            {
                indicators: aux
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
            name: params.studentName
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
                // Se obtiene el avance del alumno en la unidad seleccionada
                this.APIHandler.getFromAPI('http://206.189.195.214:8080/api/unidad/' + this.state.idSubject + 
                    '/alumno/' + this.state.idStudent)
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
                <View>
                    <ActivityIndicator/>
                </View>
            );
        } 
        // Picker que contiene los cursos
        let subjectsItems = !this.state.isLoading ? this.state.subjectsNames.map((val, ind) => { 
            return <Picker.Item key={ind} value={val} label={val} />
        }) : null;
        // Se renderizan los objetivos de aprendizaje
        let learningProgressBars = this.state.subjects.subjects.OAs.map((index, id) => {
            let isComplete = index.percentage === 1 ? require('./Images/check.png') : require('./Images/uncheck.png');
            return (
                // Se verifica si el objetivo está cumplido o no
                <View key={id}>
                    <View >
                        <Text>
                            {index.name}
                        </Text>
                        <Text>
                            {index.percentage}
                        </Text>
                        <TouchableOpacity
                            onPress={this.goEvaluationIndicators.bind(this, index)}
                        >
                            <Text>
                                Ver indicadores de evaluación
                        </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.flowRight}>
                        <ProgressBarAndroid
                            style={styles.progressBar}
                            progress={index.percentage}
                            styleAttr="Horizontal"
                            indeterminate={false}
                        />
                        <Image
                            resizeMode='cover'
                            style={styles.image}
                            source={isComplete}
                        />
                    </View>
                </View>
            );
        });
        return (
            <ScrollView>
                <Text>
                    {this.state.name}
                </Text>
                <Picker selectedValue={this.state.defaultSubject}
                        onValueChange={(subject) => {
                            this.setState({ 
                                defaultSubject: subject,
                            })
                            let idSubject = this.getSubjectID(subject)
                            this.setState({
                                idSubject: idSubject
                            })
                            this.getCurrentPerformance(idSubject)
                        }}>
                    {subjectsItems}
                </Picker>
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
        width: '80%'
    },
    image: {
        width: '8%',
        height: heightDevice,
    }
})