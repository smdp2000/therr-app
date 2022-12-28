import React from 'react';
import { Dimensions, SafeAreaView, View } from 'react-native';
// import { Button } from 'react-native-elements';
import 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ContentActions } from 'therr-react/redux/actions';
import { IContentState, IMapState, IUserState, IUserConnectionsState } from 'therr-react/types';
import { TabBar, TabView } from 'react-native-tab-view';
import { buildStyles } from '../../styles';
import { buildStyles as buildAreaStyles } from '../../styles/user-content/areas';
import { buildStyles as buildButtonsStyles } from '../../styles/buttons';
import { buildStyles as buildLoaderStyles } from '../../styles/loaders';
import { buildStyles as buildMenuStyles } from '../../styles/navigation/buttonMenu';
import { buildStyles as buildReactionsModalStyles } from '../../styles/modal/areaReactionsModal';
// import { buttonMenuHeightCompact } from '../../styles/navigation/buttonMenu';
import translator from '../../services/translator';
import MainButtonMenu from '../../components/ButtonMenu/MainButtonMenu';
import BaseStatusBar from '../../components/BaseStatusBar';
import AreaOptionsModal, { ISelectionType } from '../../components/Modals/AreaOptionsModal';
import { getReactionUpdateArgs } from '../../utilities/reactions';
import LottieLoader, { ILottieId } from '../../components/LottieLoader';
import getActiveCarouselData from '../../utilities/getActiveCarouselData';
import { CAROUSEL_TABS } from '../../constants';
import { handleAreaReaction, loadMorePosts, navToViewArea } from './postViewHelpers';
import getDirections from '../../utilities/getDirections';
import { SELECT_ALL } from '../../utilities/categories';
import LazyPlaceholder from './components/LazyPlaceholder';
import AreaCarousel from './AreaCarousel';
import { Text } from 'react-native-elements';

const { width: viewportWidth } = Dimensions.get('window');

const defaultActiveTab = CAROUSEL_TABS.SOCIAL;

function getRandomLoaderId(): ILottieId {
    const options: ILottieId[] = ['donut', 'earth', 'taco', 'shopping', 'happy-swing', 'karaoke', 'yellow-car', 'zeppelin', 'therr-black-rolling'];
    const selected = Math.floor(Math.random() * options.length);
    return options[selected] as ILottieId;
}

interface IAreasDispatchProps {
    searchActiveMoments: Function;
    updateActiveMoments: Function;
    createOrUpdateMomentReaction: Function;

    searchActiveSpaces: Function;
    updateActiveSpaces: Function;
    createOrUpdateSpaceReaction: Function;

    searchActiveThoughts: Function;
    updateActiveThoughts: Function;
    createOrUpdateThoughtReaction: Function;

    logout: Function;
}

interface IStoreProps extends IAreasDispatchProps {
    content: IContentState;
    map: IMapState;
    user: IUserState;
    userConnections: IUserConnectionsState;
}

// Regular component props
export interface IAreasProps extends IStoreProps {
    navigation: any;
}

interface IAreasState {
    activeTabIndex: number;
    isLoading: boolean;
    areAreaOptionsVisible: boolean;
    selectedArea: any;
    tabRoutes: { key: string; title: string }[]
}

const mapStateToProps = (state: any) => ({
    content: state.content,
    map: state.map,
    user: state.user,
    userConnections: state.userConnections,
});

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            searchActiveMoments: ContentActions.searchActiveMoments,
            updateActiveMoments: ContentActions.updateActiveMoments,
            createOrUpdateMomentReaction: ContentActions.createOrUpdateMomentReaction,

            searchActiveSpaces: ContentActions.searchActiveSpaces,
            updateActiveSpaces: ContentActions.updateActiveSpaces,
            createOrUpdateSpaceReaction: ContentActions.createOrUpdateSpaceReaction,

            searchActiveThoughts: ContentActions.searchActiveThoughts,
            updateActiveThoughts: ContentActions.updateActiveThoughts,
            createOrUpdateThoughtReaction: ContentActions.createOrUpdateThoughtReaction,
        },
        dispatch
    );

