import React from 'react';
import { connect } from 'react-redux';
import { Linking, Platform, SafeAreaView, View, StatusBar } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Image from '../../components/BaseImage';
import 'react-native-gesture-handler';
import { IUserState } from 'therr-react/types';
import styles from '../../styles';
import mixins from '../../styles/mixins';
import LoginForm from './LoginForm';
import { bindActionCreators } from 'redux';
import UsersActions from '../../redux/actions/UsersActions';
import translator from '../../services/translator';

interface ILoginDispatchProps {
    login: Function;
}

interface IStoreProps extends ILoginDispatchProps {
    user: IUserState;
}

// Regular component props
export interface ILoginProps extends IStoreProps {
    navigation: any;
    route: any;
}

interface ILoginState {
    isAuthenticating: boolean;
}

const mapStateToProps = (state: any) => ({
    user: state.user,
});

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            login: UsersActions.login,
        },
        dispatch
    );

class LoginComponent extends React.Component<ILoginProps, ILoginState> {
    private translate;
    private cachedUserId;

    constructor(props) {
        super(props);

        this.translate = (key: string, params: any): string =>
            translator('en-us', key, params);
        this.cachedUserId = (props.user && props.user.details && props.user.details.id);
    }

    componentDidMount() {
        const { navigation } = this.props;

        navigation.setOptions({
            title: this.translate('pages.login.headerTitle'),
        });

        if (Platform.OS === 'android') {
            // TODO: Listen on event listener in android with changes to MainActivity.java
            Linking.getInitialURL().then(this.handleAppUniversalLinkURL);
            Linking.addEventListener('url', (url) => {
                this.handleOpenIOSUniversalLink(url);
            });
        } else {
            Linking.addEventListener('url', this.handleOpenIOSUniversalLink);
        }
    }

    componentWillUnmount() { // C
        Linking.removeEventListener('url', this.handleOpenIOSUniversalLink);
    }

    handleOpenIOSUniversalLink = (event) => { // D
        this.handleAppUniversalLinkURL(event.url);
    }

    handleAppUniversalLinkURL = (url) => {
        const { navigation } = this.props;
        const urlSplit = url?.split('?') || [];

        if (url?.includes('verify-email')) {
            if (urlSplit[1] && urlSplit[1].includes('token=')) {
                const verificationToken = urlSplit[1]?.split('token=')[1];
                console.log('VERIFICATION_TOKEN', verificationToken);
                // TODO: Navigation to VerifyEmail route and pass in token
                navigation.navigate('EmailVerification', {
                    verificationToken,
                });
            }
        }
    }

    render() {
        const { route } = this.props;
        const userMessage = route.params && route.params.userMessage;

        return (
            <>
                <StatusBar barStyle="light-content" animated={true} translucent={true} backgroundColor="transparent"  />
                <SafeAreaView  style={styles.safeAreaView}>
                    <KeyboardAwareScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        style={styles.bodyFlex}
                        contentContainerStyle={styles.bodyScroll}
                    >
                        {
                            this.cachedUserId
                            && <View style={[mixins.flexCenter, mixins.marginMediumBot]}>
                                <Image source={{ uri: `https://robohash.org/${this.cachedUserId}?size=200x200` }} loaderSize="large" />
                            </View>
                        }
                        <LoginForm login={this.props.login} navigation={this.props.navigation} userMessage={userMessage} />
                    </KeyboardAwareScrollView>
                </SafeAreaView>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
