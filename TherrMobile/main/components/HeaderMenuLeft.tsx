import React from 'react';
import { Button } from 'react-native-elements';
import 'react-native-gesture-handler';
import TherrIcon from '../components/TherrIcon';

interface IHeaderMenuLeftDispatchProps {}

interface IStoreProps extends IHeaderMenuLeftDispatchProps {}

// Regular component props
export interface IHeaderMenuLeftProps extends IStoreProps {
    isAuthenticated: boolean;
    isEmailVerifed: boolean;
    styleName: 'light' | 'dark' | 'accent';
    navigation: any;
    theme: {
        styles: any;
    }
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
        const { isAuthenticated, isEmailVerifed, navigation } = this.props;
        if (isAuthenticated && isEmailVerifed) {
            navigation.navigate('Home');
        } else if (isAuthenticated) {
            navigation.navigate('CreateProfile');
        } else {
            navigation.navigate('Login');
        }
    };

    render() {
        const { styleName, theme } = this.props;
        let logoStyle = theme.styles.logoIcon;

        if (styleName === 'light') {
            logoStyle = theme.styles.logoIcon;
        }
        if (styleName === 'dark') {
            logoStyle = theme.styles.logoIconDark;
        }
        if (styleName === 'accent') {
            logoStyle = theme.styles.logoIconBlack;
        }

        return (
            <Button
                type="clear"
                icon={
                    <TherrIcon
                        name="therr-logo"
                        size={28}
                        style={logoStyle}
                        onPress={this.handlePress}
                    />
                }
            />
        );
    }
}

export default HeaderMenuLeft;