class Areas extends React.Component<IAreasProps, IAreasState> {
    private carouselSocialRef;
    private carouselEventsRef;
    private carouselNewsRef;
    private translate: Function;
    private loaderId: ILottieId;
    private loadTimeoutId: any;
    private theme = buildStyles();
    private themeAreas = buildAreaStyles();
    private themeButtons = buildButtonsStyles();
    private themeLoader = buildLoaderStyles();
    private themeMenu = buildMenuStyles();
    private themeReactionsModal = buildReactionsModalStyles();

    constructor(props) {
        super(props);

        this.translate = (key: string, params: any) =>
            translator('en-us', key, params);

        this.state = {
            activeTabIndex: 0,
            isLoading: true,
            areAreaOptionsVisible: false,
            selectedArea: {},
            tabRoutes: [
                { key: CAROUSEL_TABS.SOCIAL, title: this.translate('menus.headerTabs.social') },
                { key: CAROUSEL_TABS.EVENTS, title: this.translate('menus.headerTabs.events') },
                { key: CAROUSEL_TABS.NEWS, title: this.translate('menus.headerTabs.news') },
            ],
        };

        this.theme = buildStyles(props.user.settings?.mobileThemeName);
        this.themeAreas = buildAreaStyles(props.user.settings?.mobileThemeName);
        this.themeButtons = buildButtonsStyles(props.user.settings?.mobileThemeName);
        this.themeLoader = buildLoaderStyles(props.user.settings?.mobileThemeName);
        this.themeMenu = buildMenuStyles(props.user.settings?.mobileThemeName);
        this.themeReactionsModal = buildReactionsModalStyles(props.user.settings?.mobileThemeName);
        this.loaderId = getRandomLoaderId();
    }

    componentDidMount() {
        const { content, navigation } = this.props;

        navigation.setOptions({
            title: this.translate('pages.myDrafts.headerTitle'),
        });

        const activeData = getActiveCarouselData({
            activeTab: defaultActiveTab,
            content,
            isForBookmarks: false,
            shouldIncludeThoughts: true,
        }, 'createdAt');
        if (!activeData?.length || activeData.length < 21) {
            this.handleRefresh();
        } else {
            this.setState({
                isLoading: false,
            });
        }
    }

    componentWillUnmount() {
        clearTimeout(this.loadTimeoutId);
    }

    getEmptyListMessage = (activeTab) => {
        if (activeTab === CAROUSEL_TABS.SOCIAL) {
            return this.translate('pages.areas.noSocialAreasFound');
        }

        if (activeTab === CAROUSEL_TABS.NEWS) {
            return this.translate('pages.areas.noNewsAreasFound');
        }

        // CAROUSEL_TABS.EVENTS
        return this.translate('pages.areas.noEventsAreasFound');
    }

    goToMap = () => {
        const { navigation } = this.props;
        navigation.navigate('Map');
    }

    goToArea = (area) => {
        const { navigation, user } = this.props;

        navToViewArea(area, user, navigation.navigate);
    };

    goToViewMap = (lat, long) => {
        const { navigation } = this.props;

        navigation.replace('Map', {
            latitude: lat,
            longitude: long,
        });
    }

    goToViewUser = (userId) => {
        const { navigation } = this.props;

        navigation.navigate('ViewUser', {
            userInView: {
                id: userId,
            },
        });
    }

    handleRefresh = () => {
        const { content, updateActiveMoments, updateActiveSpaces, updateActiveThoughts, user } = this.props;
        this.setState({ isLoading: true });

        const activeMomentsPromise = updateActiveMoments({
            withMedia: true,
            withUser: true,
            offset: 0,
            ...content.activeAreasFilters,
            blockedUsers: user.details.blockedUsers,
            shouldHideMatureContent: user.details.shouldHideMatureContent,
        });

        const activeSpacesPromise = updateActiveSpaces({
            withMedia: true,
            withUser: true,
            offset: 0,
            ...content.activeAreasFilters,
            blockedUsers: user.details.blockedUsers,
            shouldHideMatureContent: user.details.shouldHideMatureContent,
        });

        const activeThoughtsPromise = updateActiveThoughts({
            withUser: true,
            offset: 0,
            // ...content.activeAreasFilters,
            blockedUsers: user.details.blockedUsers,
            shouldHideMatureContent: user.details.shouldHideMatureContent,
        });

        return Promise.all([activeMomentsPromise, activeSpacesPromise, activeThoughtsPromise]).finally(() => {
            this.loadTimeoutId = setTimeout(() => {
                this.setState({ isLoading: false });
            }, 400);
        });
    }

