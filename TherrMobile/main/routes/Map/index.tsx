import React, { Ref } from 'react';
import { Dimensions, PermissionsAndroid, Keyboard, Platform, SafeAreaView, View } from 'react-native';
import { StackActions } from '@react-navigation/native';
import { PERMISSIONS } from 'react-native-permissions';
import MapView from 'react-native-map-clustering';
import { PROVIDER_GOOGLE, Circle, Marker } from 'react-native-maps';
// import { Button } from 'react-native-elements';
import AnimatedOverlay from 'react-native-modal-overlay';
// import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
// import OctIcon from 'react-native-vector-icons/Octicons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MapsService, UsersService, PushNotificationsService } from 'therr-react/services';
import { AccessCheckType, IMapState as IMapReduxState, IReactionsState, IUserState } from 'therr-react/types';
import { MapActions, ReactionActions, UserInterfaceActions } from 'therr-react/redux/actions';
import { AccessLevels } from 'therr-js-utilities/constants';
import Geolocation from '@react-native-community/geolocation';
import AnimatedLoader from 'react-native-animated-loader';
import { distanceTo, insideCircle } from 'geolocation-utils';
import * as ImagePicker from 'react-native-image-picker';
import { GOOGLE_APIS_ANDROID_KEY, GOOGLE_APIS_IOS_KEY } from 'react-native-dotenv';
// import MapActionButtons from './MapActionButtons';
import MapActionButtonsAlt from './MapActionButtonsAlt';
import Alert from '../../components/Alert';
// import MainButtonMenu from '../../components/ButtonMenu/MainButtonMenu';
import MainButtonMenuAlt from '../../components/ButtonMenu/MainButtonMenuAlt';
import { ILocationState } from '../../types/redux/location';
import LocationActions from '../../redux/actions/LocationActions';
import translator from '../../services/translator';
import {
    INITIAL_LATITUDE_DELTA,
    INITIAL_LONGITUDE_DELTA,
    PRIMARY_LATITUDE_DELTA,
    PRIMARY_LONGITUDE_DELTA,
    MIN_LOAD_TIMEOUT,
    DEFAULT_MOMENT_PROXIMITY,
    MIN_ZOOM_LEVEL,
    MOMENTS_REFRESH_THROTTLE_MS,
    LOCATION_PROCESSING_THROTTLE_MS,
} from '../../constants';
import * as therrTheme from '../../styles/themes';
import styles, { loaderStyles } from '../../styles';
import mapStyles from '../../styles/map';
import requestLocationServiceActivation from '../../utilities/requestLocationServiceActivation';
import {
    requestOSMapPermissions,
    requestOSCameraPermissions,
} from '../../utilities/requestOSPermissions';
import FiltersButtonGroup from '../../components/FiltersButtonGroup';
import BaseStatusBar from '../../components/BaseStatusBar';
import mapCustomStyle from '../../styles/map/googleCustom';
import SearchTypeAheadResults from '../../components/SearchTypeAheadResults';
import SearchThisAreaButtonGroup from '../../components/SearchThisAreaButtonGroup';
import CameraMarkerIcon from './CameraMarkerIcon';

const { height: viewPortHeight, width: viewportWidth } = Dimensions.get('window');
const earthLoader = require('../../assets/earth-loader.json');

const ANIMATE_TO_REGION_DURATION = 750;
const ANIMATE_TO_REGION_DURATION_SLOW = 1500;
const ANIMATE_TO_REGION_DURATION_FAST = 500;

interface IMapDispatchProps {
    captureClickTarget: Function;
    createOrUpdateReaction: Function;
    updateCoordinates: Function;
    searchMoments: Function;
    setInitialUserLocation: Function;
    setSearchDropdownVisibility: Function;
    deleteMoment: Function;
    updateGpsStatus: Function;
    updateLocationPermissions: Function;
}

interface IStoreProps extends IMapDispatchProps {
    location: ILocationState;
    map: IMapReduxState;
    reactions: IReactionsState;
    user: IUserState;
}

// Regular component props
export interface IMapProps extends IStoreProps {
    navigation: any;
}

