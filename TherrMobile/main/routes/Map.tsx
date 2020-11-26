import React from 'react';
import { PermissionsAndroid, StatusBar, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import { Button, Overlay } from 'react-native-elements';
import 'react-native-gesture-handler';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IMapState, IUserState } from 'therr-react/types';
import { MapActions } from 'therr-react/redux/actions';
import Geolocation from '@react-native-community/geolocation';
import AnimatedLoader from 'react-native-animated-loader';
import UsersActions from '../redux/actions/UsersActions';
import { ILocationState } from '../types/redux/location';
import LocationActions from '../redux/actions/LocationActions';
import translator from '../services/translator';
import {
    INITIAL_LATIUDE_DELTA,
    INITIAL_LONGITUDE_DELTA,
    MIN_LOAD_TIMEOUT,
    DEFAULT_MOMENT_PROXIMITY,
    MIN_ZOOM_LEVEL,
} from '../constants';
import * as therrTheme from '../styles/themes/ocean';
import { loaderStyles } from '../styles';
import mapStyles from '../styles/map';
import EditMoment from '../components/moments/EditMoment';

const earthLoader = require('../assets/earth-loader.json');
// const mapStyle = require('../styles/map/style.json');

interface IMapDispatchProps {
    login: Function;
    logout: Function;
    searchMoments: Function;
    updateLocationPermissions: Function;
}

interface IStoreProps extends IMapDispatchProps {
    location: ILocationState;
    map: IMapState;
    user: IUserState;
}

// Regular component props
export interface IMapProps extends IStoreProps {
    navigation: any;
}

interface IMapState {
    isEditMomentVisible: boolean;
    isLocationReady: boolean;
    isMinLoadTimeComplete: boolean;
    longitude: number;
    latitude: number;
    circleCenter: any;
}

const mapStateToProps = (state: any) => ({
    location: state.location,
    map: state.map,
    user: state.user,
});

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            login: UsersActions.login,
            logout: UsersActions.logout,
            searchMoments: MapActions.searchMoments,
            updateLocationPermissions:
                LocationActions.updateLocationPermissions,
        },
        dispatch
    );

class Map extends React.Component<IMapProps, IMapState> {
    private mapWatchId;
    private timeoutId;
    private translate: Function;

    constructor(props) {
        super(props);

        this.state = {
            isEditMomentVisible: false,
            isLocationReady: false,
            isMinLoadTimeComplete: false,
            longitude: -96.4683143,
            latitude: 32.8102631,
            circleCenter: {
                longitude: -96.4683143,
                latitude: 32.8102631,
            },
        };

        this.translate = (key: string, params: any) =>
            translator('en-us', key, params);
    }

