import React from 'react';
import {
    ScrollView,
    View,
    Text,
    Button,
    StyleSheet,
    TouchableOpacity,
    Picker
} from 'react-native';
import { CheckBox } from 'react-native-elements';

export default class ObjectivesPerStudent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'Pedrito',
            subjects: ['object1', 'object2'],     // Listado de cursos para el profesor
            defaultSubject: 'Unidad 1',
            subjectsNames: ['Unidad 1', 'Unidad 2'],
            isLoading: true,
            checkedItems: []
        }
    }

    static navigationOptions = {
        title: 'Objetivos por Alumno'
    };

    // Método que obtiene los nombres de las unidades
    getSubjectsNames() {
        // GET
        return ['Unidad 1', 'Unidad 2'];
    }

    // Método que obtiene los objetivos de aprendizaje para la unidad seleccionada
    getLearningObjectives(subject) {
        // MÉTODO GET
        OAs = [
            {
                id: 1,
                name: 'OA1',
                percentage: 1,
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
                percentage: 1,
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

    // Método que envía los indicadores de evaluación del objetivo de aprendizaje seleccionado a la vista correspondiente
    setEvalIndicators = () => {
        const { subjects } = this.state;
        console.log(this.state.subjects)
        /* this.props.navigation.navigate('SetEvalIndicator', {
            indicators:    
            [
                {
                    "id": 1,
                    "name": 'OA1',
                    "percentage": 0.4
                },
                {
                    "id": 2,
                    "name": 'OA2',
                    "percentage": 0.4
                }
            ],
            OA: this.state.defaultSubject
        }); */
    }

    // Método que redirige a la vista GetEvaluationIndicator con los indicadores de evaluación del objetivo seleccionado
    goEvaluationIndicator(indicators) {
        let aux = {
            OA: indicators.name,
            evalIndicators: indicators.indicators.evalIndicators
        }
        this.props.navigation.navigate('SetEvalIndicator', {
            indicators: aux
        })
    }

    componentWillMount() {
        let subjectsNames = this.getSubjectsNames();
        let subjects = this.getLearningObjectives(subjectsNames[0]);
        let checkedItems = [];
        subjects.OAs.forEach((item) => {
            let isComplete = item.percentage == 1 ? true : false;
            checkedItems.push(isComplete);
        });

        this.setState({
            subjectsNames: subjectsNames,
            defaultSubject: subjectsNames[0],
            subjects: subjects,
            checkedItems: checkedItems
        });
    }

    render() {
        // Picker que contiene los cursos
        let subjectsItems = this.state.subjectsNames.map((val, ind) => {
            return <Picker.Item key={ind} value={val} label={val} />
        });

        // Se mapean los objetivos de aprendizaje de la unidad
        let learningCheckBoxes = this.getLearningObjectives(this.state.defaultSubject).OAs.map((oa, id) => {
            return (
                <View style={styles.flowRight} key={id}>
                    <TouchableOpacity
                        onPress={this.goEvaluationIndicator.bind(this, oa)}
                    >   
                        <Text>{oa.name}</Text>
                    </TouchableOpacity>
                    <Text>
                        {oa.percentage * 100 + '%'}
                    </Text>     
                    <CheckBox
                        key={id}
                        checked={this.state.checkedItems[id]}
                        onPress={() => {
                            let tmp = this.state.checkedItems;
                            tmp[id] = !this.state.checkedItems[id];
                            this.setState({
                                checkedItems: tmp
                            })
                        }}
                    />
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
                {learningCheckBoxes}
                <Button
                    title={'Actualizar'}
                    onPress={this.setEvalIndicators}
                />
            </ScrollView>
        )
    }
}

// Definición de estilos
const styles = StyleSheet.create({
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
    }
})