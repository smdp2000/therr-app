import * as React from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { PasswordRegex } from 'therr-js-utilities/constants';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import translator from '../../services/translator';
import { addMargins } from '../../styles';
import formStyles, { loginForm as loginFormStyles } from '../../styles/forms';
import * as therrTheme from '../../styles/themes';
import Alert from '../../components/Alert';
import SquareInput from '../../components/Input/Square';

// Regular component props
interface IRegisterFormProps {
    alert?: string;
    onSuccess: Function;
    register: Function;
    title?: string;
}

interface IRegisterFormState {
    inputs: any;
    passwordErrorMessage: string;
    prevRegisterError: string;
    isSubmitting: boolean;
}

/**
 * RegisterForm
 */
export class RegisterFormComponent extends React.Component<
    IRegisterFormProps,
    IRegisterFormState
> {
    private translate: Function;

    constructor(props: IRegisterFormProps) {
        super(props);

        this.state = {
            inputs: {},
            passwordErrorMessage: '',
            prevRegisterError: '',
            isSubmitting: false,
        };

        this.translate = (key: string, params: any) =>
            translator('en-us', key, params);
    }

    isRegisterFormDisabled = () => {
        return !this.state.inputs.email ||
            !this.state.inputs.password ||
            !this.isFormValid();
    }

    isFormValid = () => {
        return this.state.inputs.password === this.state.inputs.repeatPassword;
    }

    onSubmit = () => {
        const { inputs } = this.state;

        if (!this.isRegisterFormDisabled()) {
            if (!PasswordRegex.test(inputs.password)) {
                this.setState({
                    prevRegisterError: this.translate(
                        'forms.registerForm.errorMessages.passwordInsecure'
                    ),
                });
                return;
            }

            const creds = {
                ...inputs,
            };
            delete creds.repeatPassword;

            this.setState({
                isSubmitting: true,
            });

            this.props
                .register(creds)
                .then(() => {
                    this.props.onSuccess();
                })
                .catch((error: any) => {
                    if (
                        error.statusCode === 400
                    ) {
                        this.setState({
                            prevRegisterError: `${error.message}${
                                error.parameters
                                    ? ' error (' + error.parameters.toString() + ')'
                                    : ''
                            }`,
                        });
                    } else {
                        this.setState({
                            prevRegisterError: this.translate(
                                'forms.registerForm.backendErrorMessage'
                            ),
                        });
                    }
                    this.setState({
                        isSubmitting: false,
                    });
                });
        }
    };

    onInputChange = (name: string, value: string) => {
        const { inputs } = this.state;
        let passwordErrorMessage = '';

        const newInputChanges = {
            [name]: value,
        };

        if (name === 'repeatPassword') {
            if (inputs.password !== newInputChanges.repeatPassword) {
                passwordErrorMessage = this.translate('forms.registerForm.errorMessages.repeatPassword');
            }
        }

        if (name === 'password' && inputs.repeatPassword) {
            if (inputs.repeatPassword !== newInputChanges.password) {
                passwordErrorMessage = this.translate('forms.registerForm.errorMessages.repeatPassword');
            }
        }

        this.setState({
            inputs: {
                ...inputs,
                ...newInputChanges,
            },
            prevRegisterError: '',
            passwordErrorMessage,
        });
    };

    public render(): JSX.Element | null {
        const {
            passwordErrorMessage,
            prevRegisterError,
        } = this.state;
        // const { alert, title } = this.props;
        const passwordRequirements1 = this.translate('pages.register.passwordRequirements1');
        const passwordRequirements2 = this.translate('pages.register.passwordRequirements2');
        const passwordRequirements3 = this.translate('pages.register.passwordRequirements3');

        return (
            <>
                <SquareInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder={this.translate(
                        'forms.registerForm.labels.email'
                    )}
                    value={this.state.inputs.email}
                    onChangeText={(text) =>
                        this.onInputChange('email', text)
                    }
                    rightIcon={
                        <MaterialIcon
                            name="email"
                            size={24}
                            color={therrTheme.colorVariations.primary3Fade}
                        />
                    }
                />
                <View style={formStyles.textField}>
                    <Text style={formStyles.textFieldInfoTextHeader}>
                        Password Requirements
                    </Text>
                    <Text style={formStyles.textFieldInfoText}>
                        {`* ${passwordRequirements1}`}
                    </Text>
                    <Text style={formStyles.textFieldInfoText}>
                        {`* ${passwordRequirements2}`}
                    </Text>
                    <Text style={formStyles.textFieldInfoText}>
                        {`* ${passwordRequirements3}`}
                    </Text>
                </View>
                {/* TODO: RMOBILE-26: Centralize password requirements */}
                <SquareInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder={this.translate(
                        'forms.registerForm.labels.password'
                    )}
                    value={this.state.inputs.password}
                    onChangeText={(text) =>
                        this.onInputChange('password', text)
                    }
                    secureTextEntry={true}
                    rightIcon={
                        <MaterialIcon
                            name="vpn-key"
                            size={26}
                            color={therrTheme.colorVariations.primary3Fade}
                        />
                    }
                />
                <SquareInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder={this.translate(
                        'forms.registerForm.labels.repeatPassword'

                    )}
                    value={this.state.inputs.repeatPassword}
                    onChangeText={(text) =>
                        this.onInputChange('repeatPassword', text)
                    }
                    errorMessage={passwordErrorMessage}
                    secureTextEntry={true}
                    rightIcon={
                        <MaterialIcon
                            name="lock"
                            size={26}
                            color={therrTheme.colorVariations.primary3Fade}
                        />
                    }
                />
                <Alert
                    containerStyles={addMargins({
                        marginBottom: 24,
                    })}
                    isVisible={!!prevRegisterError}
                    message={prevRegisterError}
                    type={'error'}
                />
                <View style={loginFormStyles.registerButtonContainer}>
                    <Button
                        buttonStyle={loginFormStyles.button}
                        title={this.translate(
                            'forms.registerForm.buttons.register'
                        )}
                        onPress={this.onSubmit}
                        disabled={this.isRegisterFormDisabled()}
                    />
                </View>
            </>
        );
    }
}

export default RegisterFormComponent;