interface IMapState {
    activeMoment: any;
    activeMomentDetails: any;
    areButtonsVisible: boolean;
    areLayersVisible: boolean;
    region: {
        latitude?: number,
        longitude?: number,
        latitudeDelta?: number,
        longitudeDelta?: number,
    };
    shouldFollowUserLocation: boolean;
    isMomentAlertVisible: boolean;
    isScrollEnabled: boolean;
    isLocationReady: boolean;
    isMinLoadTimeComplete: boolean;
    isSearchThisLocationBtnVisible: boolean;
    shouldIgnoreSearchThisAreaButton: boolean;
    lastMomentsRefresh?: number,
    lastLocationSendForProcessing?: number,
    lastLocationSendForProcessingCoords?: {
        longitude: number,
        latitude: number,
    },
    layers: any
    circleCenter: any;
}

const mapStateToProps = (state: any) => ({
    location: state.location,
    map: state.map,
    reactions: state.reactions,
    user: state.user,
});

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            captureClickTarget: UserInterfaceActions.captureClickEvent,
            updateCoordinates: MapActions.updateCoordinates,
            searchMoments: MapActions.searchMoments,
            setInitialUserLocation: MapActions.setInitialUserLocation,
            setSearchDropdownVisibility: MapActions.setSearchDropdownVisibility,
            deleteMoment: MapActions.deleteMoment,
            createOrUpdateReaction: ReactionActions.createOrUpdateMomentReaction,
            updateGpsStatus: LocationActions.updateGpsStatus,
            updateLocationPermissions: LocationActions.updateLocationPermissions,
        },
        dispatch
    );

class Map extends React.Component<IMapProps, IMapState> {
    private localeShort = 'en-US'; // TODO: Derive from user locale
    private mapRef: any;
    private mapWatchId;
    private timeoutId;
    private timeoutIdGPSStart;
    private timeoutIdRefreshMoments;
    private timeoutIdShowMoment;
    private timeoutIdSearchButton;
    private timeoutIdWaitForSearchSelect;
    private translate: Function;
    private unsubscribeNavigationListener: any;

    constructor(props) {
        super(props);

        this.state = {
            activeMoment: {},
            activeMomentDetails: {},
            areButtonsVisible: true,
            areLayersVisible: false,
            region: {},
            shouldFollowUserLocation: false,
            isScrollEnabled: true,
            isMomentAlertVisible: false,
            isLocationReady: false,
            isMinLoadTimeComplete: false,
            isSearchThisLocationBtnVisible: false,
            shouldIgnoreSearchThisAreaButton: false,
            layers: {
                myMoments: true,
                connectionsMoments: true,
            },
            circleCenter: {
                longitude: -96.4683143,
                latitude: 32.8102631,
            },
        };

        this.translate = (key: string, params: any) =>
            translator('en-us', key, params);
    }

    componentDidMount = async () => {
        const { navigation, setSearchDropdownVisibility } = this.props;

        this.unsubscribeNavigationListener = navigation.addListener('state', () => {
            setSearchDropdownVisibility(false);
            clearTimeout(this.timeoutId);
            this.setState({
                isMinLoadTimeComplete: true,
                isLocationReady: true,
            });
        });

        navigation.setOptions({
            title: this.translate('pages.map.headerTitle'),
        });

        this.timeoutId = setTimeout(() => {
            this.setState({
                isMinLoadTimeComplete: true,
                isLocationReady: true,
            });
        }, MIN_LOAD_TIMEOUT);
    };

    componentWillUnmount() {
        Geolocation.clearWatch(this.mapWatchId);
        clearTimeout(this.timeoutId);
        clearTimeout(this.timeoutIdGPSStart);
        clearTimeout(this.timeoutIdRefreshMoments);
        clearTimeout(this.timeoutIdShowMoment);
        clearTimeout(this.timeoutIdSearchButton);
        clearTimeout(this.timeoutIdWaitForSearchSelect);
        this.unsubscribeNavigationListener();
    }

    animateToWithHelp = (doAnimate) => {
        this.setState({
            shouldIgnoreSearchThisAreaButton: true,
        });
        doAnimate();
        clearTimeout(this.timeoutIdSearchButton);
        clearTimeout(this.timeoutIdWaitForSearchSelect);
        this.timeoutIdWaitForSearchSelect = setTimeout(() => {
            this.setState({
                shouldIgnoreSearchThisAreaButton: false,
            });
        }, ANIMATE_TO_REGION_DURATION_SLOW + 2000); // Add some buffer room
    }

