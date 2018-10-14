import React, { Component } from 'react';
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

export default class EvaluationIndicator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'Pedrito',
            course: 'Cuarto básico',
            evalIndicators: ['N°1', 'N°2'],
            objective: 'OA1'
        };
    }

    static navigationOptions = {
        title: 'Indicadores de evaluación'
    };

    // Método que obtiene los indicadores de evaluación
    getEvalIndicators() {
        const { params } = this.props.navigation.state;
        return params.indicators;
    }

    render() {

        // Se mapean los indicadores de evaluación para renderizar
        let params = this.getEvalIndicators();
        let objective = params['OA']; // Se obtiene el objetivo de aprendizaje a consultar
        let evalInd = params.evalIndicators.map((indicator, index) => {
            return(
                <View key={index} style={styles.flowRight}>
                    <Text>
                        {indicator.description}
                    </Text>
                    <CheckBox key={index}/>
                </View>
            );
        });

        return(
            <ScrollView>
                <Text>
                    {objective}
                </Text>
                { evalInd }
                <Button
                    title='Actualizar'
                    onPress={() => {}}
                />
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
    }
})