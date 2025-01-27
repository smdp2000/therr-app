import React from 'react';
import axios from 'axios';
import qs from 'qs';
import {
    DeviceEventEmitter,
    Linking,
    PermissionsAndroid,
    Platform,
} from 'react-native';
import LocationServicesDialogBox  from 'react-native-android-location-services-dialog-box';
import { checkMultiple, PERMISSIONS } from 'react-native-permissions';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';
import LogRocket from '@logrocket/react-native';
import SplashScreen from 'react-native-bootsplash';
import notifee, { Event, EventType } from '@notifee/react-native';
import { UsersService } from 'therr-react/services';
import { AccessCheckType, IForumsState, INotificationsState, IUserState } from 'therr-react/types';
import { ContentActions, ForumActions, NotificationActions } from 'therr-react/redux/actions';
import { AccessLevels } from 'therr-js-utilities/constants';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import { sendForegroundNotification, wrapOnMessageReceived } from '../utilities/pushNotifications';
import routes from '../routes';
import { buildNavTheme } from '../styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import HeaderMenuRight from './HeaderMenuRight';
import LocationActions from '../redux/actions/LocationActions';
import UsersActions from '../redux/actions/UsersActions';
import { ILocationState } from '../types/redux/location';
import HeaderMenuLeft from './HeaderMenuLeft';
import translator from '../services/translator';
import { buildStyles } from '../styles';
import { buildStyles as buildButtonStyles } from '../styles/buttons';
import { buildStyles as buildFormStyles } from '../styles/forms';
import { buildStyles as buildModalStyles } from '../styles/modal/infoModal';
import { buildStyles as buildMenuStyles } from '../styles/modal/headerMenuModal';
import { navigationRef, RootNavigation } from './RootNavigation';
import PlatformNativeEventEmitter from '../PlatformNativeEventEmitter';
import HeaderTherrLogo from './HeaderTherrLogo';
import HeaderSearchInput from './Input/HeaderSearchInput';
import HeaderLinkRight from './HeaderLinkRight';
import { AndroidChannelIds, PressActionIds, getAndroidChannel } from '../constants';
import { socketIO } from '../socket-io-middleware';

const Stack = createStackNavigator();

const forFade = ({ current }) => ({
    cardStyle: {
        opacity: current.progress,
    },
});

interface ILayoutDispatchProps {
    getMyAchievements: Function;
    logout: Function;
    addNotification: Function;
    searchActiveMomentsByIds: Function;
    searchActiveSpacesByIds: Function;
    searchCategories: Function;
    searchNotifications: Function;
    updateGpsStatus: Function;
    updateLocationPermissions: Function;
    updateUser: Function;
}

interface IStoreProps extends ILayoutDispatchProps {
    forums: IForumsState;
    location: ILocationState;
    notifications: INotificationsState;
    user: IUserState;
}

// Regular component props
export interface ILayoutProps extends IStoreProps {}

interface ILayoutState {
    targetRouteView: string;
}

const mapStateToProps = (state: any) => ({
    forums: state.forums,
    location: state.location,
    notifications: state.notifications,
    user: state.user,
});

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            getMyAchievements: UsersActions.getMyAchievements,
            logout: UsersActions.logout,
            addNotification: NotificationActions.add,
            searchNotifications: NotificationActions.search,
            searchActiveMomentsByIds: ContentActions.searchActiveMomentsByIds,
            searchActiveSpacesByIds: ContentActions.searchActiveSpacesByIds,
            searchCategories: ForumActions.searchCategories,
            updateGpsStatus: LocationActions.updateGpsStatus,
            updateLocationPermissions: LocationActions.updateLocationPermissions,
            updateUser: UsersActions.update,
        },
        dispatch
    );

class Layout extends React.Component<ILayoutProps, ILayoutState> {
    private authCredentialListener;
    private nativeEventListener;
    private translate;
    private unsubscribePushNotifications;
    private urlEventListener;
    private routeNameRef: any = {};
    private theme = buildStyles();
    private themeButtons = buildButtonStyles();
    private themeForms = buildFormStyles();
    private themeModal = buildModalStyles();
    private themeMenu = buildMenuStyles();

