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

const width = Dimensions.get('window').width * 0.8;
const height = Dimensions.get('window').height * 0.6;

export default class ShowEvidence extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: '',
            uri: '',
            name: '',
            date: '',
            isLoading: true
        }
    }

    // Método que recupera la evidencia desde la vista anterior
    getEvidence() {
        const { params } = this.props.navigation.state;
        return params.evidence;
    }

    // Método que renderiza la evidencia en función del tipo de archivo que este sea
    renderEvidence() {
        switch (this.state.type) {
            case 'picture':
                return (
                    <Image
                    style={styles.image}
                    source={{uri: this.state.uri}}
                  />
                );
            case 'video':
                return null;
            case 'audio':
                return null;
        }
        return null;
    }

    componentWillMount() {
        let evidence = this.getEvidence();
        this.setState({
            type: evidence.type,
            uri: evidence.uri,
            name: evidence.name,
            date: evidence.date
        });
    }

    static navigationOptions = {
        title: 'Evidencia cualitativa'
    };

    render() {
        let evidence = this.renderEvidence();
        console.log(this.state.uri)
        return (
            <ScrollView>
                <Text>
                    {this.state.name}
                </Text>
                <Text>
                    {this.state.date}
                </Text>
                {evidence}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        width: width,
        height: height
    }
});