    goToMoments = () => {
        const { navigation } = this.props;

        navigation.navigate('Moments');
    };

    goToHome = () => {
        const { navigation } = this.props;

        navigation.dispatch(
            StackActions.replace('Moments', {})
        );
    };

    goToNotifications = () => {
        const { navigation } = this.props;

        navigation.navigate('Notifications');
    };

    cancelMomentAlert = () => {
        this.setState({
            isMomentAlertVisible: false,
        });
    }

    getMomentDetails = (moment) => new Promise((resolve) => {
        const { user } = this.props;
        const details: any = {};

        if (moment.fromUserId === user.details.id) {
            details.userDetails = user.details;
        }

        return resolve(details);
    });

    handleImageSelect = (imageResponse, userCoords) => {
        const { navigation } = this.props;

        if (!imageResponse.didCancel) {
            return navigation.navigate('EditMoment', {
                ...userCoords,
                imageDetails: imageResponse,
            });
        }
    }

    handleCreateMoment = () => {
        const { location } = this.props;
        const { circleCenter } = this.state;

        if (location?.settings?.isGpsEnabled) {
            // TODO: Store permissions in redux
            const storePermissions = () => {};

            return requestOSCameraPermissions(storePermissions).then((response) => {
                const permissionsDenied = Object.keys(response).some((key) => {
                    return response[key] !== 'granted';
                });
                if (!permissionsDenied) {
                    return ImagePicker.launchCamera(
                        {
                            mediaType: 'photo',
                            includeBase64: false,
                            maxHeight: 4 * viewportWidth,
                            maxWidth: 4 * viewportWidth,
                            saveToPhotos: true,
                        },
                        (cameraResponse) => this.handleImageSelect(cameraResponse, circleCenter),
                    );
                } else {
                    throw new Error('permissions denied');
                }
            }).catch(() => {
                // Handle Permissions denied
            });

        } else {
            // TODO: Alert that GPS is required to create a moment
        }
    };

    // TODO: Ask for location permissions if not enabled
    handleCompassRealign = () => {
        this.mapRef && this.mapRef.animateCamera({ heading: 0 });
        this.setState({
            areLayersVisible: false,
        });
    };

    handleGpsRecenterPress = () => {
        const {
            location,
            navigation,
            map,
            setInitialUserLocation,
            updateCoordinates,
            updateGpsStatus,
            updateLocationPermissions,
        } = this.props;

        navigation.setOptions({
            title: this.translate('pages.map.headerTitle'),
        });

        this.timeoutId = setTimeout(() => {
            this.setState({
                isMinLoadTimeComplete: true,
            });
        }, MIN_LOAD_TIMEOUT);

        let perms;

        return requestLocationServiceActivation({
            isGpsEnabled: location?.settings?.isGpsEnabled,
            translate: this.translate,
            shouldIgnoreRequirement: false,
        }).then((response: any) => {
            if (response?.status || Platform.OS === 'ios') {
                return updateGpsStatus(response?.status || 'enabled');
            }

            return Promise.resolve();
        }).then(() => {
            requestOSMapPermissions(updateLocationPermissions).then((permissions) => {
                return new Promise((resolve, reject) => {
                    perms = permissions;
                    // If permissions are granted
                    if (permissions[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION]
                        || permissions[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]) {
                        this.setState({
                            isLocationReady: true,
                        });

                        // User has already logged in initially and loaded the map
                        if (map.longitude && map.latitude && map.hasUserLocationLoaded) {
                            const coords = {
                                longitude: map.longitude,
                                latitude: map.latitude,
                            };
                            this.setState({
                                circleCenter: coords,
                            });
                            updateCoordinates(coords);
                            this.handleGpsRecenter(coords, null, ANIMATE_TO_REGION_DURATION);
                            return resolve(coords);
                        }
                        // Get Location Success Handler
                        const positionSuccessCallback = (position) => {
                            const coords = {
                                latitude:
                                    position.coords
                                        .latitude,
                                longitude:
                                    position.coords
                                        .longitude,
                            };
                            this.setState({
                                circleCenter: coords,
                            });
                            setInitialUserLocation();
                            updateCoordinates(coords);
                            this.handleGpsRecenter(coords, null, ANIMATE_TO_REGION_DURATION_SLOW);
                            return resolve(coords);
                        };
                        // Get Location Failed Handler
                        const positionErrorCallback = (error, type) => {
                            console.log('geolocation error', error.code, type);
                            if (type !== 'watch' && error.code !== error.TIMEOUT) {
                                return reject(error);
                            }
                        };
                        const positionOptions = {
                            enableHighAccuracy: true,
                        };

                        // If this is not cached, response can be slow
                        Geolocation.getCurrentPosition(
                            positionSuccessCallback,
                            (error) => positionErrorCallback(error, 'get'),
                            positionOptions,
                        );

                        // Sometimes watch is faster than get, so we'll call both and cancel after one resolves first
                        this.mapWatchId = Geolocation.watchPosition(
                            positionSuccessCallback,
                            (error) => positionErrorCallback(error, 'watch'),
                            positionOptions,
                        );
                    } else {
                        console.log('Location permission denied');
                        return reject('permissionDenied');
                    }
                });
            })
                .then((coords: any) => {
                    Geolocation.clearWatch(this.mapWatchId);
                    Geolocation.stopObserving();
                    this.handleRefreshMoments(true, coords, true);
                })
                .catch((error) => {
                    console.log('requestOSPermissionsError', error);
                    // TODO: Display message encouraging user to turn on location permissions in settings
                    if (error === 'permissionDenied') {
                        updateLocationPermissions(perms);
                    }
                    // this.goToHome();
                });
        }).catch((error) => {
            console.log('locationServiceActivationError', error);
            // this.goToHome();
        });
    }

