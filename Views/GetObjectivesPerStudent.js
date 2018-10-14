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

const heightDevice = Dimensions.get('window').width * 0.08;

export default class GetObjectivesPerStudent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'Pedrito',
            course: 'Cuarto básico',
            subjects: ['object1', 'object2'],     // Listado de cursos para el profesor
            defaultSubject: 'Unidad 1',
            OAs: [
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
                }
            ],
            subjectsNames: []
        }
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
            evalIndicators: indicators.indicators.evalIndicators
        }
        this.props.navigation.navigate('GetEvalIndicator',
            {
                indicators: aux
            }
        );
    }

    // Método que obtiene los nombres de las unidades
    getSubjectsNames() {
        // GET
        return ['Unidad 1', 'Unidad 2'];
    }

    static navigationOptions = {
        title: 'Objetivos por alumno'
    };

    // Método que agrega al state los datos provenientes de la lista de alumnos 
    componentWillMount() {
        this.setState({
            subjects: this.getLearningObjectives(),
            subjectsNames: this.getSubjectsNames()
        });
    }

    render() {
        // Picker que contiene los cursos
        let subjectsItems = this.getSubjectsNames().map((val, ind) => { // CAMBIAR PARA PONER SETSTATE (subjects)
            return <Picker.Item key={ind} value={val} label={val} />
        });
        // Se renderizan los objetivos de aprendizaje
        let learningObjectives = this.getLearningObjectives(this.state.defaultSubject);
        let learningProgressBars = learningObjectives.OAs.map((index, id) => {
            let isComplete = index.percentage == 1 ? require('./Images/check.png') : require('./Images/uncheck.png');
            return (
                // Se verifica si el objetivo está cumplido o no
                <View key={id}>
                    <View style={styles.flowRight}>
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
                    onValueChange={(subject) => (this.setState({ defaultSubject: subject }))}>
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