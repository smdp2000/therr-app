import { StyleSheet } from 'react-native';
import { IMobileThemeName } from 'therr-react/types';
import { EDGE_PADDING } from './';
import { getTheme } from '../../themes';

const categoryButtonContainerStyle = {
    marginTop: 0,
    marginBottom: 0,
};

const getCategoryButtonTitleStyle = (theme) => ({
    color: theme.colors.textBlack,
});

const categoryButtonStyle: any = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const categoryIconStyle = {
    marginRight: 4,
    elevation: 1,
    textShadowColor: '#00000026',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    padding: 4,
};

const buildStyles = (themeName?: IMobileThemeName) => {
    const therrTheme = getTheme(themeName);
    const styles = StyleSheet.create({
        outerContainer: {
            position: 'relative',
            margin: 0,
            padding: 0,
            marginBottom: 8,
        },
        innerContainer: {
            borderTopWidth: 1,
            borderTopColor: therrTheme.colors.primary,
            borderBottomWidth: 1,
            borderBottomColor: therrTheme.colors.primary,
            display: 'flex',
            justifyContent: 'center',
            paddingHorizontal: EDGE_PADDING * 2,
            marginTop: 5,
            paddingTop: 2,
            paddingBottom: 2,
            marginBottom: 20,
        },
        header: {
            position: 'absolute',
            top: -12,
            left: 10,
            backgroundColor: therrTheme.colors.primary2,
            color: therrTheme.colors.primary3,
            paddingHorizontal: 4,
        },
        listToggleButtonContainer: {
            position: 'absolute',
            backgroundColor: therrTheme.colors.primary2,
            bottom: 0,
            right: 24,
            zIndex: 10,
        },
        listContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: 50,
        },
        categoryButtonContainer: {
            ...categoryButtonContainerStyle,
        },
        categoryButtonContainerActive: {
            ...categoryButtonContainerStyle,
            elevation: 0,
        },
        categoryButtonTitle: {
            ...getCategoryButtonTitleStyle(therrTheme),
        },
        categoryButtonTitleActive: {
            ...getCategoryButtonTitleStyle(therrTheme),
            color: therrTheme.colors.textWhite,
        },
        categoryButton: {
            ...categoryButtonStyle,
            backgroundColor: therrTheme.colors.brandingLightBlue,
        },
        categoryButtonActive: {
            ...categoryButtonStyle,
            backgroundColor: therrTheme.colors.accentBlue,
        },
        categoryIcon: {
            ...categoryIconStyle,
        },
        categoryIconActive: {
            ...categoryIconStyle,
        },
    });

    return ({
        ...therrTheme,
        styles,
    });
};

export {
    buildStyles,
};
