import React from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UserConnectionsActions } from 'therr-react/redux/actions';
import { IUserState, IUserConnectionsState } from 'therr-react/types';
import styles from '../../styles';
import translator from '../../services/translator';
// import CreateConnectionButton from '../../components/CreateConnectionButton';
import BaseStatusBar from '../../components/BaseStatusBar';
import MainButtonMenuAlt from '../../components/ButtonMenu/MainButtonMenuAlt';
import MessagesContactsTabs from '../../components/FlatListHeaderTabs/MessagesContactsTabs';
import ConnectionItem from '../ActiveConnections/ConnectionItem';
import CreateConnectionButton from '../../components/CreateConnectionButton';

interface IContactsDispatchProps {
    logout: Function;
    searchUserConnections: Function;
}

interface IStoreProps extends IContactsDispatchProps {
    user: IUserState;
    userConnections: IUserConnectionsState;
}

// Regular component props
export interface IContactsProps extends IStoreProps {
    navigation: any;
}

interface IContactsState {}

const mapStateToProps = (state) => ({
    user: state.user,
    userConnections: state.userConnections,
});

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            searchUserConnections: UserConnectionsActions.search,
        },
        dispatch
    );

class Contacts extends React.Component<IContactsProps, IContactsState> {
    private translate: Function;

    constructor(props) {
        super(props);

        this.state = {};

        this.translate = (key: string, params: any) =>
            translator('en-us', key, params);
    }

    componentDidMount() {
        const { navigation, user, userConnections } = this.props;

        navigation.setOptions({
            title: this.translate('pages.contacts.headerTitle'),
        });

        if (!userConnections.connections.length) {
            this.props
                .searchUserConnections(
                    {
                        filterBy: 'acceptingUserId',
                        query: user.details && user.details.id,
                        itemsPerPage: 50,
                        pageNumber: 1,
                        orderBy: 'interactionCount',
                        order: 'desc',
                        shouldCheckReverse: true,
                    },
                    user.details && user.details.id
                )
                .catch(() => {});
        }
    }

    getConnectionDetails = (connection) => {
        const { user } = this.props;

        // Active connection format
        if (!connection.users) {
            return connection;
        }

        // User <-> User connection format
        return (
            connection.users.find(
                (u) => user.details && u.id !== user.details.id
            ) || {}
        );
    };

    getConnectionSubtitle = (connectionDetails) => {
        return `${connectionDetails.firstName || ''} ${
            connectionDetails.lastName || ''
        }`;
    };

    onConnectionPress = (connectionDetails) => {
        const { navigation } = this.props;

        navigation.navigate('DirectMessage', {
            connectionDetails,
        });
    };

    handleRefresh = () => {
        console.log('refresh');
    }

    render() {
        const { navigation, user, userConnections } = this.props;
        const connections = userConnections?.connections || [];

        return (
            <>
                <BaseStatusBar />
                <SafeAreaView style={styles.safeAreaView}>
                    <FlatList
                        data={connections}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item: connection }) => (
                            <ConnectionItem
                                key={connection.id}
                                connectionDetails={connection}
                                getConnectionSubtitle={this.getConnectionSubtitle}
                                onConnectionPress={this.onConnectionPress}
                            />
                        )}
                        ListEmptyComponent={() => (
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionDescription}>
                                    {this.translate(
                                        'components.contactsSearch.noContactsFound'
                                    )}
                                </Text>
                            </View>
                        )}
                        ListHeaderComponent={() => (
                            <MessagesContactsTabs
                                tabName="Contacts"
                                navigation={navigation}
                                translate={this.translate}
                            />
                        )}
                        stickyHeaderIndices={[0]}
                        // onContentSizeChange={() => connections.length && flatListRef.scrollToOffset({ animated: true, offset: 0 })}
                    />
                </SafeAreaView>
                <CreateConnectionButton navigation={navigation} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);
