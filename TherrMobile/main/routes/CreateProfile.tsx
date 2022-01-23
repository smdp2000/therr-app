import React from 'react';
import { SafeAreaView, View, Text, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IUserState } from 'therr-react/types';
import LottieView from 'lottie-react-native';
import UsersActions from '../redux/actions/UsersActions';
import translator from '../services/translator';
import { buildStyles } from '../styles';
import { buildStyles as buildAlertStyles } from '../styles/alerts';
import { buildStyles as buildFTUIStyles } from '../styles/first-time-ui';
import { buildStyles as buildFormStyles } from '../styles/forms';
import { buildStyles as buildSettingsFormStyles } from '../styles/forms/settingsForm';
import CreateProfileStageA from '../components/0_First_Time_UI/CreateProfileStageA';
import CreateProfileStageB from '../components/0_First_Time_UI/CreateProfileStageB';
import BaseStatusBar from '../components/BaseStatusBar';
import { DEFAULT_FIRSTNAME, DEFAULT_LASTNAME } from '../constants';

const profileLoader = require('../assets/profile-circling.json');
const verifyPhoneLoader = require('../assets/verify-phone-shield.json');

interface ICreateProfileDispatchProps {
    updateUser: Function;
}

interface IStoreProps extends ICreateProfileDispatchProps {
    user: IUserState;
}

// Regular component props
export interface ICreateProfileProps extends IStoreProps {
    navigation: any;
}

type StageType = 'A' | 'B';

interface ICreateProfileState {
    errorMsg: string;
    inputs: any;
    isPhoneNumberValid: boolean;
    isSubmitting: boolean;
    stage: StageType;
}

