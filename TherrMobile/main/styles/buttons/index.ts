import { StyleSheet } from 'react-native';
import { IMobileThemeName } from 'therr-react/types';
import { buttonMenuHeight } from '../navigation/buttonMenu';
import { getTheme, ITherrTheme } from '../themes';

const collapseOffset = 20;

const btnStyles: any = {
    borderRadius: 100,
    padding: 1,
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    boxSizing: 'border-box',
};

const btnContainerStyles: any = {
    borderRadius: 100,
};

const getBtnIconStyle = (theme: ITherrTheme) => ({
    color: theme.colors.ternary,
    padding: 0,
});

const getBtnGroupBtnStyles = (theme: ITherrTheme): any => ({
    padding: 4,
    borderWidth: 0,
    backgroundColor: theme.colors.accent1,
    borderRadius: 0,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const getBottomLeftBtnViewStyles = (theme: ITherrTheme): any => ({
    position: 'absolute',
    left: 18,
    bottom: 60 + buttonMenuHeight - collapseOffset,
    shadowColor: theme.colors.textBlack,
    shadowOffset: {
        height: 1,
        width: 1,
    },
    shadowRadius: 4,
    borderRadius: 100,
    padding: 0,
});

const getLeftSmallButton1ViewStyles = (theme: ITherrTheme): any => ({
    position: 'absolute',
    left: 18,
    bottom: 60 + buttonMenuHeight - collapseOffset,
    shadowColor: theme.colors.textBlack,
    shadowOffset: {
        height: 1,
        width: 1,
    },
    shadowRadius: 4,
    borderRadius: 100,
    padding: 0,
});

const buttonGroupStyles: any = {
    width: '100%',
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 4,
};

const buildStyles = (themeName?: IMobileThemeName) => {
    const therrTheme = getTheme(themeName);

    const styles = StyleSheet.create({
        buttonGroup: {
            ...buttonGroupStyles,
            bottom: 40 + buttonMenuHeight - collapseOffset,
        },
        buttonGroupTop: {
            ...buttonGroupStyles,
            top: 10,
            zIndex: 100,
        },
        buttonGroupFilterList: {
            ...buttonGroupStyles,
            justifyContent: 'space-around',
            bottom: 100 + buttonMenuHeight - collapseOffset,
            zIndex: 100,
        },
        buttonGroupContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: therrTheme.colors.textBlack,
            shadowOffset: {
                height: 1,
                width: 1,
            },
            shadowRadius: 4,
            elevation: 2,
            borderRadius: 50,
            shadowOpacity: 0.5,
        },
        leftBtnGroupButtonContainer: {
            borderTopLeftRadius: 50,
            borderBottomLeftRadius: 50,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
        },
        rightBtnGroupButtonContainer: {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: 50,
            borderBottomRightRadius: 50,
        },
        btnGroupButtonContainer: {
            borderRadius: 50,
            minWidth: 100,
        },
        mapViewToggleButton: {
            ...getBtnGroupBtnStyles(therrTheme),
        },
        searchFiltersButton: {
            ...getBtnGroupBtnStyles(therrTheme),
        },
        searchThisAreaButton: {
            ...getBtnGroupBtnStyles(therrTheme),
            paddingHorizontal: 15,
            backgroundColor: therrTheme.colors.accent1,
        },
        searchFiltersTitle: {
            color: therrTheme.colors.accentTextWhite,
            paddingLeft: 5,
            fontSize: 14,
            lineHeight: 18,
        },
        searchThisAreaTitle: {
            color: therrTheme.colors.accentTextWhite,
            fontSize: 12,
            lineHeight: 13,
        },
        captureMoment: {
            position: 'absolute',
            right: 24,
            bottom: 130 + buttonMenuHeight - collapseOffset,
            shadowColor: therrTheme.colors.textBlack,
            shadowOffset: {
                height: 1,
                width: 1,
            },
            shadowRadius: 4,
            borderRadius: 100,
            padding: 0,
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'row',
        },
        claimASpace: {
            position: 'absolute',
            right: 24,
            bottom: 310 + buttonMenuHeight - collapseOffset,
            shadowColor: therrTheme.colors.textBlack,
            shadowOffset: {
                height: 1,
                width: 1,
            },
            shadowRadius: 4,
            borderRadius: 100,
            padding: 0,
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'row',
        },
        shareAThought: {
            position: 'absolute',
            right: 24,
            bottom: 250 + buttonMenuHeight - collapseOffset,
            shadowColor: therrTheme.colors.textBlack,
            shadowOffset: {
                height: 1,
                width: 1,
            },
            shadowRadius: 4,
            borderRadius: 100,
            padding: 0,
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'row',
        },
        uploadMoment: {
            position: 'absolute',
            right: 24,
            bottom: 190 + buttonMenuHeight - collapseOffset,
            shadowColor: therrTheme.colors.textBlack,
            shadowOffset: {
                height: 1,
                width: 1,
            },
            shadowRadius: 4,
            borderRadius: 100,
            padding: 0,
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'row',
        },
        addAMoment: {
            position: 'absolute',
            right: 20,
            bottom: 60 + buttonMenuHeight - collapseOffset,
            shadowColor: therrTheme.colors.textBlack,
            shadowOffset: {
                height: 1,
                width: 1,
            },
            shadowRadius: 4,
            borderRadius: 100,
            padding: 0,
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            zIndex: 10,
        },
        // collapse: {
        //     position: 'absolute',
        //     right: 18,
        //     bottom: collapseOffset + buttonMenuHeight,
        //     shadowColor: therrTheme.colors.textBlack,
        //     shadowOffset: {
        //         height: 1,
        //         width: 1,
        //     },
        //     shadowRadius: 4,
        //     borderRadius: 100,
        //     padding: 0,
        //     width: 96,
        //     height: 20,
        // },
        compass: {
            position: 'absolute',
            right: 84,
            bottom: 60 + buttonMenuHeight - collapseOffset,
            shadowColor: therrTheme.colors.textBlack,
            shadowOffset: {
                height: 1,
                width: 1,
            },
            shadowRadius: 4,
            borderRadius: 100,
            padding: 0,
        },
        toggleFollow: {
            ...getLeftSmallButton1ViewStyles(therrTheme),
        },
        locationEnable: {
            ...getLeftSmallButton1ViewStyles(therrTheme),
        },
        recenter: {
            position: 'absolute',
            right: 18,
            bottom: 126 + buttonMenuHeight - collapseOffset,
            shadowColor: therrTheme.colors.textBlack,
            shadowOffset: {
                height: 1,
                width: 1,
            },
            shadowRadius: 4,
            borderRadius: 100,
            padding: 0,
        },
        momentLayers: {
            position: 'absolute',
            left: 90,
            bottom: 60 + buttonMenuHeight - collapseOffset,
            shadowColor: therrTheme.colors.textBlack,
            shadowOffset: {
                height: 1,
                width: 1,
            },
            shadowRadius: 4,
            borderRadius: 100,
            padding: 0,
        },
        momentLayerOption1: {
            position: 'absolute',
            left: 96,
            bottom: 100 + buttonMenuHeight - collapseOffset,
            shadowColor: therrTheme.colors.textBlack,
            shadowOffset: {
                height: 1,
                width: 1,
            },
            shadowRadius: 4,
            borderRadius: 100,
            padding: 0,
            height: 32,
            width: 32,
        },
        momentLayerOption2: {
            position: 'absolute',
            left: 96,
            bottom: 160 + buttonMenuHeight - collapseOffset,
            shadowColor: therrTheme.colors.textBlack,
            shadowOffset: {
                height: 1,
                width: 1,
            },
            shadowRadius: 4,
            borderRadius: 100,
            padding: 0,
            height: 32,
            width: 32,
        },
        momentLayerOption3: {
            shadowColor: therrTheme.colors.textBlack,
            shadowOffset: {
                height: 1,
                width: 1,
            },
            shadowRadius: 4,
            borderRadius: 100,
            padding: 0,
            height: 34,
            width: 34,
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
        },
        momentLayerOption4: {
            shadowColor: therrTheme.colors.textBlack,
            shadowOffset: {
                height: 1,
                width: 1,
            },
            shadowRadius: 4,
            borderRadius: 100,
            padding: 0,
            height: 34,
            width: 34,
        },
        notifications: {
            ...getBottomLeftBtnViewStyles(therrTheme),
            zIndex: 10,
        },
        refreshMoments: {
            ...getBottomLeftBtnViewStyles(therrTheme),
        },
        btnContainer: {
            ...btnContainerStyles,
        },
        btn: {
            ...btnStyles,
            backgroundColor: therrTheme.colors.accent1,
        },
        btnMedium: {
            ...btnStyles,
            backgroundColor: therrTheme.colors.accent1,
            height: 34,
            width: 34,
        },
        btnMediumWithText: {
            ...btnStyles,
            backgroundColor: therrTheme.colors.accent1,
            height: 34,
            paddingHorizontal: 15,
        },
        btnMediumTitle: {
            paddingRight: 12,
        },
        btnLarge: {
            ...btnStyles,
            backgroundColor: therrTheme.colors.accent1,
            height: 44,
            width: 44,
        },
        btnClear: {
            ...btnStyles,
            backgroundColor: 'transparent',
        },
        btnTextWhite: {
            color: therrTheme.colorVariations.backgroundCreamLighten,
        },
        btnIcon: {
            ...getBtnIconStyle(therrTheme),
        },
        btnIconBright: {
            ...getBtnIconStyle(therrTheme),
            color: therrTheme.colors.brandingMapYellow,
        },
        btnIconWhite: {
            color: therrTheme.colors.accentTextWhite,
            padding: 0,
        },
        btnIconBlack: {
            color: therrTheme.colors.accentTextBlack,
            padding: 0,
        },
        btnIconInactive: {
            color: therrTheme.colors.primary3,
            padding: 0,
        },
        btnTitleBlack: {
            color: therrTheme.colors.accentTextBlack,
        },
        labelLeft: {
            marginRight: 8,
            backgroundColor: therrTheme.colorVariations.primaryFadeMore,
            borderRadius: 12,
            padding: 3,
            paddingHorizontal: 10,
            overflow: 'hidden',
        },
        mapView: {
            flex: 1,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
        momentAlertOverlayContainer: {
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 0,
            padding: 0,
            zIndex: 10000,
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
