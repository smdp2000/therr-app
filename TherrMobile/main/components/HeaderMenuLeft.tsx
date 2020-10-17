import React from 'react';
import { Button } from 'react-native-elements';
import 'react-native-gesture-handler';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import therrIconConfig from '../assets/therr-icon-config.json';

const LogoIcon = createIconSetFromIcoMoon(
    therrIconConfig,
    'TherrFont',
    'TherrFont.ttf'
);

interface IHeaderMenuLeftDispatchProps {}

interface IStoreProps extends IHeaderMenuLeftDispatchProps {}

// Regular component props
export interface IHeaderMenuLeftProps extends IStoreProps {
    isAuthenticated: boolean;
    navigation: any;
}

interface IHeaderMenuLeftState {}

class HeaderMenuLeft extends React.Component<
    IHeaderMenuLeftProps,
    IHeaderMenuLeftState
> {
    constructor(props) {
        super(props);

        this.state = {};
    }

    handlePress = () => {
        const { isAuthenticated, navigation } = this.props;
        if (isAuthenticated) {
            navigation.navigate('Home');
        }
    };

    render() {
        return (
            <Button
                type="clear"
                icon={
                    <LogoIcon
                        name="therr-logo"
                        size={28}
                        color="white"
                        onPress={this.handlePress}
                    />
                }
            />
        );
    }
}

export default HeaderMenuLeft;