    componentDidMount = async () => {
        const { location, navigation, searchMoments, updateLocationPermissions } = this.props;

        navigation.setOptions({
            title: this.translate('pages.map.headerTitle'),
        });

        this.timeoutId = setTimeout(() => {
            this.setState({
                isMinLoadTimeComplete: true,
            });
        }, MIN_LOAD_TIMEOUT);

        if (location.settings.isGpsEnabled) {
            let grantStatus;

            // TODO: Store permissions response in Mobile only redux
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Therr Mobile',
                    message:
                        'Therr App needs access to your location ' +
                        'so you can share moments with connections',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            )
                .then(
                    (response) =>
                        new Promise((resolve, reject) => {
                            grantStatus = response;
                            updateLocationPermissions({
                                accessFileLocation: grantStatus,
                            });
                            if (
                                grantStatus ===
                                PermissionsAndroid.RESULTS.GRANTED
                            ) {
                                this.mapWatchId = Geolocation.watchPosition(
                                    (position) => {
                                        if (position && position.coords) {
                                            this.setState({
                                                isLocationReady: true,
                                                latitude:
                                                    position.coords.latitude,
                                                longitude:
                                                    position.coords.longitude,
                                                circleCenter: {
                                                    latitude:
                                                        position.coords
                                                            .latitude,
                                                    longitude:
                                                        position.coords
                                                            .longitude,
                                                },
                                            });
                                        }
                                        return resolve({
                                            latitude:
                                                position.coords
                                                    .latitude,
                                            longitude:
                                                position.coords
                                                    .longitude,
                                        });
                                    },
                                    (error) => {
                                        console.log('geolocation error');
                                        return reject(error);
                                    },
                                    {
                                        enableHighAccuracy: true,
                                    }
                                );
                            } else {
                                console.log('Location permission denied');
                                return reject('permissionDenied');
                            }
                        })
                )
                .then((coords: any) => {
                    searchMoments({
                        query: '',
                        itemsPerPage: 20,
                        pageNumber: 1,
                        order: 'desc',
                        longitude: coords.longitude,
                        latitude: coords.latitude,
                    });
                })
                .catch((error) => {
                    if (error === 'permissionDenied') {
                        updateLocationPermissions({
                            accessFileLocation: grantStatus,
                        });
                    }
                    this.goToHome();
                });
        } else {
            this.goToHome();
        }
    };

    componentWillUnmount() {
        Geolocation.clearWatch(this.mapWatchId);
        clearTimeout(this.timeoutId);
    }

    goToHome = () => {
        const { navigation } = this.props;

        navigation.navigate('Home');
    };

    cancelEditMoment = () => {
        this.setState({
            isEditMomentVisible: false,
        });
    }

    handleAddMoment = () => {
        this.setState({
            isEditMomentVisible: true,
        });
    };

    onUserLocationChange = (event) => {
        this.setState({
            circleCenter: {
                latitude: event.nativeEvent.coordinate.latitude,
                longitude: event.nativeEvent.coordinate.longitude,
            },
        });
    };

    render() {
        const {
            circleCenter,
            isLocationReady,
            isMinLoadTimeComplete,
            isEditMomentVisible,
            longitude,
            latitude,
        } = this.state;
        const { map } = this.props;

        return (
            <>
                <StatusBar barStyle="dark-content" />
                {!(isLocationReady && isMinLoadTimeComplete) ? (
                    <AnimatedLoader
                        visible={true}
                        overlayColor="rgba(255,255,255,0.75)"
                        source={earthLoader}
                        animationStyle={loaderStyles.lottie}
                        speed={1.25}
                    />
                ) : (
                    <>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={mapStyles.mapView}
                            // customMapStyle={mapStyle}
                            initialRegion={{
                                latitude,
                                longitude,
                                latitudeDelta: INITIAL_LATIUDE_DELTA,
                                longitudeDelta: INITIAL_LONGITUDE_DELTA,
                            }}
                            showsUserLocation={true}
                            showsCompass={true}
                            showsBuildings={true}
                            showsMyLocationButton={true}
                            // followsUserLocation={true}
                            onUserLocationChange={this.onUserLocationChange}
                            minZoomLevel={MIN_ZOOM_LEVEL}
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
                                map.moments.map((moment) => {
                                    return (
                                        <Circle
                                            key={moment.id}
                                            center={{
                                                longitude: moment.longitude,
                                                latitude: moment.latitude,
                                            }}
                                            radius={moment.minProximity} /* meters */
                                            strokeWidth={0}
                                            strokeColor={therrTheme.colors.secondary}
                                            fillColor={therrTheme.colors.map.momentsCircleFill}
                                            zIndex={1}
                                        />
                                    );
                                })
                            }
                        </MapView>
                        <View style={mapStyles.addMoment}>
                            <Button
                                buttonStyle={mapStyles.addMomentBtn}
                                icon={
                                    <FontAwesomeIcon
                                        name="marker"
                                        size={44}
                                        style={mapStyles.addMomentBtnIcon}
                                    />
                                }
                                raised={true}
                                onPress={this.handleAddMoment}
                            />
                        </View>
                        <Overlay
                            isVisible={isEditMomentVisible}
                            onBackdropPress={() => {}}
                            overlayStyle={mapStyles.editMomentOverlay}
                        >
                            <EditMoment
                                closeOverlay={this.cancelEditMoment}
                                latitude={circleCenter.latitude}
                                longitude={circleCenter.longitude}
                                translate={this.translate}
                            />
                        </Overlay>
                    </>
                )}
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