    tryLoadMore = () => {
        const { content, searchActiveMoments, searchActiveSpaces, searchActiveThoughts, user } = this.props;

        loadMorePosts({
            content,
            user,
            searchActiveMoments,
            searchActiveSpaces,
            searchActiveThoughts,
        });
    }

    onAreaOptionSelect = (type: ISelectionType) => {
        const { selectedArea } = this.state;
        const { createOrUpdateSpaceReaction, createOrUpdateMomentReaction, user } = this.props;

        if (type === 'getDirections') {
            getDirections({
                latitude: selectedArea.latitude,
                longitude: selectedArea.longitude,
                title: selectedArea.notificationMsg,
            });
        } else {
            handleAreaReaction(selectedArea, type, {
                user,
                getReactionUpdateArgs,
                createOrUpdateMomentReaction,
                createOrUpdateSpaceReaction,
                toggleAreaOptions: this.toggleAreaOptions,
            });
        }
    }

    onTabSelect = (index: number) => {
        this.setState({
            activeTabIndex: index,
        });
    }

    scrollTop = () => {
        const { activeTabIndex } = this.state;
        switch (Object.values(CAROUSEL_TABS)[activeTabIndex]) {
            case CAROUSEL_TABS.SOCIAL:
                this.carouselSocialRef?.scrollToOffset({ animated: true, offset: 0 });
                break;
            case CAROUSEL_TABS.EVENTS:
                this.carouselEventsRef?.scrollToOffset({ animated: true, offset: 0 });
                break;
            case CAROUSEL_TABS.NEWS:
                this.carouselNewsRef?.scrollToOffset({ animated: true, offset: 0 });
                break;
            default:
                break;
        }
    }

    toggleAreaOptions = (area) => {
        const { areAreaOptionsVisible } = this.state;
        this.setState({
            areAreaOptionsVisible: !areAreaOptionsVisible,
            selectedArea: areAreaOptionsVisible ? {} : area,
        });
    }

    renderTabBar = props => {
        return (
            <TabBar
                {...props}
                indicatorStyle={this.themeMenu.styles.tabFocusedIndicator}
                style={this.themeMenu.styles.tabBar}
                renderLabel={this.renderTabLabel}
            />
        );
    };

    renderTabLabel = ({ route, focused }) => {
        return (
            <Text style={focused ? this.themeMenu.styles.tabTextFocused : this.themeMenu.styles.tabText}>
                {route.title}
            </Text>
        );
    }