    handleGpsRecenter = (coords?, delta?, duration?) => {
        const { circleCenter } = this.state;
        const loc = {
            latitude: coords?.latitude || circleCenter.latitude,
            longitude: coords?.longitude || circleCenter.longitude,
            latitudeDelta: delta?.latitudeDelta || PRIMARY_LATITUDE_DELTA,
            longitudeDelta: delta?.longitudeDelta || PRIMARY_LONGITUDE_DELTA,
        };
        this.animateToWithHelp(() => this.mapRef && this.mapRef.animateToRegion(loc, duration || ANIMATE_TO_REGION_DURATION));
        this.setState({
            areLayersVisible: false,
        });
    };

    handleMapPress = ({ nativeEvent }) => {
        const { createOrUpdateReaction, location, map, navigation, setSearchDropdownVisibility, user } = this.props;
        const { circleCenter, layers } = this.state;
        let visibleMoments: any[] = [];

        setSearchDropdownVisibility(false);

        this.setState({
            areLayersVisible: false,
        });

        if (layers.connectionsMoments) {
            visibleMoments = visibleMoments.concat(map.moments);
        }
        if (layers.myMoments) {
            visibleMoments = visibleMoments.concat(map.myMoments);
        }
        const pressedMoments = visibleMoments.filter((moment) => {
            return insideCircle(nativeEvent.coordinate, {
                lon: moment.longitude,
                lat: moment.latitude,
            }, moment.radius);
        });

        if (pressedMoments.length) {
            const selectedMoment = pressedMoments[0];
            const distToCenter = distanceTo({
                lon: circleCenter.longitude,
                lat: circleCenter.latitude,
            }, {
                lon: selectedMoment.longitude,
                lat: selectedMoment.latitude,
            });
            const isProximitySatisfied = distToCenter - selectedMoment.radius <= selectedMoment.maxProximity;
            if (!isProximitySatisfied
                && selectedMoment.fromUserId !== user.details.id
                && !(selectedMoment.userHasActivated && !selectedMoment.doesRequireProximityToView)) {
                // Deny activation
                this.showMomentAlert();
            } else {
                // Activate moment
                createOrUpdateReaction(selectedMoment.id, {
                    userViewCount: 1,
                    userHasActivated: true,
                });
                this.getMomentDetails(selectedMoment)
                    .then((details) => {
                        this.setState({
                            activeMoment: selectedMoment,
                            activeMomentDetails: details,
                        }, () => {
                            if (location?.settings?.isGpsEnabled) {
                                navigation.navigate('ViewMoment', {
                                    isMyMoment: selectedMoment.fromUserId === user.details.id,
                                    moment: selectedMoment,
                                    momentDetails: details,
                                });
                            } else {
                                // TODO: Alert that GPS is required to create a moment
                            }
                        });
                    })
                    .catch(() => {
                        // TODO: Add error handling
                        console.log('Failed to get moment details!');
                    });
            }
        } else {
            this.setState({
                activeMoment: {},
                activeMomentDetails: {},
            });
        }
    };

