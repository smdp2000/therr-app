import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StatusBar } from 'react-native';
import { Button, Input }  from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IUserState } from 'therr-react/types';
import MainButtonMenu from '../components/ButtonMenu/MainButtonMenu';
import UsersActions from '../redux/actions/UsersActions';
import Alert from '../components/Alert';
import translator from '../services/translator';
import styles from '../styles';
import * as therrTheme from '../styles/themes';
import formStyles, { settingsForm as settingsFormStyles } from '../styles/forms';


interface ISettingsDispatchProps {
    updateUser: Function;
}

interface IStoreProps extends ISettingsDispatchProps {
    user: IUserState;
}

// Regular component props
export interface ISettingsProps extends IStoreProps {
    navigation: any;
}

interface ISettingsState {
    errorMsg: string;
    successMsg: string;
    inputs: any;
    isSubmitting: boolean;
    passwordErrorMessage: string;
}

const mapStateToProps = (state) => ({
    user: state.user,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({
    updateUser: UsersActions.update,
}, dispatch);

export class Settings extends React.Component<ISettingsProps, ISettingsState> {
    private scrollViewRef;
    private translate: Function;

    constructor(props) {
        super(props);

        this.state = {
            errorMsg: '',
            successMsg: '',
            inputs: {
                email: props.user.details.email,
                firstName: props.user.details.firstName,
                lastName: props.user.details.lastName,
                userName: props.user.details.userName,
            },
            isSubmitting: false,
            passwordErrorMessage: '',
        };

        this.translate = (key: string, params: any) =>
            translator('en-us', key, params);
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            title: this.translate('pages.settings.headerTitle'),
        });
    }

    isFormDisabled() {
        const { inputs, isSubmitting } = this.state;

        // TODO: Add message to show when passwords not equal
        return (
            (inputs.oldPassword && inputs.password !== inputs.repeatPassword) ||
            !inputs.userName ||
            isSubmitting
        );
    }

    onSubmit = () => {
        const {
            firstName,
            lastName,
            oldPassword,
            userName,
            password,
            repeatPassword,
        } = this.state.inputs;
        const { user } = this.props;

        const updateArgs: any = {
            email: user.details.email,
            firstName,
            lastName,
            userName: userName.toLowerCase(),
        };

        if (oldPassword && password === repeatPassword) {
            updateArgs.password = password;
            updateArgs.oldPassword = oldPassword;
        }

        if (!this.isFormDisabled()) {
            this.setState({
                isSubmitting: true,
            });
            this.props
                .updateUser(user.details.id, updateArgs)
                .then(() => {
                    this.setState({
                        successMsg: this.translate('forms.settings.backendSuccessMessage'),
                    });
                })
                .catch((error: any) => {
                    if (
                        error.statusCode === 400 ||
                        error.statusCode === 401 ||
                        error.statusCode === 404
                    ) {
                        this.setState({
                            errorMsg: `${error.message}${
                                error.parameters
                                    ? '(' + error.parameters.toString() + ')'
                                    : ''
                            }`,
                        });
                    } else if (error.statusCode >= 500) {
                        this.setState({
                            errorMsg: this.translate('forms.settings.backendErrorMessage'),
                        });
                    }
                })
                .finally(() => {
                    this.scrollViewRef.scrollTo({y: 0});
                });
        }
    };

    onInputChange = (name: string, value: string) => {
        let passwordErrorMessage = '';
        const { inputs } = this.state;
        const newInputChanges = {
            [name]: value,
        };

        if (name === 'repeatPassword' && inputs.oldPassword) {
            if (inputs.password !== newInputChanges.repeatPassword) {
                passwordErrorMessage = this.translate('forms.settings.errorMessages.repeatPassword');
            }
        }

        this.setState({
            inputs: {
                ...inputs,
                ...newInputChanges,
            },
            errorMsg: '',
            successMsg: '',
            isSubmitting: false,
            passwordErrorMessage,
        });
    };

    render() {
        const { navigation, user } = this.props;
        const { errorMsg, successMsg, inputs, passwordErrorMessage } = this.state;
        const pageHeaderUser = this.translate('pages.settings.pageHeaderUser');
        const pageHeaderPassword = this.translate('pages.settings.pageHeaderPassword');

        return (
            <>
                <StatusBar barStyle="light-content" animated={true} translucent={true} />
                <SafeAreaView>
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        ref={(component) => (this.scrollViewRef = component)}
                        style={styles.scrollView}
                    >
                        <View style={styles.body}>
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>
                                    {pageHeaderUser}
                                </Text>
                            </View>
                            <View style={settingsFormStyles.userContainer}>
                                <Alert
                                    containerStyles={{
                                        marginBottom: 24,
                                    }}
                                    isVisible={!!(errorMsg || successMsg)}
                                    message={successMsg || errorMsg}
                                    type={errorMsg ? 'error' : 'success'}
                                />
                                <Input
                                    inputStyle={formStyles.input}
                                    label={this.translate(
                                        'forms.settings.labels.userName'
                                    )}
                                    value={inputs.userName}
                                    onChangeText={(text) =>
                                        this.onInputChange('userName', text)
                                    }
                                    selectionColor={therrTheme.colors.ternary}
                                />
                                <Input
                                    inputStyle={formStyles.input}
                                    label={this.translate(
                                        'forms.settings.labels.firstName'
                                    )}
                                    value={inputs.firstName}
                                    onChangeText={(text) =>
                                        this.onInputChange('firstName', text)
                                    }
                                    selectionColor={therrTheme.colors.ternary}
                                />
                                <Input
                                    inputStyle={formStyles.input}
                                    label={this.translate(
                                        'forms.settings.labels.lastName'
                                    )}
                                    value={inputs.lastName}
                                    onChangeText={(text) =>
                                        this.onInputChange('lastName', text)
                                    }
                                    selectionColor={therrTheme.colors.ternary}
                                />
                                <Input
                                    disabled
                                    inputStyle={formStyles.input}
                                    label={this.translate(
                                        'forms.settings.labels.email'
                                    )}
                                    value={inputs.email}
                                    onChangeText={(text) =>
                                        this.onInputChange('email', text)
                                    }
                                    selectionColor={therrTheme.colors.ternary}
                                />
                            </View>
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>
                                    {pageHeaderPassword}
                                </Text>
                            </View>
                            <View style={settingsFormStyles.passwordContainer}>
                                <Input
                                    inputStyle={formStyles.input}
                                    label={this.translate(
                                        'forms.settings.labels.password'
                                    )}
                                    value={inputs.oldPassword}
                                    onChangeText={(text) =>
                                        this.onInputChange('oldPassword', text)
                                    }
                                    secureTextEntry={true}
                                    selectionColor={therrTheme.colors.ternary}
                                />
                                <Input
                                    inputStyle={formStyles.input}
                                    label={this.translate(
                                        'forms.settings.labels.newPassword'
                                    )}
                                    value={inputs.password}
                                    onChangeText={(text) =>
                                        this.onInputChange('password', text)
                                    }
                                    secureTextEntry={true}
                                    selectionColor={therrTheme.colors.ternary}
                                />
                                <Input
                                    inputStyle={formStyles.input}
                                    label={this.translate(
                                        'forms.settings.labels.repeatPassword'
                                    )}
                                    value={inputs.repeatPassword}
                                    onChangeText={(text) =>
                                        this.onInputChange('repeatPassword', text)
                                    }
                                    secureTextEntry={true}
                                    selectionColor={therrTheme.colors.ternary}
                                    errorMessage={passwordErrorMessage}
                                />
                                <View style={settingsFormStyles.submitButtonContainer}>
                                    <Button
                                        buttonStyle={formStyles.button}
                                        title={this.translate(
                                            'forms.settings.buttons.submit'
                                        )}
                                        onPress={this.onSubmit}
                                        disabled={this.isFormDisabled()}
                                        raised={true}
                                    />
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
                <MainButtonMenu navigation={navigation} translate={this.translate} user={user} />
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
