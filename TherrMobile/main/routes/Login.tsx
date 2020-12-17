import React from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, ScrollView, StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import { IUserState } from 'therr-react/types';
import styles from '../styles';
import LoginForm from '../components/LoginForm';
import { bindActionCreators } from 'redux';
import UsersActions from '../redux/actions/UsersActions';
import translator from '../services/translator';

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

    constructor(props) {
        super(props);

        this.translate = (key: string, params: any): string =>
            translator('en-us', key, params);
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            title: this.translate('pages.login.headerTitle'),
        });
    }

    render() {
        const { route } = this.props;
        const userMessage = route.params && route.params.userMessage;

        return (
            <>
                <StatusBar barStyle="light-content" animated={true} translucent={true} />
                <SafeAreaView>
                    <ScrollView style={styles.bodyFlex} contentContainerStyle={styles.bodyScroll}>
                        <LoginForm login={this.props.login} navigation={this.props.navigation} userMessage={userMessage} />
                    </ScrollView>
                </SafeAreaView>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