    // TODO: Call this when user has traveled a certain distance from origin
    handleRefreshMoments = (overrideThrottle = false, coords?: any, shouldSearchAll = false) => {
        const { isMinLoadTimeComplete, layers } = this.state;

        if (!isMinLoadTimeComplete) {
            this.timeoutIdRefreshMoments = setTimeout(() => {
                this.handleRefreshMoments(overrideThrottle, coords, shouldSearchAll);
            }, 50);

            return;
        }

        clearTimeout(this.timeoutIdRefreshMoments);

        this.setState({
            areLayersVisible: false,
        });
        if (!overrideThrottle && this.state.lastMomentsRefresh &&
            (Date.now() - this.state.lastMomentsRefresh <= MOMENTS_REFRESH_THROTTLE_MS)) {
            return;
        }
        const { map, searchMoments } = this.props;
        const userCoords = coords || {
            longitude: map.longitude,
            latitude: map.latitude,
        };
        // TODO: Consider making this one, dynamic request to add efficiency
        if (shouldSearchAll || layers.myMoments) {
            searchMoments({
                query: 'me',
                itemsPerPage: 50,
                pageNumber: 1,
                order: 'desc',
                filterBy: 'fromUserIds',
                ...userCoords,
            });
        }
        if (shouldSearchAll || layers.connectionsMoments) {
            searchMoments({
                query: 'connections',
                itemsPerPage: 50,
                pageNumber: 1,
                order: 'desc',
                filterBy: 'fromUserIds',
                ...userCoords,
            });
        }
        this.setState({
            lastMomentsRefresh: Date.now(),
        });
    };