    renderSceneMap = ({ route }) => {
        const { isLoading } = this.state;
        const {
            content,
            map,
            createOrUpdateMomentReaction,
            createOrUpdateSpaceReaction,
            createOrUpdateThoughtReaction,
            user,
        } = this.props;

        // TODO: Fetch missing media
        const fetchMedia = () => {};

        switch (route.key) {
            case CAROUSEL_TABS.SOCIAL:
                const categoriesFilter = (map.filtersCategory?.length && map.filtersCategory?.filter(c => c.isChecked).map(c => c.name)) || [SELECT_ALL];
                const socialData = isLoading ? [] : getActiveCarouselData({
                    activeTab: route.key,
                    content,
                    isForBookmarks: false,
                    shouldIncludeThoughts: true,
                }, 'createdAt', categoriesFilter);

                return (
                    <AreaCarousel
                        activeData={socialData}
                        content={content}
                        inspectArea={this.goToArea}
                        isLoading={isLoading}
                        fetchMedia={fetchMedia}
                        goToViewMap={this.goToViewMap}
                        goToViewUser={this.goToViewUser}
                        toggleAreaOptions={this.toggleAreaOptions}
                        translate={this.translate}
                        containerRef={(component) => { this.carouselSocialRef = component; }}
                        handleRefresh={this.handleRefresh}
                        onEndReached={this.tryLoadMore}
                        updateMomentReaction={createOrUpdateMomentReaction}
                        updateSpaceReaction={createOrUpdateSpaceReaction}
                        updateThoughtReaction={createOrUpdateThoughtReaction}
                        emptyListMessage={this.getEmptyListMessage(CAROUSEL_TABS.SOCIAL)}
                        renderHeader={() => null}
                        renderLoader={() => <LottieLoader id={this.loaderId} theme={this.themeLoader} />}
                        user={user}
                        rootStyles={this.theme.styles}
                        // viewportHeight={viewportHeight}
                        // viewportWidth={viewportWidth}
                    />
                );
            case CAROUSEL_TABS.EVENTS:
                const eventsData = [];
                return (
                    (<AreaCarousel
                        activeData={eventsData}
                        content={content}
                        inspectArea={this.goToArea}
                        isLoading={isLoading}
                        fetchMedia={fetchMedia}
                        goToViewMap={this.goToViewMap}
                        goToViewUser={this.goToViewUser}
                        toggleAreaOptions={this.toggleAreaOptions}
                        translate={this.translate}
                        containerRef={(component) => { this.carouselEventsRef = component; }}
                        handleRefresh={this.handleRefresh}
                        onEndReached={this.tryLoadMore}
                        updateMomentReaction={createOrUpdateMomentReaction}
                        updateSpaceReaction={createOrUpdateSpaceReaction}
                        emptyListMessage={this.getEmptyListMessage(CAROUSEL_TABS.EVENTS)}
                        renderHeader={() => null}
                        renderLoader={() => <LottieLoader id={this.loaderId} theme={this.themeLoader} />}
                        user={user}
                        rootStyles={this.theme.styles}
                        // viewportHeight={viewportHeight}
                        // viewportWidth={viewportWidth}
                    />)
                );
            case CAROUSEL_TABS.NEWS:
                const newsData = [];
                return (
                    <AreaCarousel
                        activeData={newsData}
                        content={content}
                        inspectArea={this.goToArea}
                        isLoading={isLoading}
                        fetchMedia={fetchMedia}
                        goToViewMap={this.goToViewMap}
                        goToViewUser={this.goToViewUser}
                        toggleAreaOptions={this.toggleAreaOptions}
                        translate={this.translate}
                        containerRef={(component) => { this.carouselNewsRef = component; }}
                        handleRefresh={this.handleRefresh}
                        onEndReached={this.tryLoadMore}
                        updateMomentReaction={createOrUpdateMomentReaction}
                        updateSpaceReaction={createOrUpdateSpaceReaction}
                        emptyListMessage={this.getEmptyListMessage(CAROUSEL_TABS.NEWS)}
                        renderHeader={() => null}
                        renderLoader={() => <LottieLoader id={this.loaderId} theme={this.themeLoader} />}
                        user={user}
                        rootStyles={this.theme.styles}
                        // viewportHeight={viewportHeight}
                        // viewportWidth={viewportWidth}
                    />
                );
        }
    }

    render() {
        const { activeTabIndex, areAreaOptionsVisible, selectedArea, tabRoutes } = this.state;
        const { navigation, user } = this.props;

        return (
            <>
                <BaseStatusBar therrThemeName={this.props.user.settings?.mobileThemeName}/>
                <SafeAreaView style={[this.theme.styles.safeAreaView, { backgroundColor: this.theme.colorVariations.backgroundNeutral }]}>
                    <TabView
                        lazy
                        lazyPreloadDistance={1}
                        navigationState={{
                            index: activeTabIndex,
                            routes: tabRoutes,
                        }}
                        renderTabBar={this.renderTabBar}
                        renderScene={this.renderSceneMap}
                        renderLazyPlaceholder={() => (
                            <View style={this.theme.styles.sectionContainer}>
                                <LazyPlaceholder />
                                <LazyPlaceholder />
                                <LazyPlaceholder />
                                <LazyPlaceholder />
                                <LazyPlaceholder />
                                <LazyPlaceholder />
                                <LazyPlaceholder />
                            </View>
                        )}
                        onIndexChange={this.onTabSelect}
                        initialLayout={{ width: viewportWidth }}
                        // style={styles.container}
                    />
                </SafeAreaView>
                <AreaOptionsModal
                    isVisible={areAreaOptionsVisible}
                    onRequestClose={() => this.toggleAreaOptions(selectedArea)}
                    translate={this.translate}
                    onSelect={this.onAreaOptionSelect}
                    themeButtons={this.themeButtons}
                    themeReactionsModal={this.themeReactionsModal}
                />
                {/* <MainButtonMenu navigation={navigation} onActionButtonPress={this.scrollTop} translate={this.translate} user={user} /> */}
                <MainButtonMenu
                    navigation={navigation}
                    onActionButtonPress={this.scrollTop}
                    translate={this.translate}
                    user={user}
                    themeMenu={this.themeMenu}
                />
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Areas);
