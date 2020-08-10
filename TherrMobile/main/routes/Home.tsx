import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StatusBar } from 'react-native';
import { Button, ListItem } from 'react-native-elements';
import 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UserConnectionsActions } from 'therr-react/redux/actions';
import { IUserState, IUserConnectionsState } from 'therr-react/types';
import styles from '../styles';
import UsersActions from '../redux/actions/UsersActions';
import translator from '../services/translator';

interface IHomeDispatchProps {
    login: Function;
    logout: Function;
    searchUserConnections: Function;
}

interface IStoreProps extends IHomeDispatchProps {
    user: IUserState;
    userConnections: IUserConnectionsState;
}

// Regular component props
export interface IHomeProps extends IStoreProps {
    navigation: any;
}

interface IHomeState {}

const mapStateToProps = (state: any) => ({
    user: state.user,
    userConnections: state.userConnections,
});

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            login: UsersActions.login,
            logout: UsersActions.logout,
            searchUserConnections: UserConnectionsActions.search,
        },
        dispatch
    );

class Home extends React.Component<IHomeProps, IHomeState> {
    private translate: Function; // eslint-disable-line react/sort-comp

    constructor(props) {
        super(props);

        this.state = {};

        this.translate = (key: string, params: any) =>
            translator('en-us', key, params);
    }

    componentDidMount() {
        const { user, userConnections } = this.props;
        if (!userConnections.connections.length) {
            this.props.searchUserConnections(
                {
                    filterBy: 'acceptingUserId',
                    query: user.details.id,
                    itemsPerPage: 50,
                    pageNumber: 1,
                    orderBy: 'interactionCount',
                    order: 'desc',
                    shouldCheckReverse: true,
                },
                user.details.id
            );
        }
    }

    getConnectionDetails = (connection) => {
        const { user } = this.props;

        return connection.users.find((u) => u.id !== user.details.id) || {};
    };

    getConnectionSubtitle = (connection) => {
        const connectionDetails = this.getConnectionDetails(connection);
        return `${connectionDetails.firstName || ''} ${connectionDetails.lastName || ''}`;
    }

    goToMap = () => {
        const { navigation } = this.props;

        navigation.navigate('Map');
    };

    handleLogout = () => {
        const { user, logout, navigation } = this.props;

        logout(user.details)
            .then(() => {
                navigation.navigate('Login');
            })
            .catch((e) => {
                console.log(e);
            });
    };

    onConnectionPress = (connection) => {
        const details = this.getConnectionDetails(connection);
        console.log(`Hello, ${details.userName}`);
    };

    render() {
        const { user, userConnections } = this.props;

        return (
            <>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView>
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        style={styles.scrollView}
                    >
                        <View style={styles.body}>
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>Actions</Text>
                                <Text style={styles.sectionDescription}>
                                    Welcome to the homepage. This is a work in
                                    progress...
                                </Text>
                                <Button
                                    title="MAP"
                                    onPress={this.goToMap}
                                    containerStyle={{
                                        marginBottom: 10,
                                    }}
                                />
                                <Button
                                    title="LOGOUT"
                                    onPress={this.handleLogout}
                                />
                            </View>
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>
                                    Your Connections
                                </Text>
                                {
                                    userConnections.connections
                                        ? userConnections.connections.map((connection) => (
                                            <ListItem
                                                key={connection.id}
                                                leftAvatar={{ source: { uri: `https://robohash.org/${connection.acceptingUserId === user.details.id
                                                    ? connection.requestingUserId
                                                    : connection.acceptingUserId}?size=100x100` } }}
                                                onPress={() => this.onConnectionPress(connection)}
                                                title={this.getConnectionDetails(connection).userName}
                                                subtitle={this.getConnectionSubtitle(connection)}
                                                bottomDivider
                                            />
                                        ))
                                        : <Text>{this.translate('pages.userProfile.requestRecommendation')}</Text>
                                }
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