    constructor(props) {
        super(props);

        this.state = {
            targetRouteView: '',
        };

        this.reloadTheme();
        this.translate = (key: string, params: any) =>
            translator(props?.user?.settings?.locale || 'en-us', key, params);
    }

    componentDidMount() {
        // (Notifee) Push Notification Click Handlers
        this.handleNotifeeBackgroundNotificationEvent();
        this.handleNotifeeForegroundNotificationEvent();

        if (Platform.OS === 'android') {
            Linking.getInitialURL().then(this.handleAppUniversalLinkURL);
        }
        // (Firebase) Push Notifications Click Handler
        this.nativeEventListener = PlatformNativeEventEmitter?.addListener('new-intent-action', this.handleFirebasePushNotificationEvent);
        // Universal links handler
        this.urlEventListener = Linking.addEventListener('url', this.handleUrlEvent);

        if (appleAuth.isSupported) {
            this.authCredentialListener = appleAuth.onCredentialRevoked(async () => {
                console.warn('Apple credential revoked');
                this.props.logout();
            });
        }

        DeviceEventEmitter.addListener('locationProviderStatusChange', (status) => { // only trigger when "providerListener" is enabled
            this.props.updateGpsStatus(status);
        });

        this.prefetchContent();
    }

    componentDidUpdate(prevProps: ILayoutProps) {
        const { targetRouteView } = this.state;
        const {
            forums,
            addNotification,
            location,
            searchCategories,
            searchActiveMomentsByIds,
            searchActiveSpacesByIds,
            updateLocationPermissions,
            user,
            updateUser,
        } = this.props;

        if (prevProps.user?.settings?.mobileThemeName !== user?.settings?.mobileThemeName) {
            this.reloadTheme(true);
        }

        if (user?.isAuthenticated !== prevProps.user?.isAuthenticated) {
            if (user.isAuthenticated) { // Happens after login
                if (user.details?.id) {
                    crashlytics().setUserId(user.details?.id?.toString());
                    if (!__DEV__) {
                        LogRocket.identify(user.details?.id, {
                            name: `${user.details?.firstName} ${user.details?.lastName}`,
                            email: user.details?.email,

                            // Add your own custom user variables here, ie:
                        });
                    }
                }

                if (targetRouteView) {
                    RootNavigation.reset({
                        index: 0,
                        routes: [
                            { name: 'Areas' },
                            { name: targetRouteView },
                        ],
                    });
                }

                this.prefetchContent();

                if (!forums?.forumCategories || !forums.forumCategories.length) {
                    searchCategories({
                        itemsPerPage: 100,
                        pageNumber: 1,
                        order: 'desc',
                    }, {});
                }

                if (Platform.OS !== 'ios') {
                    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION)
                        .then((grantStatus) => {
                            updateLocationPermissions({
                                [PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION]: grantStatus,
                            });
                        });
                    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
                        .then((grantStatus) => {
                            updateLocationPermissions({
                                [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION]: grantStatus,
                            });
                        });
                    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
                        .then((grantStatus) => {
                            updateLocationPermissions({
                                [PermissionsAndroid.PERMISSIONS.CAMERA]: grantStatus,
                            });
                        });
                } else {
                    checkMultiple([PERMISSIONS.IOS.LOCATION_ALWAYS]).then((statuses) => {
                        updateLocationPermissions(statuses);
                    });
                }

                this.getIosNotificationPermissions()
                    .then(() => {
                        // return messaging().registerDeviceForRemoteMessages();
                        return Promise.resolve();
                    })
                    .then(() => {
                        // Get the token
                        return messaging().getToken();
                    })
                    .then((token) => {
                        axios.defaults.headers['x-user-device-token'] = token;
                        if (user.details.deviceMobileFirebaseToken !== token) {
                            updateUser(user.details.id, { deviceMobileFirebaseToken: token });
                        }
                        this.unsubscribePushNotifications = messaging().onMessage(async remoteMessage => {
                            await wrapOnMessageReceived(true, remoteMessage);

                            if (remoteMessage?.data?.areasActivated) {
                                const parsedAreasData = JSON.parse(remoteMessage.data.areasActivated);
                                const momentsData = parsedAreasData.filter(area => area.momentId);
                                const spacesData = parsedAreasData.filter(area => area.spaceId);
                                if (parsedAreasData.length) {
                                    sendForegroundNotification({
                                        title: this.translate('alertTitles.newAreasActivated'),
                                        body: this.translate('alertMessages.newAreasActivated', {
                                            total: momentsData.length + spacesData.length,
                                        }),
                                        android: {
                                            pressAction: { id: PressActionIds.discovered, launchActivity: 'default' },
                                        },
                                    }, getAndroidChannel(AndroidChannelIds.contentDiscovery, false));
                                    if (momentsData.length) {
                                        searchActiveMomentsByIds({
                                            userLatitude: location?.user?.latitude,
                                            userLongitude: location?.user?.longitude,
                                            withMedia: true,
                                            withUser: true,
                                            blockedUsers: user.details.blockedUsers,
                                            shouldHideMatureContent: user.details.shouldHideMatureContent,
                                        }, momentsData.map(moment => moment.momentId));
                                    }
                                    if (spacesData.length) {
                                        searchActiveSpacesByIds({
                                            userLatitude: location?.user?.latitude,
                                            userLongitude: location?.user?.longitude,
                                            withMedia: true,
                                            withUser: true,
                                            blockedUsers: user.details.blockedUsers,
                                            shouldHideMatureContent: user.details.shouldHideMatureContent,
                                        }, spacesData.map(space => space.spaceId));
                                    }
                                }
                                // TODO: Fetch associated media files
                                // TODO: Fetch adn call insertActiveMoments to "activate" moments on map and discovered
                            }
                            if (remoteMessage?.data?.notificationData) {
                                const parsedNotificationData = JSON.parse(remoteMessage.data.notificationData);
                                addNotification(parsedNotificationData);
                            }
                        });
                    })
                    .catch((err) => {
                        console.log('NOTIFICATIONS_ERROR', err);
                    });
            }
        }
    }

    componentWillUnmount() {
        this.nativeEventListener?.remove();
        this.urlEventListener?.remove();

        if (Platform.OS !== 'ios') {
            LocationServicesDialogBox.stopListener();
        }

        if (this.authCredentialListener) {
            this.authCredentialListener();
        }

        this.unsubscribePushNotifications && this.unsubscribePushNotifications();
    }

    reloadTheme = (shouldForceUpdate: boolean = false) => {
        const themeName = this.props?.user?.settings?.mobileThemeName;
        this.theme = buildStyles(themeName);
        this.themeButtons = buildButtonStyles(themeName);
        this.themeForms = buildFormStyles(themeName);
        this.themeMenu = buildMenuStyles(themeName);
        this.themeModal = buildModalStyles(themeName);
        if (shouldForceUpdate) {
            this.forceUpdate();
        }
    };

    prefetchContent = () => {
        const {
            getMyAchievements,
            searchNotifications,
            user,
        } = this.props;
        if (user.isAuthenticated) {
            // Pre-load achievements
            getMyAchievements();

            // Pre-load notifications
            searchNotifications({
                filterBy: 'userId',
                query: user.details.id,
                itemsPerPage: 20,
                pageNumber: 1,
                order: 'desc',
            });
        }
    };

    handleFirebasePushNotificationEvent = (data: false | { action: string }) => {
        const { user } = this.props;
        const isNotAuthorized = UsersService.isAuthorized(
            {
                type: AccessCheckType.NONE,
                levels: [AccessLevels.DEFAULT, AccessLevels.EMAIL_VERIFIED, AccessLevels.EMAIL_VERIFIED_MISSING_PROPERTIES],
                isPublic: true,
            },
            user
        );

        let targetRouteView = '';
        if (data && !Array.isArray(data) && typeof(data) === 'object') {
            if (data.action === 'app.therrmobile.ACHIEVEMENT_COMPLETED'
                || data.action === 'app.therrmobile.UNCLAIMED_ACHIEVEMENTS_REMINDER') {
                targetRouteView = 'Achievements';
            } else if (data.action === 'app.therrmobile.NEW_CONNECTION') {
                targetRouteView = 'Contacts';
            } else if (data.action === 'app.therrmobile.CREATE_A_MOMENT_REMINDER') {
                targetRouteView = 'Map';
            } else if (data.action === 'app.therrmobile.LATEST_POST_LIKES_STATS'
                || data.action === 'app.therrmobile.LATEST_POST_VIEWCOUNT_STATS') {
                targetRouteView = 'ViewUser';
            } else if (data.action === 'app.therrmobile.NEW_CONNECTION_REQUEST'
                || data.action === 'app.therrmobile.UNREAD_NOTIFICATIONS_REMINDER'
                || data.action === 'app.therrmobile.NEW_SUPER_LIKE_RECEIVED'
                || data.action === 'app.therrmobile.NEW_LIKE_RECEIVED') {
                targetRouteView = 'Notifications';
            } else if (data.action === 'app.therrmobile.NEW_DIRECT_MESSAGE') {
                targetRouteView = 'Contacts';
            }
        }

        if (isNotAuthorized) {
            this.setState({
                targetRouteView,
            });
            RootNavigation.navigate('Login');
        } else {
            // TODO: Find a way to get data from the push notification that was selected
            // Otherwise the best alternative is to link to a generic, associated view
            if (targetRouteView) {
                RootNavigation.navigate(targetRouteView);
            }
        }
    };

    /**
     * Abstract handler for all/most notifee push notification interactions
     */
    handleNotifeeNotificationEvent = (event: Event, isInForeground: boolean): Promise<any> => {
        const { type, detail } = event;
        const { notification, pressAction } = detail;

        if (type === EventType.ACTION_PRESS || type === EventType.PRESS) {
            if (notification?.id && pressAction?.id === PressActionIds.markAsRead) {
                // Remove the notification
                return notifee.cancelNotification(notification?.id);
            }

            const { user } = this.props;
            const isUserAuthorized = UsersService.isAuthorized(
                {
                    type: AccessCheckType.ALL,
                    levels: [AccessLevels.EMAIL_VERIFIED],
                },
                user
            );

            if (notification?.id && pressAction?.id === PressActionIds.exchange) {
                if (isUserAuthorized) {
                    RootNavigation.navigate('ExchangePointsDisclaimer');
                }
                return Promise.resolve();
            }

            if (notification?.id && pressAction?.id === PressActionIds.drafts) {
                if (isUserAuthorized) {
                    RootNavigation.navigate('MyDrafts');
                }
                return Promise.resolve();
            }

            if (notification?.id && pressAction?.id === PressActionIds.discovered) {
                if (isUserAuthorized) {
                    RootNavigation.navigate('Areas');
                }
                return Promise.resolve();
            }

            if (notification?.id && pressAction?.id === PressActionIds.discovered) {
                return Promise.resolve();
            }
        }

        if (type === EventType.DISMISSED) {
            return Promise.resolve();
        }

        if (isInForeground) {}

        return Promise.resolve();
    };

    handleNotifeeBackgroundNotificationEvent = () => {
        return notifee.onBackgroundEvent((event) => this.handleNotifeeNotificationEvent(event, false));
    };

    handleNotifeeForegroundNotificationEvent = () => {
        return notifee.onForegroundEvent((event) => this.handleNotifeeNotificationEvent(event, true));
    };

    /**
     * Notifee Push Notification caused app to open
     */
    handleOpenByNotifeeNotification = () => notifee.getInitialNotification()
        .then((initialNotification) => {
            if (initialNotification) {
                const event = {
                    type: EventType.PRESS,
                    detail: {
                        notification: initialNotification.notification,
                        pressAction: initialNotification.pressAction,
                    },
                };
                this.handleNotifeeNotificationEvent(event, false);
            }
        }).catch((err) => {
            console.log(err);
        });

    handleUrlEvent = (event) => {
        this.handleAppUniversalLinkURL(event.url);
    };

    /**
     * Firebase Push Notification caused app to open
     */
    handleAppUniversalLinkURL = (url) => {
        const { user } = this.props;
        const urlSplit = url?.split('?') || [];
        const viewMomentRegex = RegExp('moments/[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}/view', 'i');
        const viewSpaceRegex = RegExp('spaces/[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}/view', 'i');

        // Route for 3rd party OAuth (Facebook, Instagram, etc.)
        if (url?.includes('https://therr.com/?access_token=')) {
            const urlWithNoHash = url.split('#_');
            const cleanUrl = urlWithNoHash[0] || url;
            const queryStringSplit = cleanUrl.split('?');
            let authResult = {};
            if (!queryStringSplit[1]) {
                authResult = { error: 'missing-query-params' };
            } else {
                authResult = qs.parse(queryStringSplit[1]);
            }
            RootNavigation.replace('SocialSync', {
                authResult,
            });
        } else if (url?.includes('verify-account')) {
            if (urlSplit[1] && urlSplit[1].includes('token=')) {
                const verificationToken = urlSplit[1]?.split('token=')[1];
                // TODO: Test this (seems like the boolean is backwards)
                const isNotAuthorized = UsersService.isAuthorized(
                    {
                        type: AccessCheckType.NONE,
                        levels: [AccessLevels.DEFAULT, AccessLevels.EMAIL_VERIFIED, AccessLevels.EMAIL_VERIFIED_MISSING_PROPERTIES],
                        isPublic: true,
                    },
                    user
                );
                if (isNotAuthorized) {
                    RootNavigation.navigate('EmailVerification', {
                        verificationToken,
                    });
                }
            }
        } else if (url?.match(viewMomentRegex)) {
            // TODO: Link to view moment
        } else if (url?.match(viewSpaceRegex)) {
            // TODO: Link to view space
        } else if (Platform.OS !== 'ios') {
            // IOS will use the notifee foreground listener instead
            this.handleOpenByNotifeeNotification();
        }
    };

    getCurrentScreen = (navigation) => {
        const navState = navigation.getState();

        return (
            navState.routes[navState.routes.length - 1] &&
            navState.routes[navState.routes.length - 1].name
        );
    };

    getIosNotificationPermissions = () => {
        // TODO: Determine if 2nd then is even necessary
        return notifee.requestPermission()
            .then((permissions) => {
                if (permissions?.authorizationStatus !== 1) {
                    console.log('Notifee authorization status:', permissions);
                }
                return messaging().requestPermission();
            })
            .then((authStatus) => {
                const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED
                    || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
                if (!enabled) {
                    console.log('Notifications authorization status:', authStatus);
                }
            });
    };

    shouldShowTopRightMenu = () => {
        return UsersService.isAuthorized(
            {
                type: AccessCheckType.ALL,
                levels: [],
            },
            this.props.user
        );
    };

    isUserEmailVerified = () => {
        return UsersService.isAuthorized(
            {
                type: AccessCheckType.ALL,
                levels: [AccessLevels.EMAIL_VERIFIED],
            },
            this.props.user
        );
    };

    logout = async (userDetails) => {
        const { logout } = this.props;

        this.unsubscribePushNotifications && this.unsubscribePushNotifications();
        socketIO.disconnect();

        return logout(userDetails);
    };

    render() {
        const { location, notifications, updateGpsStatus, user } = this.props;

        return (
            <NavigationContainer
                theme={buildNavTheme(this.theme)}
                ref={navigationRef}
                onReady={() => {
                    this.routeNameRef.current = navigationRef?.getCurrentRoute()?.name;
                    SplashScreen.hide({ fade: true });
                }}
                onStateChange={async () => {
                    const previousRouteName = this.routeNameRef.current;
                    const currentRouteName = navigationRef?.getCurrentRoute()?.name;

                    if (previousRouteName !== currentRouteName) {
                        await analytics().logScreenView({
                            screen_name: currentRouteName,
                            screen_class: currentRouteName,
                        });
                    }
                    this.routeNameRef.current = currentRouteName;
                }}
            >
                <Stack.Navigator
                    screenOptions={({ navigation }) => {
                        const themeName = this.props?.user?.settings?.mobileThemeName;
                        const currentScreen = this.getCurrentScreen(navigation);
                        const isAreas = currentScreen === 'Areas';
                        const isMoment = currentScreen === 'ViewMoment' || currentScreen === 'EditMoment';
                        const isMap = currentScreen === 'Map';
                        const hasLogoHeaderTitle = currentScreen === 'Login'
                            || currentScreen === 'Landing'
                            || currentScreen === 'Home'
                            || currentScreen === 'ForgotPassword'
                            || currentScreen === 'Nearby'
                            || currentScreen === 'EmailVerification'
                            || currentScreen === 'Register';
                        const isAccentPage = currentScreen === 'EditMoment'
                            || currentScreen === 'EditSpace'
                            || currentScreen === 'ViewMoment'
                            || currentScreen === 'ViewSpace';
                        let headerTitle;
                        let headerStyle = this.theme.styles.headerStyle;
                        let headerStyleName: any = 'light';
                        let headerTitleColor = themeName === 'light'
                            ? this.theme.colors.primary3
                            : this.theme.colors.textWhite;
                        if (isMoment) {
                            headerStyleName = 'accent';
                            headerTitleColor = this.theme.colors.accentLogo;
                        }
                        if (isAccentPage) {
                            headerStyle = this.theme.styles.headerStyleAccent;
                        }
                        if (hasLogoHeaderTitle) {
                            headerTitle = () => <HeaderTherrLogo navigation={navigation} theme={this.theme} />;
                        }
                        if (isAreas) {
                            headerTitle = () => <HeaderSearchInput
                                isAdvancedSearch
                                navigation={navigation}
                                theme={this.theme}
                                themeForms={this.themeForms}
                            />;
                        }
                        if (isMap) {
                            headerTitle = () => <HeaderSearchInput
                                navigation={navigation}
                                theme={this.theme}
                                themeForms={this.themeForms}
                            />;
                        }

                        return ({
                            animationEnabled: true,
                            cardStyleInterpolator: forFade,
                            headerLeft: () => <HeaderMenuLeft
                                styleName={headerStyleName}
                                navigation={navigation}
                                isAuthenticated={user.isAuthenticated}
                                isEmailVerifed={this.isUserEmailVerified()}
                                theme={this.theme}
                            />,
                            headerRight: () => this.shouldShowTopRightMenu() ?
                                <HeaderMenuRight
                                    navigation={navigation}
                                    notifications={notifications}
                                    styleName={headerStyleName}
                                    isEmailVerifed={this.isUserEmailVerified()}
                                    isVisible={this.shouldShowTopRightMenu()}
                                    location={location}
                                    logout={this.logout}
                                    updateGpsStatus={updateGpsStatus}
                                    user={user}
                                    theme={this.theme}
                                    themeButtons={this.themeButtons}
                                    themeModal={this.themeModal}
                                    themeMenu={this.themeMenu}
                                /> :
                                <HeaderLinkRight
                                    navigation={navigation}
                                    themeForms={this.themeForms}
                                    styleName={headerStyleName}
                                />,
                            headerTitleStyle: {
                                ...this.theme.styles.headerTitleStyle,
                                color: headerTitleColor,
                                textShadowOffset: { width: 0, height: 0 },
                                textShadowRadius: 0,
                            },
                            headerTitleAlign: 'center',
                            headerStyle,
                            headerTransparent: false,
                            headerBackVisible: false,
                            headerBackTitleVisible: false,
                            headerTitle,
                        });
                    }}
                >
                    {routes
                        .filter((route: any) => {
                            if (
                                !(
                                    route.options &&
                                    typeof route.options === 'function' &&
                                    route.options().access
                                )
                            ) {
                                return true;
                            }

                            if (route.name === 'Landing' && user?.details?.id) {
                                return false;
                            }

                            const isAuthorized = UsersService.isAuthorized(
                                route.options().access,
                                user
                            );

                            delete route.options.access;

                            return isAuthorized;
                        })
                        .map((route: any) => {
                            route.name = this.translate(route.name);
                            return <Stack.Screen key={route.name} {...route} />;
                        })}
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
