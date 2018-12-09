import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    Button,
    StyleSheet,
    TouchableOpacity,
    Picker,
    ActivityIndicator
} from 'react-native';
import APIHandler from '../Utils/APIHandler';

export default class StudentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            students: null,
            course: null,
            idCourse: -1,
            expandableItems: [],
            subjects: []
        }
        this.APIHandler = new APIHandler();
    }

    getOAs(student) {
        this.props.navigation.navigate('GetObjectivesPerStudent', { 
            idStudent: student.idAlumno,
            idCourse: this.state.idCourse,
            studentName: student.nombreAlumno + " " + student.apellidoPaternoAlumno + " " + student.apellidoMaternoAlumno,
            course: this.state.course
        })
    }

    componentWillMount() {
        const { params } = this.props.navigation.state;
        this.setState({
            course: params.course,
            idCourse: params.idCourse,
        });
    }

    componentDidMount() {
        this.APIHandler.getFromAPI('http://206.189.195.214:8080/api/curso/' + this.state.idCourse + '/alumnos').
        then(resultJSON => {
            let expandableItems = []
            for(i = 0; i < resultJSON.lenght; i++) {
                expandableItems.push(false);
            }
            this.setState({
                students: resultJSON,
                isLoading: false,
                expandableItems: expandableItems
            })  
        })
    }

    static navigationOptions = {
        title: 'Lista de alumnos'
    };

    // Método que renderiza la información de la lista de alumnos
    renderInfo(info, id) {
        return (
            <View key={id} style={styles.flowRight}>
                <Text>
                    {info.nombreAlumno + " " + info.apellidoPaternoAlumno + " " + info.apellidoMaternoAlumno}
                </Text>
                <Button title="Objetivos de aprendizaje"
                        onPress={this.getOAs.bind(this, info)}
                        style={styles.buttonStyle}>
                </Button>
            </View>
        );
    }

    render() {
        let studentsList = this.state.isLoading === true ? null :
        this.state.students.map((student, index) => {
            return (this.renderInfo(student, index));
        });
        if(this.state.isLoading) {
            return(
                <View>
                    <ActivityIndicator/>
                </View>
            );
        } else {
            return (
                <ScrollView>
                    <Text>
                        {this.state.course}
                    </Text>
                    {studentsList}
                </ScrollView>
            );
        }
    }
}

// Definición de estilos
const styles = StyleSheet.create({
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    buttonStyle: {
        marginRight: 0
    }
})