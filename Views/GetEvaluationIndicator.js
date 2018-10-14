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

export default class GetEvaluationIndicator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'Pedrito',
            course: 'Cuarto básico',
            evalIndicators: {
                OA: 'name',
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
            },
        }
    }

    // Para modificar el state al cambiar de un componente a otro
    componentWillMount() {
        let learningObjectives = this.getEvalIndicators();
        this.setState({
            evalIndicators: learningObjectives
        });
    }

    // Método que redirige la navegación a la vista de los indicadores de evaluación
    // Método que obtiene los indicadores de evaluación
    getEvalIndicators() {
        const { params } = this.props.navigation.state;
        return params.indicators;
    }

    static navigationOptions = {
        title: 'Indicadores de evaluación'
    };

    /*
        Formato JSON

        indicators: {
            OA: 'name',
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
    */

    render() {

        // Se renderizan los indicadores de evaluación
        let progressBars = this.state.evalIndicators.evalIndicators.map((ind, key) => {
            let isComplete = ind.percentage == 1 ? require('./Images/check.png') : require('./Images/uncheck.png');
            return (
                <View key={ind.id}>
                    <View style={styles.flowRight}>
                        <Text>
                            {ind.description}
                        </Text>
                        <Text>
                            {ind.percentage + '%'}
                        </Text>
                    </View>
                    <View style={styles.flowRight}>
                        <ProgressBarAndroid
                            style={styles.progressBar}
                            progress={ind.percentage}
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
        })

        return (
            <ScrollView>
                <Text>
                    {this.state.name + ' - ' + this.state.course}
                </Text>
                <Text>
                    {this.state.evalIndicators.OA}
                </Text>
                {progressBars}
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