const mapStateToProps = (state) => ({
    user: state.user,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({
    updateUser: UsersActions.update,
}, dispatch);

export class CreateProfile extends React.Component<ICreateProfileProps, ICreateProfileState> {
    private scrollViewRef;
    private translate: Function;
    private theme = buildStyles();
    private themeAlerts = buildAlertStyles();
    private themeFTUI = buildFTUIStyles();
    private themeForms = buildFormStyles();
    private themeSettingsForm = buildSettingsFormStyles();

    constructor(props) {
        super(props);

        this.state = {
            errorMsg: '',
            inputs: {
                email: props.user.details.email,
                firstName: Platform.OS === 'ios' ? (props.user.details.firstName || DEFAULT_FIRSTNAME) : props.user.details.firstName,
                lastName: Platform.OS === 'ios' ? (props.user.details.lastName || DEFAULT_LASTNAME) : props.user.details.lastName,
                userName: props.user.details.userName,
                phoneNumber: props.user.details.phoneNumber,
            },
            isPhoneNumberValid: false,
            isSubmitting: false,
            stage: 'A',
        };

        this.theme = buildStyles(props.user.settings?.mobileThemeName);
        this.themeFTUI = buildFTUIStyles(props.user.settings?.mobileThemeName);
        this.themeForms = buildFormStyles(props.user.settings?.mobileThemeName);
        this.themeSettingsForm = buildSettingsFormStyles(props.user.settings?.mobileThemeName);
        this.translate = (key: string, params: any) =>
            translator('en-us', key, params);
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            title: this.translate('pages.createProfile.headerTitle'),
        });
    }

    isFormADisabled() {
        const { inputs, isSubmitting } = this.state;

        return (
            !inputs.firstName ||
            !inputs.lastName ||
            !inputs.userName ||
            isSubmitting
        );
    }

    isFormBDisabled() {
        const { inputs, isPhoneNumberValid, isSubmitting } = this.state;

        return (
            !inputs.phoneNumber ||
            !isPhoneNumberValid ||
            isSubmitting
        );
    }

    onSubmit = (stage: StageType) => {
        const { isPhoneNumberValid } = this.state;
        const {
            firstName,
            lastName,
            userName,
            phoneNumber,
        } = this.state.inputs;
        const { user } = this.props;

        const updateArgs: any = {
            email: user.details.email,
            phoneNumber: user.details.phoneNumber || phoneNumber,
            firstName,
            lastName,
            userName: userName?.toLowerCase(),
        };

        if (stage === 'B' && !isPhoneNumberValid) {
            this.setState({
                errorMsg: this.translate('forms.createConnection.errorMessages.invalidPhoneNumber'),
            });
            return;
        }

        const isDisable = (stage === 'A' && this.isFormADisabled()) || (stage === 'B' && this.isFormBDisabled());

        if (!isDisable) {
            this.setState({
                isSubmitting: true,
            });
            this.props
                .updateUser(user.details.id, updateArgs)
                .then(() => {
                    if (stage === 'A') {
                        this.setState({
                            stage: 'B',
                        });
                    }
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
                    this.scrollViewRef?.scrollToPosition(0, 0);
                });
        }
    };

    onInputChange = (name: string, value: string) => {
        const { inputs } = this.state;
        const newInputChanges = {
            [name]: value,
        };

        this.setState({
            inputs: {
                ...inputs,
                ...newInputChanges,
            },
            errorMsg: '',
            isSubmitting: false,
        });
    };

    onPhoneInputChange = (name: string, value: string, isValid: boolean) => {
        this.setState({
            isPhoneNumberValid: isValid,
        }, () => this.onInputChange(name, value));
    };

    render() {
        const { errorMsg, inputs, stage } = this.state;
        const pageHeaderA = this.translate('pages.createProfile.pageHeaderA');
        const pageHeaderB = this.translate('pages.createProfile.pageHeaderB');

        return (
            <>
                <BaseStatusBar />
                <SafeAreaView  style={this.theme.styles.safeAreaView}>
                    <KeyboardAwareScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        ref={(component) => (this.scrollViewRef = component)}
                        style={this.theme.styles.scrollViewFull}
                    >
                        <View style={this.theme.styles.body}>
                            <View style={this.theme.styles.sectionContainer}>
                                {
                                    stage === 'A' &&
                                    <Text style={this.themeFTUI.styles.title}>
                                        {pageHeaderA}
                                    </Text>
                                }
                                {
                                    stage === 'B' &&
                                    <Text style={this.themeFTUI.styles.title}>
                                        {pageHeaderB}
                                    </Text>
                                }
                            </View>
                            <View style={[this.theme.styles.sectionContainer, { height: 100, marginBottom: 20 }]}>
                                { stage === 'A' &&
                                    <LottieView
                                        source={profileLoader}
                                        style={this.themeFTUI.styles.formAGraphic}
                                        resizeMode="cover"
                                        speed={1.75}
                                        autoPlay
                                        loop
                                    />
                                }
                                { stage === 'B' &&
                                    <LottieView
                                        source={verifyPhoneLoader}
                                        style={this.themeFTUI.styles.formBGraphic}
                                        resizeMode="contain"
                                        autoPlay
                                        loop
                                    />
                                }
                            </View>
                            {
                                stage === 'A' &&
                                <CreateProfileStageA
                                    errorMsg={errorMsg}
                                    inputs={inputs}
                                    isFormDisabled={this.isFormADisabled()}
                                    onInputChange={this.onInputChange}
                                    onSubmit={() => this.onSubmit(stage)}
                                    translate={this.translate}
                                    themeAlerts={this.themeAlerts}
                                    themeForms={this.themeForms}
                                    themeSettingsForm={this.themeSettingsForm}
                                />
                            }
                            {
                                stage === 'B' &&
                                <CreateProfileStageB
                                    errorMsg={errorMsg}
                                    isFormDisabled={this.isFormBDisabled()}
                                    onInputChange={this.onPhoneInputChange}
                                    onSubmit={() => this.onSubmit(stage)}
                                    translate={this.translate}
                                    themeAlerts={this.themeAlerts}
                                    themeForms={this.themeForms}
                                    themeSettingsForm={this.themeSettingsForm}
                                />
                            }
                        </View>
                    </KeyboardAwareScrollView>
                </SafeAreaView>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateProfile);
