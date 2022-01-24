import { StyleSheet } from 'react-native';
import { IMobileThemeName } from 'therr-react/types';
import { getTheme, ITherrTheme } from '../themes';

const containerStyles: any = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 8,
    zIndex: -1,
};

const getTextStyles = (theme: ITherrTheme) => ({
    color: theme.colors.textBlack,
    marginVertical: 50,
    paddingHorizontal: 10,
    fontSize: 20,
    textAlign: 'center',
});

const buildStyles = (themeName?: IMobileThemeName) => {
    const therrTheme = getTheme(themeName);

    const styles = StyleSheet.create({
        // container styles
        defaultContainer: {
            ...containerStyles,
        },
        therrBlackRollingContainer: {
            ...containerStyles,
            marginHorizontal: '35%',
        },
        karaokeContainer: {
            ...containerStyles,
        },
        yellowCarContainer: {
            ...containerStyles,
        },

        // test styles
        defaultText: {
            ...getTextStyles(therrTheme),
        },
        therrBlackRollingText: {
            ...getTextStyles(therrTheme),
            color: therrTheme.colorVariations.textWhiteFade,
        },
        karaokeText: {
            ...getTextStyles(therrTheme),
        },
        yellowCarText: {
            ...getTextStyles(therrTheme),
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
