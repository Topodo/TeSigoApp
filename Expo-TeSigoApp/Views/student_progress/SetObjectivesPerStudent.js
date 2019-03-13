import React from 'react';
import {
    ScrollView,
    View,
    Text,
    Button,
    StyleSheet,
    TouchableOpacity,
    Picker,
    ActivityIndicator,
    Alert
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import APIHandler from '../../Utils/APIHandler';
import { NavigationEvents } from 'react-navigation'

export default class ObjectivesPerStudent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            subjects: [],
            defaultSubject: '',
            subjectsNames: [],
            isLoading: true,
            checkedItems: [],
            idStudent: '',
            idCourse: '',
            alreadyMounted: false
        }
        this.APIHandler = new APIHandler();
    }

    static navigationOptions = {
        title: 'Objetivos por Alumno',
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


    // Método que obtiene los nombres de las unidades
    getSubjectsNames(subjects) {
        let names = []
        subjects.forEach(subject => {
            names.push(subject.nombreUnidad)
        })
        return names
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

    // Método que redirige a la vista GetEvaluationIndicator con los indicadores de evaluación del objetivo seleccionado
    goEvaluationIndicator(indicators) {
        this.props.navigation.navigate('SetEvalIndicator', {
            OAName: indicators.name,
            indicators: indicators.evalIndicators,
            studentName: this.state.name,
            course: this.state.course,
            idStudent: this.state.idStudent,
            idCourse: this.state.idCourse,
            idSubject: this.getLearningObjectives(this.state.defaultSubject).id
        });
        this.setState({
            isLoading: true
        })
    }

    // Método que cambia el estado de los checkboxes, indicando los OAS asignados a la unidad en específico en la cual se está trabajando
    assignCheckboxesValues(subject) {
        let checkedItems = [];
        this.getLearningObjectives(subject).OAs.forEach((item) => {
            let isComplete = item.percentage == 1 ? true : false;
            checkedItems.push({
                isComplete: isComplete,
                idOA: item.id
            });
        });
        this.setState({
            checkedItems: checkedItems,
        })
    }

    // Método que se encarga de envíar los datos actualizados hacia el servidor
    updateOASStatuses() {
        // Se crea el body que se adjuntará en el request 
        let body = []
        this.getLearningObjectives(this.state.defaultSubject).OAs.forEach(OA => {
            this.state.checkedItems.forEach(item => {
                if (item.idOA === OA.id && item.isComplete) {
                    OA.evalIndicators.forEach(EA => {
                        body.push({
                            idIndicador: EA.id,
                            status: true
                        })
                    })
                }
            })
        })
        return body
    }

    // Método que obtiene la data de los OAS desde el servidor
    getOASData() {
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
                        })
                    })
                    .then(() => {
                        // Se verifica el porcentaje de avance de los objetivos de aprendizaje
                        this.assignCheckboxesValues(this.state.defaultSubject)
                        this.setState({
                            isLoading: false,
                        })
                    }
                    ).catch(error => console.error(error))
            })
            .catch(error => {
                console.error(error)
            }
            )
    }

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
        this.setState({
            alreadyMounted: true
        })
        this.getOASData()
    }

    componentDidFocus() {
        if (this.state.alreadyMounted) {
            this.getOASData()
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.activityIndicator}>
                    <NavigationEvents
                        onDidFocus={payload => this.componentDidFocus()} />
                    <Text style={styles.loadingText}>
                        Cargando los objetivos de aprendizaje
                    </Text>
                    <ActivityIndicator size='large' />
                </View>
            );
        }
        // Picker que contiene los cursos
        let subjectsItems = this.state.subjectsNames.map((val, ind) => {
            return <Picker.Item key={ind} value={val} label={val} />
        });

        // Se mapean los objetivos de aprendizaje de la unidad
        let learningCheckBoxes = this.getLearningObjectives(this.state.defaultSubject).OAs.map((OA, id) => {
            return (
                <View style={styles.OAContainer} key={id}>
                    <View style={[styles.flowRight]}>
                        <View style={styles.OAText}>
                            <Text>
                                {(id + 1).toString() + '.- ' + OA.name}
                            </Text>
                        </View>
                        <Text>
                            {(Math.round(OA.percentage * 100)).toString() + '%'}
                        </Text>
                        <CheckBox
                            key={id}
                            checked={this.state.checkedItems[id].isComplete}
                            onPress={() => {
                                let tmp = this.state.checkedItems;
                                tmp[id].isComplete = !this.state.checkedItems[id].isComplete;
                                this.setState({
                                    checkedItems: tmp
                                })
                            }}
                            containerStyle={styles.CheckBoxStyle} />
                    </View>
                    <View style={styles.button}>
                        <Button
                            onPress={this.goEvaluationIndicator.bind(this, OA)}
                            color='#429b00'
                            title="Asignar indicadores de evaluación">
                        </Button>
                    </View>
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
                            this.assignCheckboxesValues(subject)
                        }}>
                        {subjectsItems}
                    </Picker>
                </View>
                {learningCheckBoxes}
                <View style={styles.button}>
                    <Button
                        title={'Actualizar avance'}
                        color='#429b00'
                        onPress={() => {
                            const body = this.updateOASStatuses()
                            this.APIHandler.putToAPI('http://206.189.195.214:8080/api/acompletado/update/' + this.state.idStudent + '/indicadores', body)
                                .then(response => {
                                    // Una vez se haya realizado los cambios, se lanza una alerta indicando si hubo éxito o no
                                    let title = 'Actualización de objetivos'
                                    let subTitle = 'Cambios realizados exitosamente'
                                    if (response.status) {
                                        subTitle = 'Ocurrió un error interno, inténtelo nuevamente'
                                    } else {
                                        // Se obtiene el avance del alumno en todas las unidades
                                        this.APIHandler.getFromAPI('http://206.189.195.214:8080/api/unidad/all/alumno/' + this.state.idStudent)
                                            .then(response => {
                                                this.setState({
                                                    subjects: response,
                                                })
                                            })
                                            .catch(error => console.error(error)
                                            )
                                    }
                                    // Se lanza una alerta indicando el estado de la actualización
                                    Alert.alert(
                                        title,
                                        subTitle,
                                        [{ text: 'OK' }]
                                    )
                                })
                        }} />
                </View>
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
    backColor: {
        backgroundColor: 'white'
    },
    picker: {
        marginLeft: '20%',
        marginRight: '20%',
        marginBottom: '7%',
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
        marginTop: '4%',
    },
    titleText: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: '7%',
        marginBottom: '7%'
    },
    OAContainer: {
        marginLeft: '1%',
        marginRight: '1%',
        borderWidth: 1.5,
        borderRadius: 8,
        borderColor: '#429b00',
        marginBottom: 10,
    },
    percentage: {
        marginLeft: '5%',
        marginRight: '5%'
    },
    OAText: {
        marginTop: '3%',
        marginLeft: '5%',
        marginRight: '5%',
        width: '60%',
        marginBottom: '3%'
    },
    button: {
        marginLeft: '10%',
        marginRight: '10%',
        textAlign: 'center',
        marginTop: '2%',
        marginBottom: '3%',
        height: 40
    },
    textButton: {
        marginTop: '2%',
        color: '#FFFFFF',
        fontSize: 18,
    },
    CheckBoxStyle: {
        backgroundColor: 'white',
        borderColor: 'white',
        width: '15%',
        marginRight: '10%'
    }
})