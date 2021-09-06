import React from 'react';
import { SafeAreaView, ScrollView, View, Text } from 'react-native';
import 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'react-native-elements';
import { IUserState } from 'therr-react/types';
import Alert from '../components/Alert';
import BeemoTextInput from '../components/TextInput/Beemo';
import MainButtonMenuAlt from '../components/ButtonMenu/MainButtonMenuAlt';
import UsersActions from '../redux/actions/UsersActions';
import UsersService from '../redux/services/UsersService';
import translator from '../services/translator';
import BaseStatusBar from '../components/BaseStatusBar';
import styles, { addMargins } from '../styles';
import formStyles from '../styles/forms';

interface IHomeDispatchProps {
    logout: Function;
}

interface IStoreProps extends IHomeDispatchProps {
    user: IUserState;
}

// Regular component props
export interface IHomeProps extends IStoreProps {
    navigation: any;
}

interface IHomeState {
    inputs: any;
    prevReqSuccess: string;
    prevReqError: string;
}

const mapStateToProps = (state: any) => ({
    user: state.user,
});

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            logout: UsersActions.logout,
        },
        dispatch
    );

class Home extends React.Component<IHomeProps, IHomeState> {
    private translate: Function;

    private quote: string;

    private quoteAuthor: string;

    constructor(props) {
        super(props);

        this.state = {
            inputs: {},
            prevReqError: '',
            prevReqSuccess: '',
        };

        this.translate = (key: string, params: any) =>
            translator('en-us', key, params);

        const quote = this.translate('quoteOfTheDay');
        const quoteSplit = quote.split(' - ');
        this.quote = quoteSplit[0];
        this.quoteAuthor = quoteSplit[1];
    }

    componentDidMount() {
        const { navigation } = this.props;

        navigation.setOptions({
            title: 'Therr',
        });
    }

    isFormDisabled = () => !this.state?.inputs?.feedbackMessage;

    onInputChange = (name: string, value: string) => {
        let reqErrorMessage = '';

        const newInputChanges = {
            [name]: value,
        };

        this.setState({
            inputs: {
                ...this.state.inputs,
                ...newInputChanges,
            },
            reqErrorMessage,
            prevReqError: '',
            prevReqSuccess: '',
        });
    };

    onSubmit = () => {
        const { inputs } = this.state;

        UsersService.sendFeedback(inputs.feedback)
            .then(() => {
                this.setState({
                    inputs: {
                        feedback: '',
                    },
                    prevReqSuccess: this.translate('pages.userProfile.messages.success'),
                });
            })
            .catch((error) => {
                if (error.statusCode === 400 || error.statusCode === 404) {
                    this.setState({
                        prevReqError: this.translate('pages.userProfile.messages.error'),
                    });
                }
            });
    };

    handleRefresh = () => {
        console.log('refresh');
    }

    render() {
        const { navigation, user } = this.props;
        const { prevReqSuccess, prevReqError } = this.state;

        return (
            <>
                <BaseStatusBar />
                <SafeAreaView style={styles.safeAreaView}>
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        style={styles.scrollView}
                    >
                        <View style={styles.body}>
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitleCenter}>
                                    {this.translate('pages.userProfile.h2.howItWorks')}
                                </Text>
                                <Text style={styles.sectionDescription}>
                                    {this.translate('pages.userProfile.siteDescription1')}
                                </Text>
                                <Text style={styles.sectionDescription}>
                                    {this.translate('pages.userProfile.siteDescription2')}
                                </Text>
                                <Text style={styles.sectionDescription}>
                                    {this.translate('pages.userProfile.siteDescription3')}
                                </Text>
                                <Text style={styles.sectionDescription}>
                                    {this.translate('pages.userProfile.siteDescription4')}
                                </Text>
                            </View>
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitleCenter}>
                                    {this.translate('pages.userProfile.h2.quoteOfTheDay')}
                                </Text>
                                <Text style={styles.sectionQuote}>
                                    {`"${this.quote}" - ${this.quoteAuthor}`}
                                </Text>
                            </View>
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitleCenter}>
                                    {this.translate('pages.userProfile.h2.shareFeedback')}
                                </Text>
                                <BeemoTextInput
                                    placeholder={this.translate(
                                        'pages.userProfile.labels.feedbackPlaceholder'
                                    )}
                                    value={inputs.feedbackMessage}
                                    onChangeText={(text) =>
                                        this.onInputChange('feedbackMessage', text)
                                    }
                                    numberOfLines={5}
                                />
                                <Alert
                                    containerStyles={addMargins({
                                        marginBottom: 24,
                                    })}
                                    isVisible={!!prevReqSuccess || !!prevReqError}
                                    message={!!prevReqSuccess ? prevReqSuccess : prevReqError}
                                    type={!!prevReqSuccess ? 'success' : 'error'}
                                />
                                <Button
                                    buttonStyle={formStyles.button}
                                    disabledStyle={formStyles.buttonDisabled}
                                    title={this.translate(
                                        'forms.userProfile.buttons.send'
                                    )}
                                    onPress={this.onSubmit}
                                    disabled={this.isFormDisabled()}
                                    raised={false}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
                <MainButtonMenuAlt
                    navigation={navigation}
                    onActionButtonPress={this.handleRefresh}
                    translate={this.translate}
                    user={user}
                />
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
