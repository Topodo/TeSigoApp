import React from 'react';
import {
    ScrollView,
    View,
    Text,
    Button,
    Picker
} from 'react-native';

export default class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            courses: ['Cuarto básico', 'Quinto básico', 'Sexto básico'],     // Listado de cursos para el profesor
            defaultCourse: 'Quinto básico'
        }
    }

    static navigationOptions = {
        title: 'Menú Principal'
    };

    render() {
        // Picker que contiene los cursos
        let coursesItems = this.state.courses.map((val, ind) => {
            return <Picker.Item key={ind} value={val} label={val} />
        });
        return (
            <View>
                <Text>
                    Seleccione un curso
                </Text>
                <Picker selectedValue={this.state.defaultCourse}
                        onValueChange={(course) => (this.setState({ defaultCourse: course }))}>
                    {coursesItems}
                </Picker>
            </View>
        )
    }
}