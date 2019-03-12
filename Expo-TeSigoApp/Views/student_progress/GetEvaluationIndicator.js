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
            name: '',
            course: '',
            evalIndicators: [],
            OAName: ''
        }
    }

    // Para modificar el state al cambiar de un componente a otro
    componentWillMount() {
        const { params } = this.props.navigation.state;
        this.setState({
            evalIndicators: params.indicators,
            name: params.studentName,
            course: params.course,
            OAName: params.OAName
        });
    }

    static navigationOptions = {
        title: 'Indicadores de evaluación',
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

    render() {
        // Se renderizan los indicadores de evaluación
        let checkImages = this.state.evalIndicators.map((ind, key) => {
            let isComplete = ind.isComplete ? require('../Images/check.png') : require('../Images/uncheck.png');
            return (
                <View key={key} style={styles.IEContainer}>
                    <View style={styles.flowRight}>
                        <View style={styles.IESubContainer}>
                            <Text style={styles.IEText}>
                                {(key + 1).toString() + '.- ' + ind.description}
                            </Text>
                        </View>
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
            <ScrollView style={styles.backColor}>
                <Text style={styles.titleText}>
                    {this.state.name + ' - ' + this.state.course}
                </Text>
                <View style={styles.OATitleContainer}>
                    <Text style={styles.OATitle}>
                        {this.state.OAName}
                    </Text>
                </View>
                {checkImages}
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
        marginRight: '3%'
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
    IEContainer: {
        marginLeft: '1%',
        marginRight: '1%',
        borderWidth: 1.5,
        borderRadius: 8,
        borderColor: '#429b00',
        marginBottom: 10
    },
    IESubContainer: {
        width: '85%',
        marginBottom: '3%',
    },
    IEText: {
        marginTop: '3%',
        marginLeft: '5%',
        marginRight: '5%',
    },
    OATitle: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: '7%',
        marginBottom: '3%',
    },
    OATitleContainer: {
        marginLeft: '3%',
        marginRight: '3%',
        marginBottom: '4%'
    }
})