import * as React from 'react';
import { View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import translator from '../services/translator';
import { loginForm as styles } from '../styles/forms';

// Regular component props
interface ILoginFormProps {
    alert?: string;
    login: Function;
    title?: string;
}

interface ILoginFormState {
    inputs: any;
    prevLoginError: string;
    isSubmitting: boolean;
}

/**
 * LoginForm
 */
export class LoginFormComponent extends React.Component<
    ILoginFormProps,
    ILoginFormState
> {
    constructor(props: ILoginFormProps) {
        super(props);

        this.state = {
            inputs: {},
            prevLoginError: '',
            isSubmitting: false,
        };

        this.translate = (key: string, params: any) =>
            translator('en-us', key, params);
    }

    private translate: Function;

    isLoginFormDisabled() {
        return (
            !this.state.inputs.userName ||
            !this.state.inputs.password ||
            this.state.isSubmitting
        );
    }

    onSubmit = () => {
        const { password, rememberMe, userName } = this.state.inputs;
        if (!this.isLoginFormDisabled()) {
            this.setState({
                isSubmitting: true,
            });
            this.props
                .login({
                    userName,
                    password,
                    rememberMe,
                })
                .catch((error: any) => {
                    if (error.statusCode === 400 || error.statusCode === 401 || error.statusCode === 404) {
                        this.setState({
                            prevLoginError: `${error.message}${error.parameters ? '(' + error.parameters.toString() + ')' : ''}`,
                        });
                    } else if (error.statusCode === 500) {
                        this.setState({
                            prevLoginError: this.translate('components.loginForm.backendErrorMessage'),
                            isSubmitting: false,
                        });
                    }
                })
                .finally(() => {
                    this.setState({
                        isSubmitting: false,
                    });
                });
        }
    };

    onInputChange = (name: string, value: string) => {
        const newInputChanges = {
            [name]: value,
        };

        if (name === 'userName') {
            newInputChanges[name] = value.toLowerCase();
        }

        this.setState({
            inputs: {
                ...this.state.inputs,
                ...newInputChanges,
            },
            prevLoginError: '',
        });
    };

    public render(): JSX.Element | null {
        const { prevLoginError } = this.state;
        // const { alert, title } = this.props;

        return (
            <View style={styles.loginContainer}>
                <Input
                    inputStyle={{
                        color: 'white',
                    }}
                    label={this.translate(
                        'components.loginForm.labels.userName'
                    )}
                    value={this.state.inputs.userName}
                    onChangeText={(text) =>
                        this.onInputChange('userName', text)
                    }
                />
                <Input
                    inputStyle={{
                        color: 'white',
                    }}
                    label={this.translate(
                        'components.loginForm.labels.password'
                    )}
                    value={this.state.inputs.password}
                    onChangeText={(text) =>
                        this.onInputChange('password', text)
                    }
                    secureTextEntry={true}
                />
                <View style={{ marginBottom: 20 }}>
                    <Button
                        title={this.translate(
                            'components.loginForm.buttons.login'
                        )}
                        onPress={this.onSubmit}
                        disabled={this.isLoginFormDisabled()}
                    />
                </View>
                <Text style={{
                    textAlign: 'center',
                    color: '#AA0042',
                }}>{prevLoginError}</Text>
            </View>
        );
    }
}

export default LoginFormComponent;
