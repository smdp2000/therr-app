import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IUserState } from 'therr-react/types';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import MainButtonMenu from '../../components/ButtonMenu/MainButtonMenu';
import UsersActions from '../../redux/actions/UsersActions';
import translator from '../../services/translator';
import { buildStyles } from '../../styles';
import { buildStyles as buildMenuStyles } from '../../styles/navigation/buttonMenu';
import { buildStyles as buildAchievementStyles } from '../../styles/achievements';
import BaseStatusBar from '../../components/BaseStatusBar';
import AchievementTile from './AchievementTile';

interface IAchievementsDispatchProps {
    claimMyAchievement: Function;
    getMyAchievements: Function;
    updateUser: Function;
}

interface IStoreProps extends IAchievementsDispatchProps {
    user: IUserState;
}

// Regular component props
export interface IAchievementsProps extends IStoreProps {
    navigation: any;
}

interface IAchievementsState {
    isRefreshing: boolean;
}

const mapStateToProps = (state) => ({
    user: state.user,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({
    claimMyAchievement: UsersActions.claimMyAchievement,
    getMyAchievements: UsersActions.getMyAchievements,
    updateUser: UsersActions.update,
}, dispatch);

export class Achievements extends React.Component<IAchievementsProps, IAchievementsState> {
    private scrollViewRef;
    private translate: Function;
    private theme = buildStyles();
    private themeMenu = buildMenuStyles();
    private themeAchievements = buildAchievementStyles();

    constructor(props) {
        super(props);

        this.state = {
            isRefreshing: false,
        };

        this.themeMenu = buildMenuStyles(props.user.settings?.mobileThemeName);
        this.themeAchievements = buildAchievementStyles(props.user.settings?.mobileThemeName);
        this.translate = (key: string, params: any) =>
            translator('en-us', key, params);
    }

    componentDidMount = () => {
        this.props.navigation.setOptions({
            title: this.translate('pages.achievements.headerTitle'),
        });

        this.handleRefresh();
    }

    handleRefresh = () => {
        this.props.getMyAchievements().finally(() => {
            this.setState({
                isRefreshing: false,
            });
        });
    }

    handleClaim = (id: string, points: number) => {
        const { claimMyAchievement } = this.props;

        claimMyAchievement(id, points);
    }

    render() {
        const { navigation, user } = this.props;
        const { isRefreshing } = this.state;
        // const pageHeaderAchievements = this.translate('pages.achievements.pageHeader');
        const userAchievements = Object.values(user.achievements || {});

        return (
            <>
                <BaseStatusBar therrThemeName={this.props.user.settings?.mobileThemeName} />
                <SafeAreaView  style={[this.theme.styles.safeAreaView, { backgroundColor: this.theme.colors.backgroundGray }]}>
                    <View style={[this.theme.styles.body, { backgroundColor: this.theme.colors.backgroundGray }]}>
                        {/* <View style={this.theme.styles.sectionContainer}>
                            <Text style={this.theme.styles.sectionTitle}>
                                {pageHeaderAchievements}
                            </Text>
                        </View> */}
                        <View style={this.theme.styles.sectionContainer}>
                            <FlatList
                                data={userAchievements}
                                keyExtractor={(item) => String(item.id)}
                                renderItem={({ item }) => <AchievementTile
                                    claimText={this.translate('pages.achievements.info.claimRewards')}
                                    completedText={this.translate('pages.achievements.info.completed')}
                                    handleClaim={() => this.handleClaim(item.id, item.unclaimedRewardPts)}
                                    themeAchievements={this.themeAchievements}
                                    userAchievement={item}
                                />}
                                refreshControl={<RefreshControl
                                    refreshing={isRefreshing}
                                    onRefresh={this.handleRefresh}
                                />}
                                ListEmptyComponent={() => (
                                    <View style={this.theme.styles.sectionContainer}>
                                        <Text style={this.theme.styles.sectionDescriptionCentered}>
                                            {this.translate(
                                                'pages.achievements.info.noAchievementsFound'
                                            )}
                                        </Text>
                                    </View>
                                )}
                                // stickyHeaderIndices={[0]}
                                // onContentSizeChange={() => connections.length && flatListRef.scrollToOffset({ animated: true, offset: 0 })}
                            />
                        </View>
                    </View>
                </SafeAreaView>
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

export default connect(mapStateToProps, mapDispatchToProps)(Achievements);
