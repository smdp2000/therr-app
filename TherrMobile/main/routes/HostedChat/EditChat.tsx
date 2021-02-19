import React from 'react';
import { Keyboard, SafeAreaView, Text, StatusBar, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { Button } from 'react-native-elements';
import 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import { MessageActions } from 'therr-react/redux/actions';
import { IUserState, IUserConnectionsState } from 'therr-react/types';
// import EditChatButtonMenu from '../../components/ButtonMenu/EditChatButtonMenu';
import translator from '../../services/translator';
// import RoundInput from '../../components/Input/Round';
// import * as therrTheme from '../../styles/themes';
import beemoLayoutStyles from '../../styles/layouts/beemo';
import styles from '../../styles';

interface IEditChatDispatchProps {
    logout: Function;
    createHostedChat: Function;
}

interface IStoreProps extends IEditChatDispatchProps {
    user: IUserState;
    userConnections: IUserConnectionsState;
}

// Regular component props
export interface IEditChatProps extends IStoreProps {
    navigation: any;
}

interface IEditChatState {
    errorMsg: string;
    successMsg: string;
    inputs: any;
    isSubmitting: boolean;
}

const mapStateToProps = (state) => ({
    user: state.user,
    userConnections: state.userConnections,
});

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            createHostedChat: MessageActions.createForum,
        },
        dispatch
    );

class EditChat extends React.Component<IEditChatProps, IEditChatState> {
    private scrollViewRef;
    private translate: Function;

    constructor(props) {
        super(props);

        this.state = {
            errorMsg: '',
            successMsg: '',
            inputs: {},
            isSubmitting: false,
        };

        this.translate = (key: string, params: any) =>
            translator('en-us', key, params);
    }

    componentDidMount() {
        const { navigation } = this.props;

        navigation.setOptions({
            title: this.translate('pages.editChat.headerTitleCreate'),
        });

        // TODO: Fetch available rooms on first load
    }

    isFormDisabled() {
        const { isSubmitting } = this.state;
        const {
            administratorIds,
            title,
            subtitle,
            description,
            categoryTags,
            integrationIds,
            invitees,
            iconGroup,
            iconId,
            iconColor,
        } = this.state.inputs;
        const requiredInputs = {
            administratorIds,
            title,
            subtitle,
            description,
            categoryTags,
            integrationIds,
            invitees,
            iconGroup,
            iconId,
            iconColor,
        };

        return isSubmitting || Object.keys(requiredInputs).some((key) => !requiredInputs[key]);
    }

    onSubmit = () => {
        const {
            administratorIds,
            title,
            subtitle,
            description,
            categoryTags,
            integrationIds,
            invitees,
            iconGroup,
            iconId,
            iconColor,
            maxCommentsPerMin,
            doesExpire,
            isPublic,
        } = this.state.inputs;

        const createArgs: any = {
            administratorIds,
            title,
            subtitle,
            description,
            categoryTags,
            integrationIds,
            invitees,
            iconGroup,
            iconId,
            iconColor,
            maxCommentsPerMin,
            doesExpire,
            isPublic,
        };

        if (!this.isFormDisabled()) {
            this.setState({
                isSubmitting: true,
            });
            this.props
                .createHostedChat(createArgs)
                .then(() => {
                    this.setState({
                        successMsg: this.translate('forms.editHostedChat.backendSuccessMessage'),
                    });
                    setTimeout(() => {
                        this.props.navigation.navigate('Map');
                    }, 500);
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
                            errorMsg: this.translate('forms.editHostedChat.backendErrorMessage'),
                        });
                    }
                })
                .finally(() => {
                    Keyboard.dismiss();
                    this.scrollViewRef.scrollToEnd({ animated: true });
                });
        }
    };

    render() {
        return (
            <>
                <StatusBar barStyle="light-content" animated={true} translucent={true} />
                <SafeAreaView style={styles.safeAreaView}>
                    <KeyboardAwareScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        ref={(component) => (this.scrollViewRef = component)}
                        style={[styles.bodyFlex, beemoLayoutStyles.bodyEdit]}
                        contentContainerStyle={[styles.bodyScroll, beemoLayoutStyles.bodyEditScroll]}
                    >
                        <View style={beemoLayoutStyles.container}>
                            <Text>Placeholder...</Text>
                        </View>
                    </KeyboardAwareScrollView>
                </SafeAreaView>
                {/* <EditChatButtonMenu navigation={navigation} translate={this.translate} user={user} /> */}
                {/* Create Chat button */}
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditChat);