    handleSearchSelect = (selection) => {
        const { setSearchDropdownVisibility } = this.props;

        Keyboard.dismiss();

        setSearchDropdownVisibility(false);

        MapsService.getPlaceDetails({
            apiKey: Platform.OS === 'ios' ? GOOGLE_APIS_IOS_KEY : GOOGLE_APIS_ANDROID_KEY,
            placeId: selection?.place_id,
        }).then((response) => {
            const geometry = response.data?.result?.geometry;
            if (geometry) {
                const latDelta = geometry.viewport.northeast.lat - geometry.viewport.southwest.lat;
                const lngDelta = geometry.viewport.northeast.lng - geometry.viewport.southwest.lng;
                const loc = {
                    latitude: geometry.location.lat,
                    longitude: geometry.location.lng,
                    latitudeDelta: Math.max(latDelta, PRIMARY_LATITUDE_DELTA),
                    longitudeDelta: Math.max(lngDelta, PRIMARY_LONGITUDE_DELTA),
                };
                this.animateToWithHelp(() => this.mapRef && this.mapRef.animateToRegion(loc, ANIMATE_TO_REGION_DURATION_SLOW));
                // TODO: Determine if it would be best to combine these requests. Implement layers filter through filter button
                this.handleSearchThisLocation(geometry.location.lat, geometry.location.lng);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    handleSearchThisLocation = (latitude?, longitude?) => {
        const { searchMoments } = this.props;
        const { region } = this.state;
        this.setState({
            isSearchThisLocationBtnVisible: false,
        });

        let lat = latitude;
        let long = longitude;

        if (!latitude || !longitude) {
            lat = region.latitude;
            long = region.longitude;
        }


        if (lat && long) {
            searchMoments({
                query: 'connections',
                itemsPerPage: 50,
                pageNumber: 1,
                order: 'desc',
                filterBy: 'fromUserIds',
                latitude: lat,
                longitude: long,
            });
            searchMoments({
                query: 'me',
                itemsPerPage: 20,
                pageNumber: 1,
                order: 'desc',
                filterBy: 'fromUserIds',
                latitude: lat,
                longitude: long,
            });
        }
    }

    isAuthorized = () => {
        const { user } = this.props;
        return UsersService.isAuthorized(
            {
                type: AccessCheckType.ALL,
                levels: [AccessLevels.EMAIL_VERIFIED],
            },
            user
        );
    }

    onDeleteMoment = (moment) => {
        const { deleteMoment, user } = this.props;
        if (moment.fromUserId === user.details.id) {
            deleteMoment({ ids: [moment.id] })
                .then(() => {
                    console.log('Moment successfully deleted');
                })
                .catch((err) => {
                    console.log('Error deleting moment', err);
                });
        }
    };

    onUserLocationChange = (event) => {
        const {
            shouldFollowUserLocation,
            lastLocationSendForProcessing,
            lastLocationSendForProcessingCoords,
        } = this.state;
        const {
            map,
            updateCoordinates,
        } = this.props;
        const coords = {
            latitude: event.nativeEvent.coordinate.latitude,
            longitude: event.nativeEvent.coordinate.longitude,
        };
        // TODO: Add throttle
        updateCoordinates(coords);
        this.setState({
            circleCenter: coords,
        });

        if (shouldFollowUserLocation) {
            const loc = {
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: PRIMARY_LATITUDE_DELTA,
                longitudeDelta: PRIMARY_LONGITUDE_DELTA,
            };
            this.animateToWithHelp(() => this.mapRef && this.mapRef.animateToRegion(loc, ANIMATE_TO_REGION_DURATION_FAST));
        }


        if (!map.hasUserLocationLoaded) {
            return;
        }

        if (lastLocationSendForProcessing) {
            if (Date.now() - lastLocationSendForProcessing <= LOCATION_PROCESSING_THROTTLE_MS) {
                return;
            }

            if (lastLocationSendForProcessingCoords) {
                const timeOfTravel = Date.now() - lastLocationSendForProcessing;
                const distanceTraveledMeters = distanceTo({
                    lon: coords.longitude,
                    lat: coords.latitude,
                }, {
                    lon: lastLocationSendForProcessingCoords.longitude,
                    lat: lastLocationSendForProcessingCoords.latitude,
                });
                const kmPerHour = distanceTraveledMeters / (timeOfTravel * 60 * 60);

                if (distanceTraveledMeters < 5) {
                    return;
                }

                if (kmPerHour > 15) { // Don't send location until user slows down to a walking pace
                    return;
                }
            }
        }

        // Send location to backend for processing
        PushNotificationsService.postLocationChange({
            longitude: coords.longitude,
            latitude: coords.latitude,
            lastLocationSendForProcessing,
        });

        this.setState({
            lastLocationSendForProcessing: Date.now(),
            lastLocationSendForProcessingCoords: {
                longitude: coords.longitude,
                latitude: coords.latitude,
            },
        });
    };

    onRegionChange = (region) => {
        if (region.latitude.toFixed(6) === this.state.region?.latitude?.toFixed(6)
            && region.longitude.toFixed(6) === this.state.region?.longitude?.toFixed(6)) {
            return;
        }

        this.setState({
            isSearchThisLocationBtnVisible: false,
            region,
        });

        clearTimeout(this.timeoutIdSearchButton);
        if (!this.state.shouldIgnoreSearchThisAreaButton) {
            this.timeoutIdSearchButton = setTimeout(() => {
                this.setState({
                    isSearchThisLocationBtnVisible: true,
                });
            }, 1500);
        }
    }

    onRegionChangeComplete = () => {
        this.setState({
            isSearchThisLocationBtnVisible: false,
        });
    }

    showMomentAlert = () => {
        this.setState({
            isMomentAlertVisible: true,
        });

        this.timeoutIdShowMoment = setTimeout(() => {
            this.setState({
                isMomentAlertVisible: false,
            });
        }, 2000);
    };

    toggleMapFollow = () => {
        const {
            shouldFollowUserLocation,
            isScrollEnabled,
        } = this.state;
        const { map } = this.props;

        if (shouldFollowUserLocation === false) {
            this.animateToWithHelp(() => {
                this.mapRef && this.mapRef.animateToRegion({
                    longitude: map.longitude,
                    latitude: map.latitude,
                    latitudeDelta: PRIMARY_LATITUDE_DELTA,
                    longitudeDelta: PRIMARY_LONGITUDE_DELTA,
                }, ANIMATE_TO_REGION_DURATION);
            });
        }

        this.setState({
            shouldFollowUserLocation: !shouldFollowUserLocation,
            isScrollEnabled: !isScrollEnabled,
        });
    }

    toggleLayers = () => {
        this.setState({
            areLayersVisible: !this.state.areLayersVisible,
        });
    }

    toggleLayer = (layerName) => {
        const { layers } = this.state;
        layers[layerName] = !layers[layerName];

        this.setState({
            layers,
        });
    }

    toggleMomentBtns = () => {
        this.setState({
            areButtonsVisible: !this.state.areButtonsVisible,
            areLayersVisible: false,
        });
    }

    render() {
        const {
            activeMoment,
            areButtonsVisible,
            // areLayersVisible,
            circleCenter,
            shouldFollowUserLocation,
            isLocationReady,
            isMinLoadTimeComplete,
            isMomentAlertVisible,
            isScrollEnabled,
            isSearchThisLocationBtnVisible,
            layers,
        } = this.state;
        const { captureClickTarget, location, map, navigation, user } = this.props;
        const searchPredictionResults = map?.searchPredictions?.results || [];
        const isDropdownVisible = map?.searchPredictions?.isSearchDropdownVisible;

        return (
            <>
                <BaseStatusBar />
                <SafeAreaView style={styles.safeAreaView} onStartShouldSetResponder={(event: any) => {
                    event.persist();
                    if (event?.target?._nativeTag) {
                        captureClickTarget(event?.target?._nativeTag);
                    }
                    return false;
                }}>
                    {!(isLocationReady && isMinLoadTimeComplete) ? (
                        <AnimatedLoader
                            visible={true}
                            overlayColor="rgba(255,255,255,0.75)"
                            source={earthLoader}
                            animationStyle={loaderStyles.lottie}
                            speed={1.5}
                        />
                    ) : (
                        <>
                            {
                                isDropdownVisible &&
                                <SearchTypeAheadResults
                                    handleSelect={this.handleSearchSelect}
                                    viewPortHeight={viewPortHeight}
                                    searchPredictionResults={searchPredictionResults}
                                />
                            }
                            <MapView
                                mapRef={(ref: Ref<MapView>) => { this.mapRef = ref; }}
                                provider={PROVIDER_GOOGLE}
                                style={mapStyles.mapView}
                                customMapStyle={mapCustomStyle}
                                initialRegion={{
                                    latitude: circleCenter.latitude,
                                    longitude: circleCenter.longitude,
                                    latitudeDelta: map.hasUserLocationLoaded ? PRIMARY_LATITUDE_DELTA : INITIAL_LATITUDE_DELTA,
                                    longitudeDelta: map.hasUserLocationLoaded ? PRIMARY_LONGITUDE_DELTA : INITIAL_LONGITUDE_DELTA,
                                }}
                                onPress={this.handleMapPress}
                                onRegionChange={this.onRegionChange}
                                onRegionChangeComplete={this.onRegionChangeComplete}
                                onUserLocationChange={this.onUserLocationChange}
                                showsUserLocation={true}
                                showsBuildings={true}
                                showsMyLocationButton={false}
                                showsCompass={false}
                                followsUserLocation={shouldFollowUserLocation}
                                scrollEnabled={isScrollEnabled}
                                minZoomLevel={MIN_ZOOM_LEVEL}
                                /* react-native-map-clustering */
                                clusterColor={therrTheme.colors.primary2}
                            >
                                <Circle
                                    center={circleCenter}
                                    radius={DEFAULT_MOMENT_PROXIMITY} /* meters */
                                    strokeWidth={1}
                                    strokeColor={therrTheme.colors.primary2}
                                    fillColor={therrTheme.colors.map.userCircleFill}
                                    zIndex={0}
                                />
                                {
                                    layers.connectionsMoments &&
                                    map.moments.map((moment) => {
                                        return (
                                            <Marker
                                                anchor={{
                                                    x: 0.5,
                                                    y: 0.5,
                                                }}
                                                key={moment.id}
                                                coordinate={{
                                                    longitude: moment.longitude,
                                                    latitude: moment.latitude,
                                                }}
                                                onPress={this.handleMapPress}
                                                stopPropagation={true}
                                            >
                                                <View>
                                                    <CameraMarkerIcon />
                                                </View>
                                            </Marker>
                                        );
                                    })
                                }
                                {
                                    layers.myMoments &&
                                    map.myMoments.map((moment) => {
                                        return (
                                            <Marker
                                                anchor={{
                                                    x: 0.5,
                                                    y: 0.5,
                                                }}
                                                key={moment.id}
                                                coordinate={{
                                                    longitude: moment.longitude,
                                                    latitude: moment.latitude,
                                                }}
                                                onPress={this.handleMapPress}
                                                stopPropagation={true}
                                            >
                                                <View style={{ transform: [{ translateY: 0 }] }}>
                                                    <CameraMarkerIcon />
                                                </View>
                                            </Marker>
                                        );
                                    })
                                }
                                {
                                    layers.connectionsMoments &&
                                    map.moments.map((moment) => {
                                        return (
                                            <Circle
                                                key={moment.id}
                                                center={{
                                                    longitude: moment.longitude,
                                                    latitude: moment.latitude,
                                                }}
                                                radius={moment.radius} /* meters */
                                                strokeWidth={0}
                                                strokeColor={therrTheme.colors.secondary}
                                                fillColor={moment.id === activeMoment.id ?
                                                    therrTheme.colors.map.momentsCircleFillActive :
                                                    therrTheme.colors.map.momentsCircleFill}
                                                zIndex={1}
                                            />
                                        );
                                    })
                                }
                                {
                                    layers.myMoments &&
                                    map.myMoments.map((moment) => {
                                        return (
                                            <Circle
                                                key={moment.id}
                                                center={{
                                                    longitude: moment.longitude,
                                                    latitude: moment.latitude,
                                                }}
                                                radius={moment.radius} /* meters */
                                                strokeWidth={0}
                                                strokeColor={therrTheme.colors.secondary}
                                                fillColor={moment.id === activeMoment.id ?
                                                    therrTheme.colors.map.myMomentsCircleFillActive :
                                                    therrTheme.colors.map.myMomentsCircleFill}
                                                zIndex={1}
                                            />
                                        );
                                    })
                                }
                            </MapView>
                            {/* <View style={buttonStyles.collapse}>
                                <Button
                                    buttonStyle={buttonStyles.btn}
                                    icon={
                                        <FontAwesomeIcon
                                            name="ellipsis-h"
                                            size={20}
                                            style={buttonStyles.btnIcon}
                                        />
                                    }
                                    raised={true}
                                    onPress={() => this.toggleMomentBtns()}
                                />
                            </View> */}
                            <AnimatedOverlay
                                animationType="swing"
                                animationDuration={500}
                                easing="linear"
                                visible={isMomentAlertVisible}
                                onClose={this.cancelMomentAlert}
                                closeOnTouchOutside
                                containerStyle={styles.overlay}
                                childrenWrapperStyle={mapStyles.momentAlertOverlayContainer}
                            >
                                <Alert
                                    containerStyles={{}}
                                    isVisible={isMomentAlertVisible}
                                    message={this.translate('pages.map.momentAlerts.walkCloser')}
                                    type="error"
                                />
                            </AnimatedOverlay>
                        </>
                    )}
                    {
                        (isSearchThisLocationBtnVisible && !isDropdownVisible) &&
                        <SearchThisAreaButtonGroup
                            handleSearchLocation={this.handleSearchThisLocation}
                            translate={this.translate}
                        />
                    }
                </SafeAreaView>
                {
                    isLocationReady && isMinLoadTimeComplete && areButtonsVisible &&
                    <>
                        <MapActionButtonsAlt
                            goToMoments={this.goToMoments}
                            goToNotifications={this.goToNotifications}
                            handleCreateMoment={this.handleCreateMoment}
                            handleGpsRecenter={this.handleGpsRecenterPress}
                            isAuthorized={this.isAuthorized}
                            isGpsEnabled={location?.settings?.isGpsEnabled}
                        />
                        <FiltersButtonGroup
                            goToMoments={this.goToMoments}
                            translate={this.translate}
                        />
                    </>
                }
                <MainButtonMenuAlt
                    navigation={navigation}
                    onActionButtonPress={this.toggleMomentBtns}
                    translate={this.translate}
                    user={user}
                />
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
