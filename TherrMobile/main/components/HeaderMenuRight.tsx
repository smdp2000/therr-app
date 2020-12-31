import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Button, Image, Text } from 'react-native-elements';
import Overlay from 'react-native-modal-overlay';
import { CommonActions } from '@react-navigation/native';
import 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import styles from '../styles';
import { headerMenuModal } from '../styles/modal';
import * as therrTheme from '../styles/themes';
import translator from '../services/translator';
import { ILocationState } from '../types/redux/location';

const ANIMATION_DURATION = 200;

interface IHeaderMenuRightDispatchProps {}

interface IStoreProps extends IHeaderMenuRightDispatchProps {}

// Regular component props
export interface IHeaderMenuRightProps extends IStoreProps {
    location: ILocationState;
    logout: Function;
    navigation: any;
    isVisible: boolean;
    shouldUseDarkText: boolean;
    updateGpsStatus: Function;
    user: any;
}

interface IHeaderMenuRightState {
    isModalVisible: boolean;
}

class HeaderMenuRight extends React.Component<
    IHeaderMenuRightProps,
    IHeaderMenuRightState
> {
    private translate: Function;

    constructor(props) {
        super(props);

        this.state = {
            isModalVisible: false,
        };

        this.translate = (key: string, params: any) => translator('en-us', key, params);
    }

    toggleOverlay = () => {
        const { isModalVisible } = this.state;

        this.setState({
            isModalVisible: !isModalVisible,
        });
    };

    navTo = (routeName) => {
        const { location, navigation, updateGpsStatus } = this.props;

        if (routeName === 'Map' && !location.settings.isGpsEnabled) {
            LocationServicesDialogBox.checkLocationServicesIsEnabled({
                message:
                    "<h2 style='color: #0af13e'>Use Location?</h2>This app wants to change your device settings:<br/><br/>" +
                    "Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='https://support.google.com/maps/answer/7326816'>Learn more</a>",
                ok: 'YES',
                cancel: 'NO',
                enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
                showDialog: true, // false => Opens the Location access page directly
                openLocationServices: true, // false => Directly catch method is called if location services are turned off
                preventOutSideTouch: false, // true => To prevent the location services window from closing when it is clicked outside
                preventBackClick: false, // true => To prevent the location services popup from closing when it is clicked back button
                providerListener: false, // true ==> Trigger locationProviderStatusChange listener when the location state changes
            })
                .then((success) => {
                    updateGpsStatus(success.status);
                    this.toggleOverlay();
                    navigation.navigate(routeName);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            this.toggleOverlay();
            navigation.navigate(routeName);
        }
    };

    handleLogout = (hideModal) => {
        const { user, logout, navigation } = this.props;

        hideModal();

        setTimeout(() => { // Wait for overlay animation
            logout(user.details)
                .then(() => {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [
                                {
                                    name: 'Login',
                                },
                            ],
                        })
                    );
                })
                .catch((e) => {
                    console.log(e);
                });
        });
    };

    getCurrentScreen = () => {
        const navState = this.props.navigation.dangerouslyGetState();

        return (
            navState.routes[navState.routes.length - 1] &&
            navState.routes[navState.routes.length - 1].name
        );
    };

    render() {
        const { shouldUseDarkText, isVisible, user } = this.props;
        const { isModalVisible } = this.state;
        const currentScreen = this.getCurrentScreen();

        if (isVisible) {
            return (
                <>
                    <Button
                        icon={
                            <Image
                                source={{ uri: `https://robohash.org/${user.details?.id}?size=50x50` }}
                                style={shouldUseDarkText ? headerMenuModal.toggleIconDark : headerMenuModal.toggleIcon}
                                PlaceholderContent={<ActivityIndicator size="small" color={therrTheme.colors.primary} />}
                            />}
                        onPress={this.toggleOverlay}
                        type="clear"
                    />
                    <Overlay
                        animationType="slideInRight"
                        animationDuration={ANIMATION_DURATION}
                        easing="ease-in-out-sine"
                        visible={isModalVisible}
                        onClose={this.toggleOverlay}
                        closeOnTouchOutside
                        containerStyle={styles.overlay}
                        childrenWrapperStyle={headerMenuModal.overlayContainer}
                    >
                        {
                            (hideModal) => (
                                <>
                                    <View style={headerMenuModal.header}>
                                        <View style={headerMenuModal.headerTitle}>
                                            <Image
                                                source={{ uri: `https://robohash.org/${user.details?.id}?size=50x50` }}
                                                style={headerMenuModal.headerTitleIcon}
                                                transition={false}
                                            />
                                            <Text style={headerMenuModal.headerTitleText}>
                                                {user.details?.userName}
                                            </Text>
                                        </View>
                                        <Button
                                            icon={
                                                <Icon
                                                    name="close"
                                                    size={30}
                                                    color={therrTheme.colors.primary3}
                                                />
                                            }
                                            onPress={hideModal}
                                            type="clear"
                                        />
                                    </View>
                                    <View style={headerMenuModal.body}>
                                        <Button
                                            buttonStyle={
                                                currentScreen === 'Home'
                                                    ? headerMenuModal.buttonsActive
                                                    : headerMenuModal.buttons
                                            }
                                            titleStyle={
                                                currentScreen === 'Home'
                                                    ? headerMenuModal.buttonsTitleActive
                                                    : headerMenuModal.buttonsTitle
                                            }
                                            title={this.translate('components.headerMenuRight.menuItems.home')}
                                            icon={
                                                <FontAwesomeIcon
                                                    style={
                                                        currentScreen === 'Home'
                                                            ? headerMenuModal.iconStyleActive
                                                            : headerMenuModal.iconStyle
                                                    }
                                                    name="home"
                                                    size={22}
                                                />
                                            }
                                            onPress={() => this.navTo('Home')}
                                        />
                                        <Button
                                            buttonStyle={
                                                currentScreen === 'Map'
                                                    ? headerMenuModal.buttonsActive
                                                    : headerMenuModal.buttons
                                            }
                                            titleStyle={
                                                currentScreen === 'Map'
                                                    ? headerMenuModal.buttonsTitleActive
                                                    : headerMenuModal.buttonsTitle
                                            }
                                            title={this.translate('components.headerMenuRight.menuItems.map')}
                                            icon={
                                                <FontAwesomeIcon
                                                    style={
                                                        currentScreen === 'Map'
                                                            ? headerMenuModal.iconStyleActive
                                                            : headerMenuModal.iconStyle
                                                    }
                                                    name="globe-americas"
                                                    size={22}
                                                />
                                            }
                                            onPress={() => this.navTo('Map')}
                                        />
                                        <Button
                                            buttonStyle={
                                                currentScreen === 'ActiveConnections'
                                                    ? headerMenuModal.buttonsActive
                                                    : headerMenuModal.buttons
                                            }
                                            titleStyle={
                                                currentScreen === 'ActiveConnections'
                                                    ? headerMenuModal.buttonsTitleActive
                                                    : headerMenuModal.buttonsTitle
                                            }
                                            title={this.translate('components.headerMenuRight.menuItems.connections')}
                                            icon={
                                                <FontAwesomeIcon
                                                    style={
                                                        currentScreen === 'ActiveConnections'
                                                            ? headerMenuModal.iconStyleActive
                                                            : headerMenuModal.iconStyle
                                                    }
                                                    name="users"
                                                    size={22}
                                                />
                                            }
                                            onPress={() => this.navTo('ActiveConnections')}
                                        />
                                        <Button
                                            buttonStyle={
                                                currentScreen === 'Settings'
                                                    ? headerMenuModal.buttonsActive
                                                    : headerMenuModal.buttons
                                            }
                                            titleStyle={
                                                currentScreen === 'Settings'
                                                    ? headerMenuModal.buttonsTitleActive
                                                    : headerMenuModal.buttonsTitle
                                            }
                                            title={this.translate('components.headerMenuRight.menuItems.account')}
                                            icon={
                                                <FontAwesomeIcon
                                                    style={
                                                        currentScreen === 'Settings'
                                                            ? headerMenuModal.iconStyleActive
                                                            : headerMenuModal.iconStyle
                                                    }
                                                    name="user-cog"
                                                    size={22}
                                                />
                                            }
                                            onPress={() => this.navTo('Settings')}
                                        />
                                    </View>
                                    <View style={headerMenuModal.footer}>
                                        <Button
                                            titleStyle={headerMenuModal.buttonsTitle}
                                            buttonStyle={headerMenuModal.buttons}
                                            title={this.translate('components.headerMenuRight.menuItems.logout')}
                                            iconRight
                                            icon={
                                                <FontAwesomeIcon
                                                    style={headerMenuModal.iconStyle}
                                                    name="sign-out-alt"
                                                    size={22}
                                                />
                                            }
                                            onPress={() => this.handleLogout(hideModal)}
                                        />
                                    </View>
                                </>
                            )
                        }
                    </Overlay>
                </>
            );
        }

        return null;
    }
}

export default HeaderMenuRight;
