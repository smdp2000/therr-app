import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button }  from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IUserState } from 'therr-react/types';
import { PasswordRegex } from 'therr-js-utilities/constants';
import Toast from 'react-native-toast-message';
import analytics from '@react-native-firebase/analytics';
import MainButtonMenu from '../../components/ButtonMenu/MainButtonMenu';
import UsersActions from '../../redux/actions/UsersActions';
import translator from '../../services/translator';
import { buildStyles } from '../../styles';
import { buildStyles as buildMenuStyles } from '../../styles/navigation/buttonMenu';
import { buildStyles as buildFormStyles } from '../../styles/forms';
import { buildStyles as buildSettingsFormStyles } from '../../styles/forms/settingsForm';
import BaseStatusBar from '../../components/BaseStatusBar';

interface IManageAccountDispatchProps {
    updateUser: Function;
}

interface IStoreProps extends IManageAccountDispatchProps {
    user: IUserState;
}

// Regular component props
export interface IManageAccountProps extends IStoreProps {
    navigation: any;
}

interface IManageAccountState {
    croppedImageDetails: any;
    errorMsg: string;
    successMsg: string;
    inputs: any;
    isCropping: boolean;
    isNightMode: boolean;
    isSubmitting: boolean;
    passwordErrorMessage: string;
}

const mapStateToProps = (state) => ({
    user: state.user,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({
    updateUser: UsersActions.update,
}, dispatch);

export class ManageAccount extends React.Component<IManageAccountProps, IManageAccountState> {
    private scrollViewRef;
    private translate: Function;
    private theme = buildStyles();
    private themeMenu = buildMenuStyles();
    private themeForms = buildFormStyles();
    private themeSettingsForm = buildSettingsFormStyles();

    constructor(props) {
        super(props);

        this.state = {
            croppedImageDetails: {},
            errorMsg: '',
            successMsg: '',
            inputs: {
                email: props.user.details.email,
                firstName: props.user.details.firstName,
                lastName: props.user.details.lastName,
                userName: props.user.details.userName,
                phoneNumber: props.user.details.phoneNumber,
                settingsBio: props.user.settings.settingsBio,
                shouldHideMatureContent: props.user.details.shouldHideMatureContent,
            },
            isCropping: false,
            isNightMode: props.user.settings.mobileThemeName === 'retro',
            isSubmitting: false,
            passwordErrorMessage: '',
        };

        this.reloadTheme();
        this.translate = (key: string, params: any) =>
            translator('en-us', key, params);
    }

    componentDidMount = () => {
        this.props.navigation.setOptions({
            title: this.translate('pages.advancedSettings.headerTitle'),
        });
    }

    onDeleteAccountPress = () => {
        const { user } = this.props;

        analytics().logEvent('account_delete_start', {
            userId: user.details.id,
        }).catch((err) => console.log(err));
        Toast.show({
            type: 'successBig',
            text1: this.translate('pages.advancedSettings.alertTitles.accountDeleted'),
            text2: this.translate('pages.advancedSettings.alertMessages.accountDeleted'),
            visibilityTime: 2000,
            onHide: () => {
                console.log('TODO: LOGOUT');
            },
        });
    }

    isFormDisabled() {
        const { isSubmitting } = this.state;

        return isSubmitting;
    }

    reloadTheme = () => {
        const themeName = this.props.user.settings?.mobileThemeName;

        this.theme = buildStyles(themeName);
        this.themeMenu = buildMenuStyles(themeName);
        this.themeForms = buildFormStyles(themeName);
        this.themeSettingsForm = buildSettingsFormStyles(themeName);
    }

    onSubmit = () => {
        const {
            firstName,
            lastName,
            oldPassword,
            userName,
            phoneNumber,
            password,
            repeatPassword,
            settingsBio,
            shouldHideMatureContent,
        } = this.state.inputs;
        const { isNightMode } = this.state;
        const { user } = this.props;

        if (password && !PasswordRegex.test(password)) {
            this.setState({
                errorMsg: this.translate(
                    'forms.settings.errorMessages.passwordInsecure'
                ),
            });
            this.scrollViewRef?.scrollToPosition(0, 0);
            return;
        }

        const updateArgs: any = {
            email: user.details.email,
            phoneNumber: user.details.phoneNumber || phoneNumber,
            firstName,
            lastName,
            userName: userName?.toLowerCase(),
            settingsBio,
            settingsThemeName: isNightMode ? 'retro' : 'light',
            shouldHideMatureContent,
        };

        if (oldPassword && password === repeatPassword) {
            updateArgs.password = password;
            updateArgs.oldPassword = oldPassword;
        }

        if (!this.isFormDisabled()) {
            this.setState({
                isSubmitting: true,
            });
            this.requestUserUpdate(user, updateArgs).finally(() => {
                this.setState({
                    isSubmitting: false,
                });
            });
        }
    };

    requestUserUpdate = (user, updateArgs) => this.props
        .updateUser(user.details.id, updateArgs)
        .then(() => {
            this.setState({
                successMsg: this.translate('forms.settings.backendSuccessMessage'),
            });
            this.reloadTheme();
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

    onThemeChange = (isNightMode: boolean) => {
        this.setState({
            isNightMode,
        });
    }

    handleRefresh = () => {
        console.log('refresh');
    }

    render() {
        const { navigation, user } = this.props;
        const pageHeaderAdvancedSettings = this.translate('pages.advancedSettings.pageHeaderAccountActions');

        return (
            <>
                <BaseStatusBar therrThemeName={this.props.user.settings?.mobileThemeName} />
                <SafeAreaView  style={this.theme.styles.safeAreaView}>
                    <KeyboardAwareScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        ref={(component) => (this.scrollViewRef = component)}
                        style={this.theme.styles.scrollView}
                    >
                        <View style={this.theme.styles.body}>
                            <View style={this.theme.styles.sectionContainer}>
                                <Text style={this.theme.styles.sectionTitle}>
                                    {pageHeaderAdvancedSettings}
                                </Text>
                            </View>
                            <View style={this.themeSettingsForm.styles.advancedContainer}>
                                <Text style={this.theme.styles.sectionDescription}>
                                    <Text
                                        style={this.themeForms.styles.buttonLink}
                                        onPress={this.onDeleteAccountPress}>{this.translate('forms.settings.buttons.deleteAccount')}</Text>
                                </Text>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </SafeAreaView>
                <View style={this.themeSettingsForm.styles.submitButtonContainerFloat}>
                    <Button
                        buttonStyle={this.themeForms.styles.button}
                        title={this.translate(
                            'forms.settings.buttons.submit'
                        )}
                        onPress={this.onSubmit}
                        disabled={this.isFormDisabled()}
                        raised={true}
                    />
                </View>
                <MainButtonMenu
                    navigation={navigation}
                    onActionButtonPress={this.handleRefresh}
                    translate={this.translate}
                    user={user}
                    themeMenu={this.themeMenu}
                />
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageAccount);